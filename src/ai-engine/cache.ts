/**
 * Offline model store: IndexedDB for bytes + metadata.
 *
 * One database (`aurum-ai-engine`), one object store (`models`, key = model
 * id). `install()` verifies SHA-256 BEFORE accepting the bytes, and never
 * deletes an existing working model until the new version has verified
 * (atomic-ish replace inside a single transaction). All functions are
 * no-throw in non-browser environments (they reject with a clear message,
 * which callers surface as `runtime-unavailable`).
 */

import type { InstalledModel } from './types';

const DB_NAME = 'aurum-ai-engine';
const STORE = 'models';
const DB_VERSION = 1;

interface StoredRecord {
  id: string;
  version: string;
  bytes: ArrayBuffer;
  sha256: string;
  installedAt: number;
}

function idbAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!idbAvailable()) {
      reject(new Error('IndexedDB is unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
  });
}

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface InstallOptions {
  signal?: AbortSignal;
  onProgress?: (loaded: number, total: number) => void;
}

/**
 * Download `url`, verify its SHA-256 against `expectedSha256` (lowercase hex;
 * empty string means "not pinned" and is REJECTED here — pinning happens in
 * registry.ts), and atomically store it. Returns the installed metadata.
 */
export async function installModelBytes(
  id: string,
  version: string,
  url: string,
  expectedSha256: string,
  options: InstallOptions = {},
): Promise<InstalledModel> {
  const expected = expectedSha256.trim().toLowerCase();
  if (!expected) {
    throw new Error(`Model "${id}" has no pinned SHA-256; refusing to install`);
  }
  if (!url) throw new Error(`Model "${id}" has no download URL`);
  options.signal?.throwIfAborted();

  const response = await fetch(url, { signal: options.signal });
  if (!response.ok) throw new Error(`Model download failed: HTTP ${response.status}`);
  const total = Number(response.headers.get('content-length') || 0);
  if (!response.body || !options.onProgress) {
    const bytes = await response.arrayBuffer();
    return storeVerified(id, version, bytes, expected);
  }
  // Stream with progress so multi-MB downloads can show install UI.
  const reader = response.body.getReader();
  const chunks: ArrayBuffer[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    options.signal?.throwIfAborted();
    chunks.push(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
    loaded += value.byteLength;
    options.onProgress(loaded, total);
  }
  const bytes = new ArrayBuffer(loaded);
  const view = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    view.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  return storeVerified(id, version, bytes, expected);
}

async function storeVerified(
  id: string,
  version: string,
  bytes: ArrayBuffer,
  expectedSha256: string,
): Promise<InstalledModel> {
  const sha256 = await sha256Hex(bytes);
  if (sha256 !== expectedSha256) {
    const err = new Error(
      `Checksum mismatch for "${id}": expected ${expectedSha256}, got ${sha256}`,
    );
    err.name = 'ChecksumMismatch';
    throw err;
  }
  const db = await openDB();
  const record: StoredRecord = { id, version, bytes, sha256, installedAt: Date.now() };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB write failed'));
  });
  db.close();
  return { id, version, bytes: bytes.byteLength, sha256, installedAt: record.installedAt };
}

/** Model bytes for inference, or null when not installed. */
export async function loadModelBytes(id: string): Promise<ArrayBuffer | null> {
  const db = await openDB();
  const record = await new Promise<StoredRecord | undefined>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
    request.onsuccess = () => resolve(request.result as StoredRecord | undefined);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
  });
  db.close();
  return record?.bytes ?? null;
}

export async function listInstalledModels(): Promise<InstalledModel[]> {
  const db = await openDB();
  const records = await new Promise<StoredRecord[]>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as StoredRecord[]) ?? []);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
  });
  db.close();
  return records.map((r) => ({
    id: r.id,
    version: r.version,
    bytes: r.bytes.byteLength,
    sha256: r.sha256,
    installedAt: r.installedAt,
  }));
}

export async function removeModel(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB delete failed'));
  });
  db.close();
}
