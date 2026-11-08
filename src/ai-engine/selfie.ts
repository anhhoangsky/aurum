/**
 * Lazy MediaPipe Selfie Segmenter adapter (Phase 4 baseline).
 *
 * Mirrors `src/landmarks/mediapipe.ts`: the module, WASM and model come from
 * explicit self-hosted URLs supplied by the host; nothing is fetched from a
 * third party at inference time and the core keeps working when any of it is
 * missing. Output: binary person mask (category 1 of the selfie model:
 * 0 = background, 1 = person) at the input size (longest side capped at
 * 512 by default — the model itself is 256-class, upscaled after).
 */

import type { Mask } from './mask';
import { createMask } from './mask';

export interface SelfieWasmAssets {
  loaderUrl: string;
  binaryUrl: string;
}

export interface SelfieSegmenterOptions {
  /** Self-hosted `vision_bundle.js` (serve as `.js`, not `.mjs`). */
  moduleUrl: string;
  /** Self-hosted `selfie_segmenter.tflite` (see registry pin). */
  modelUrl: string;
  wasm: SelfieWasmAssets;
  nosimd?: SelfieWasmAssets;
  /** Longest side passed to the segmenter. Defaults to 512. */
  maxSize?: number;
  signal?: AbortSignal;
}

interface CategoryMaskLike {
  width: number;
  height: number;
  getAsUint8Array(): Uint8Array;
}

interface SegmenterResultLike {
  categoryMask?: CategoryMaskLike;
}

interface SegmenterLike {
  segment: (image: HTMLCanvasElement) => SegmenterResultLike;
  close?: () => void;
}

interface MediaPipeModule {
  FilesetResolver?: {
    isSimdSupported?: (useModule?: boolean) => Promise<boolean> | boolean;
  };
  ImageSegmenter?: {
    createFromOptions: (
      fileset: { wasmLoaderPath: string; wasmBinaryPath: string },
      options: Record<string, unknown>,
    ) => Promise<SegmenterLike>;
  };
}

type SelfieSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

let cached: { key: string; promise: Promise<SegmenterLike> } | null = null;
let queue: Promise<unknown> = Promise.resolve();

function abortError(): Error {
  const err = new Error('Selfie segmentation aborted');
  err.name = 'AbortError';
  return err;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError();
}

function runtimeKey(options: SelfieSegmenterOptions): string {
  return [
    options.moduleUrl,
    options.modelUrl,
    options.wasm.loaderUrl,
    options.wasm.binaryUrl,
    options.nosimd?.loaderUrl ?? '',
    options.nosimd?.binaryUrl ?? '',
  ].join('|');
}

async function chooseWasm(
  module: MediaPipeModule,
  options: SelfieSegmenterOptions,
): Promise<SelfieWasmAssets> {
  let simd = true;
  try {
    const supported = module.FilesetResolver?.isSimdSupported;
    if (supported) simd = await supported.call(module.FilesetResolver, false);
  } catch {
    simd = true;
  }
  if (simd) return options.wasm;
  if (!options.nosimd) throw new Error('No no-SIMD selfie segmenter assets configured.');
  return options.nosimd;
}

async function createSegmenter(options: SelfieSegmenterOptions): Promise<SegmenterLike> {
  throwIfAborted(options.signal);
  const module = (await import(/* @vite-ignore */ options.moduleUrl)) as MediaPipeModule;
  throwIfAborted(options.signal);
  const factory = module.ImageSegmenter;
  if (!factory) throw new Error('MediaPipe ImageSegmenter is unavailable.');
  const wasm = await chooseWasm(module, options);
  throwIfAborted(options.signal);
  return factory.createFromOptions(
    { wasmLoaderPath: wasm.loaderUrl, wasmBinaryPath: wasm.binaryUrl },
    {
      baseOptions: { modelAssetPath: options.modelUrl, delegate: 'CPU' },
      runningMode: 'IMAGE',
      outputType: 'CATEGORY_MASK',
    },
  );
}

function getSegmenter(options: SelfieSegmenterOptions): Promise<SegmenterLike> {
  const key = runtimeKey(options);
  if (cached && cached.key === key) return cached.promise;
  if (cached) {
    const previous = cached;
    cached = null;
    previous.promise.then((s) => s.close?.()).catch(() => {});
  }
  const promise = createSegmenter(options);
  cached = { key, promise };
  promise.catch(() => {
    if (cached?.promise === promise) cached = null;
  });
  return promise;
}

function sourceSize(source: SelfieSource): { width: number; height: number } {
  const image = source as HTMLImageElement;
  return {
    width: image.naturalWidth || image.width || (source as ImageBitmap).width || 0,
    height: image.naturalHeight || image.height || (source as ImageBitmap).height || 0,
  };
}

function makeInput(source: SelfieSource, maxSize: number): HTMLCanvasElement {
  const { width, height } = sourceSize(source);
  if (width < 1 || height < 1) throw new Error('Cannot segment an empty image.');
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is unavailable for segmenter input.');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function segmentNow(
  source: SelfieSource,
  options: SelfieSegmenterOptions,
): Promise<{ mask: Mask; inferenceMs: number }> {
  throwIfAborted(options.signal);
  const segmenter = await getSegmenter(options);
  throwIfAborted(options.signal);
  const input = makeInput(source, Math.max(128, options.maxSize ?? 512));
  const started = performance.now();
  const result = segmenter.segment(input);
  throwIfAborted(options.signal);
  const categoryMask = result?.categoryMask;
  if (!categoryMask) throw new Error('Selfie segmenter returned no category mask.');
  const categories = categoryMask.getAsUint8Array();
  const { width, height } = categoryMask;
  if (!width || !height || categories.length < width * height) {
    throw new Error('Selfie segmenter mask is empty.');
  }
  const mask = createMask(width, height);
  for (let i = 0; i < width * height; i += 1) {
    // Selfie model categories: 0 = background, 1 = person.
    mask.data[i] = categories[i] === 1 ? 1 : 0;
  }
  return { mask, inferenceMs: performance.now() - started };
}

/**
 * Segment the prominent person(s). Calls are serialised (MediaPipe tasks are
 * not re-entrant); callers guard against stale sources.
 */
export function segmentPersonWithSelfie(
  source: SelfieSource,
  options: SelfieSegmenterOptions,
): Promise<{ mask: Mask; inferenceMs: number }> {
  const run = queue.then(() => segmentNow(source, options));
  queue = run.catch(() => undefined);
  return run;
}

/** Release the cached segmenter and its WASM heap. */
export function closeSelfieSegmenter(): void {
  const current = cached;
  cached = null;
  if (!current) return;
  current.promise.then((s) => s.close?.()).catch(() => {});
}
