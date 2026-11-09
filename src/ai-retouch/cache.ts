import type { InstalledModel } from './types';

const DB_NAME = 'aurum-ai-retouch';
const STORE = 'models';
const DB_VERSION = 1;

interface StoredRecord { id: string; version: string; bytes: ArrayBuffer; sha256: string; installedAt: number; }

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('IndexedDB is unavailable')); return; }
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
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface InstallOptions { signal?: AbortSignal; onProgress?: (loaded: number, total: number) => void; }

export async function installModelBytes(id: string, version: string, url: string, expectedSha256: string, options: InstallOptions = {}): Promise<InstalledModel> {
  const expected = expectedSha256.trim().toLowerCase();
  if (!expected) throw new Error(`Model "${id}" has no pinned SHA-256; refusing to install`);
  if (!url) throw new Error(`Model "${id}" has no download URL`);
  options.signal?.throwIfAborted();
  const response = await fetch(url, { signal: options.signal });
  if (!response.ok) throw new Error(`Model download failed: HTTP ${response.status}`);
  const bytes = await response.arrayBuffer();
  options.onProgress?.(bytes.byteLength, bytes.byteLength);
  const sha256 = await sha256Hex(bytes);
  if (sha256 !== expected) {
    const err = new Error(`Checksum mismatch for "${id}": expected ${expected}, got ${sha256}`);
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
  return records.map((r) => ({ id: r.id, version: r.version, bytes: r.bytes.byteLength, sha256: r.sha256, installedAt: r.installedAt }));
}
