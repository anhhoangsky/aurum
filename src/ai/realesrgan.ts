/**
 * Real-ESRGAN x4 v3 adapter for ONNX Runtime Web.
 *
 * This module is the only place that knows about ORT. It is built into the
 * separate `aurum-ai.esm.js` bundle so the core editor stays dependency-free and
 * under 50 KB gzip. The runtime and the 4.9 MB model are fetched only when the
 * user actually asks for AI processing.
 *
 * WebGPU is preferred. If session creation fails (driver blocklist, missing
 * adapter, unsupported op) the adapter falls back to the single-threaded WASM
 * build, which works without COOP/COEP. The input tile is already padded by the
 * pipeline; this adapter simply converts RGBA -> NCHW float32 and back.
 */

import type { AIAdapter, AIAdapterFactory } from '../core/enhance/ai';
import type { AIClientProfile } from './client';
import { REALESRGAN_ID, REALESRGAN_LICENSE, REALESRGAN_SCALE } from './plan';

interface OrtTensor {
  readonly data: Float32Array;
  readonly dims: readonly number[];
  readonly type: string;
}

interface OrtSession {
  readonly inputNames: readonly string[];
  readonly outputNames: readonly string[];
  run(feeds: Record<string, OrtTensor>): Promise<Record<string, OrtTensor>>;
  release?(): Promise<void>;
}

interface OrtEnv {
  wasm: {
    wasmPaths?: string | Record<string, string>;
    numThreads?: number;
    proxy?: boolean;
    simd?: boolean;
  };
  logLevel?: string;
}

