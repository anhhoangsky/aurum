/**
 * Generic ONNX Runtime Web session runner for retouch models.
 * Mirrors ai-engine runtime posture.
 */

export type RetouchBackend = 'webgpu' | 'wasm';

export interface OrtTensor {
  readonly data: Float32Array;
  readonly dims: readonly number[];
  readonly type: string;
}

export interface OrtSession {
  readonly inputNames: readonly string[];
  readonly outputNames: readonly string[];
  run(feeds: Record<string, OrtTensor>): Promise<Record<string, OrtTensor>>;
  release?(): Promise<void>;
  endProfiling?(): void;
}

export interface OrtModule {
  readonly env: {
    wasm: {
      wasmPaths?: string | Record<string, string>;
      numThreads?: number;
      proxy?: boolean;
      simd?: boolean;
    };
    logLevel?: string;
  };
  readonly Tensor: new (
    type: 'float32',
    data: Float32Array,
    dims: readonly number[],
  ) => OrtTensor;
  readonly InferenceSession: {
    create(
      model: string | Uint8Array,
      options?: Record<string, unknown>,
    ): Promise<OrtSession>;
  };
}

export interface RuntimeUrls {
  webgpu?: string;
  wasm: string;
}

export interface RuntimeOptions {
  runtime: RuntimeUrls;
  backend?: RetouchBackend;
  threads?: number;
  onStatus?: (message: string) => void;
}

export interface LoadedSession {
  session: OrtSession;
  module: OrtModule;
  backend: RetouchBackend;
  dispose(): Promise<void>;
}

function abortError(): Error {
  const err = new Error('Aborted');
  err.name = 'AbortError';
  return err;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError();
}

async function importRuntime(url: string): Promise<OrtModule> {
  const mod = (await import(/* webpackIgnore: true */ /* @vite-ignore */ url)) as OrtModule;
  if (!mod?.InferenceSession || !mod?.Tensor) {
    throw new Error('ONNX Runtime Web did not expose InferenceSession/Tensor');
  }
  return mod;
}

function absoluteUrl(url: string): string {
  try {
    return new URL(url, document.baseURI).href;
  } catch {
    return url;
  }
}

function runtimeDir(url: string): string {
  try {
    return new URL('./', url).href;
  } catch {
    return url.slice(0, url.lastIndexOf('/') + 1);
  }
}

function configure(mod: OrtModule, url: string, threads: number): void {
  mod.env.wasm.wasmPaths = runtimeDir(url);
  mod.env.wasm.numThreads = Math.max(1, threads);
  mod.env.wasm.proxy = false;
  mod.env.wasm.simd = true;
  mod.env.logLevel = 'error';
}

async function openSession(
  mod: OrtModule,
  backend: RetouchBackend,
  modelBytes: ArrayBuffer,
): Promise<OrtSession> {
  return mod.InferenceSession.create(new Uint8Array(modelBytes), {
    executionProviders: [backend],
    graphOptimizationLevel: 'all',
    executionMode: 'sequential',
    enableMemPattern: backend === 'wasm',
    enableCpuMemArena: backend === 'wasm',
  });
}

/**
 * Create a session from offline model bytes. WebGPU session failure falls
 * back to WASM (same as realesrgan.ts). The caller owns `dispose()`.
 */
export async function createSession(
  modelBytes: ArrayBuffer,
  options: RuntimeOptions,
  signal?: AbortSignal,
): Promise<LoadedSession> {
  throwIfAborted(signal);
  let backend: RetouchBackend = options.backend ?? 'wasm';
  let mod: OrtModule | null = null;
  let session: OrtSession | null = null;
  let disposed = false;

  const preferredUrl = absoluteUrl(
    backend === 'webgpu' && options.runtime.webgpu ? options.runtime.webgpu : options.runtime.wasm,
  );
  options.onStatus?.(`Loading ONNX Runtime (${backend})…`);
  mod = await importRuntime(preferredUrl);
  configure(mod, preferredUrl, options.threads ?? 1);
  throwIfAborted(signal);

  try {
    session = await openSession(mod, backend, modelBytes);
  } catch (error) {
    if (backend !== 'webgpu' || !options.runtime.wasm) throw error;
    console.warn('[aurum-ai-engine] WebGPU session failed, falling back to WASM:', error);
    options.onStatus?.('WebGPU unavailable, falling back to WASM…');
    backend = 'wasm';
    const wasmUrl = absoluteUrl(options.runtime.wasm);
    mod = await importRuntime(wasmUrl);
    configure(mod, wasmUrl, options.threads ?? 1);
    session = await openSession(mod, 'wasm', modelBytes);
  }
  throwIfAborted(signal);

  const active = session;
  return {
    session: active,
    module: mod,
    backend,
    async dispose() {
      if (disposed) return;
      disposed = true;
      try {
        await active.release?.();
      } catch {
        // Ignore release failures on a broken session.
      }
    },
  };
}