interface OrtModule {
  readonly env: OrtEnv;
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

export interface RealESRGANRuntimeUrls {
  /** Self-contained `ort.webgpu.bundle.min.mjs`. */
  webgpu?: string;
  /** Self-contained `ort.wasm.bundle.min.mjs`. */
  wasm: string;
}

export interface RealESRGANFactoryOptions {
  /** URL of the ONNX model (`realesr-general-x4v3` or `Real-ESRGAN-x4plus`). */
  modelUrl: string;
  /** Used only for the progress message; the model itself is fetched by ORT. */
  modelSizeMB?: number;
  runtime: RealESRGANRuntimeUrls;
  /** Defaults to the probed backend. */
  backend?: 'webgpu' | 'wasm';
  profile?: AIClientProfile;
  /** WASM threads. Defaults to 1 unless the page is cross-origin isolated. */
  threads?: number;
  /** Optional diagnostic messages (runtime load, fallback). */
  onStatus?: (message: string) => void;
}

function abortError(): Error {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError();
}

async function importRuntime(url: string): Promise<OrtModule> {
  // The URL is supplied by the application at runtime; esbuild must not try to
  // resolve or bundle ONNX Runtime into the core.
  const module = (await import(/* webpackIgnore: true */ /* @vite-ignore */ url)) as OrtModule;
  if (!module?.InferenceSession || !module?.Tensor) {
    throw new Error('ONNX Runtime Web did not expose InferenceSession/Tensor');
  }
  return module;
}

/**
 * The application may pass runtime URLs relative to the page. ORT resolves its
 * WASM glue against `env.wasm.wasmPaths`, so that value must be absolute:
 * a relative one is resolved a second time against the runtime bundle and ends
 * up one directory too deep (e.g. `/dist/dist/ai/...`).
 */
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

function configure(module: OrtModule, url: string, options: RealESRGANFactoryOptions): void {
  const profile = options.profile;
  const threads =
    options.threads ??
    (profile?.wasmThreads ? Math.max(1, Math.min(4, profile.hardwareConcurrency || 1)) : 1);
  module.env.wasm.wasmPaths = runtimeDir(url);
  module.env.wasm.numThreads = threads;
  // A worker proxy needs `worker-src blob:` in the CSP and doubles peak memory;
  // the pipeline already yields between tiles, so stay on the main thread.
  module.env.wasm.proxy = false;
  module.env.wasm.simd = true;
  module.env.logLevel = 'error';
}

function toFloatTensor(module: OrtModule, input: HTMLCanvasElement): {
  tensor: OrtTensor;
  width: number;
  height: number;
} {
  const width = input.width;
  const height = input.height;
  if (!width || !height) throw new Error('AI input tile is empty');
  const ctx = input.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas is unavailable');
  const image = ctx.getImageData(0, 0, width, height);
  const rgba = image.data;
  const pixels = width * height;
  const data = new Float32Array(pixels * 3);
  for (let i = 0, j = 0; i < pixels; i += 1, j += 4) {
    data[i] = rgba[j] / 255;
    data[pixels + i] = rgba[j + 1] / 255;
    data[pixels * 2 + i] = rgba[j + 2] / 255;
  }
  return {
    tensor: new module.Tensor('float32', data, [1, 3, height, width]),
    width,
    height,
  };
}

function toCanvas(output: OrtTensor): HTMLCanvasElement {
  const dims = output.dims;
  if (dims.length !== 4 || dims[0] !== 1 || dims[1] !== 3) {
    throw new Error(`Unexpected AI output shape: ${dims.join('x')}`);
  }
  const height = Number(dims[2]);
  const width = Number(dims[3]);
  const pixels = width * height;
  if (!pixels || output.data.length < pixels * 3) {
    throw new Error('AI output is empty');
  }
  const rgba = new Uint8ClampedArray(pixels * 4);
  const src = output.data;
  for (let i = 0, j = 0; i < pixels; i += 1, j += 4) {
    const r = src[i];
    const g = src[pixels + i];
    const b = src[pixels * 2 + i];
    rgba[j] = r <= 0 ? 0 : r >= 1 ? 255 : (r * 255 + 0.5) | 0;
    rgba[j + 1] = g <= 0 ? 0 : g >= 1 ? 255 : (g * 255 + 0.5) | 0;
    rgba[j + 2] = b <= 0 ? 0 : b >= 1 ? 255 : (b * 255 + 0.5) | 0;
    rgba[j + 3] = 255;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is unavailable');
  ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
  return canvas;
}

async function openSession(
  module: OrtModule,
  backend: 'webgpu' | 'wasm',
  modelUrl: string,
): Promise<OrtSession> {
  return module.InferenceSession.create(modelUrl, {
    executionProviders: [backend],
    graphOptimizationLevel: 'all',
    executionMode: 'sequential',
    enableMemPattern: backend === 'wasm',
    enableCpuMemArena: backend === 'wasm',
  });
}

async function createAdapter(options: RealESRGANFactoryOptions): Promise<AIAdapter> {
  const modelUrl = absoluteUrl(options.modelUrl);
  let module: OrtModule | null = null;
  let session: OrtSession | null = null;
  let backend = options.backend ?? options.profile?.backend ?? 'wasm';
  let loaded = false;
  let disposed = false;
  let loading: Promise<void> | null = null;

  async function load(signal?: AbortSignal): Promise<void> {
    if (disposed) throw new Error('AI adapter was disposed');
    if (loaded) return;
    if (loading) {
      await loading;
      return;
    }
    loading = (async () => {
      throwIfAborted(signal);
      const preferredUrl = absoluteUrl(
        backend === 'webgpu' && options.runtime.webgpu
          ? options.runtime.webgpu
          : options.runtime.wasm,
      );
      options.onStatus?.(`Đang tải ONNX Runtime (${backend})…`);
      module = await importRuntime(preferredUrl);
      configure(module, preferredUrl, options);
      throwIfAborted(signal);

      try {
        const size = options.modelSizeMB ? ` ${options.modelSizeMB} MB` : '';
        options.onStatus?.(`Đang tải model AI${size} (${backend})…`);
        session = await openSession(module, backend, modelUrl);
      } catch (error) {
        if (backend !== 'webgpu' || !options.runtime.wasm) throw error;
        // Some GPUs/drivers advertise WebGPU but cannot compile the graph.
        console.warn('[aurum-ai] WebGPU session failed, falling back to WASM:', error);
        options.onStatus?.('WebGPU không khả dụng, chuyển sang WASM…');
        try {
          await session?.release?.();
        } catch {
          // Ignore release failures on a broken session.
        }
        session = null;
        backend = 'wasm';
        throwIfAborted(signal);
        const wasmUrl = absoluteUrl(options.runtime.wasm);
        module = await importRuntime(wasmUrl);
        configure(module, wasmUrl, options);
        session = await openSession(module, 'wasm', modelUrl);
      }
      throwIfAborted(signal);
      loaded = true;
    })();
    try {
      await loading;
    } finally {
      loading = null;
    }
  }

  return {
    id: REALESRGAN_ID,
    label: 'Real-ESRGAN general x4 v3',
    capabilities: ['super-resolution', 'denoise'],
    license: REALESRGAN_LICENSE,
    modelUrl,
    async load(signal?: AbortSignal) {
      await load(signal);
    },
    async run(input, signal?: AbortSignal) {
      if (!loaded || !session || !module) throw new Error('AI adapter is not loaded');
      throwIfAborted(signal);
      const { tensor, width, height } = toFloatTensor(module, input as HTMLCanvasElement);
      options.onStatus?.('Đang suy luận…');
      const result = await session.run({ [session.inputNames[0]]: tensor });
      throwIfAborted(signal);
      const output = result[session.outputNames[0]];
      if (!output) throw new Error('AI model returned no output');
      const canvas = toCanvas(output);
      if (canvas.width !== width * REALESRGAN_SCALE || canvas.height !== height * REALESRGAN_SCALE) {
        // Not fatal: the pipeline derives the scale from the actual output.
        options.onStatus?.(
          `AI trả về ${canvas.width}×${canvas.height} cho tile ${width}×${height}`,
        );
      }
      return canvas;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      loaded = false;
      const current = session;
      session = null;
      module = null;
      try {
        void current?.release?.();
      } catch {
        // Ignore.
      }
    },
  };
}

/** Build a factory the application can pass to `registerAIAdapter()`. */
export function createRealESRGANFactory(options: RealESRGANFactoryOptions): AIAdapterFactory {
  return {
    id: REALESRGAN_ID,
    label: 'Real-ESRGAN x4',
    capabilities: ['super-resolution', 'denoise'],
    license: REALESRGAN_LICENSE,
    load: () => createAdapter(options),
  };
}
