/**
 * Lazy MediaPipe Face Landmarker adapter.
 *
 * The core never imports this file. The editor loads the optional bundle only
 * after the user asks for face geometry, then this module fetches MediaPipe's
 * own loader, WASM and model from explicit self-hosted URLs. Nothing is sent
 * to a server and the core keeps working when any of it is missing.
 */

import type { FaceAnchor } from '../core/types';
import { anchorsFromLandmarks, type LandmarkPoint } from './math';

export interface LandmarkWasmAssets {
  /** Emscripten loader, e.g. vision_wasm_internal.js */
  loaderUrl: string;
  /** Matching binary, e.g. vision_wasm_internal.wasm */
  binaryUrl: string;
}

export interface FaceLandmarkerOptions {
  /** Self-hosted MediaPipe ESM fileset (serve as `.js`, not `.mjs`, for strict MIME). */
  moduleUrl: string;
  /** Self-hosted `face_landmarker.task`. */
  modelUrl: string;
  /** SIMD-capable loader/binary pair. */
  wasm: LandmarkWasmAssets;
  /** Optional no-SIMD pair for older browsers. */
  nosimd?: LandmarkWasmAssets;
  /** Longest side passed to the detector. Defaults to 960. */
  maxSize?: number;
  /** Maximum faces to return. Defaults to 4 (the core's uniform limit). */
  numFaces?: number;
  /** Defaults to 0.5. */
  minFaceDetectionConfidence?: number;
  /** Defaults to 0.5. */
  minFacePresenceConfidence?: number;
  /** Cancel before or after the model run. Downloads cannot be cancelled. */
  signal?: AbortSignal;
}

/** Only the tiny surface of the MediaPipe module this adapter needs. */
interface MediaPipeModule {
  FilesetResolver?: {
    isSimdSupported?: (useModule?: boolean) => Promise<boolean> | boolean;
  };
  FaceLandmarker?: {
    createFromOptions: (
      fileset: { wasmLoaderPath: string; wasmBinaryPath: string },
      options: Record<string, unknown>,
    ) => Promise<FaceLandmarkerLike>;
  };
}

interface FaceLandmarkerResult {
  faceLandmarks?: LandmarkPoint[][];
}

interface FaceLandmarkerLike {
  detect: (image: CanvasImageSource) => FaceLandmarkerResult;
  close?: () => void;
}

type LandmarkSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

interface RuntimeCache {
  key: string;
  promise: Promise<FaceLandmarkerLike>;
}

let cached: RuntimeCache | null = null;
let queue: Promise<unknown> = Promise.resolve();

function abortError(): Error {
  const error = new Error('Face landmark detection aborted');
  error.name = 'AbortError';
  return error;
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw abortError();
}

function runtimeKey(options: FaceLandmarkerOptions): string {
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
  options: FaceLandmarkerOptions,
): Promise<LandmarkWasmAssets> {
  let simd = true;
  try {
    const supported = module.FilesetResolver?.isSimdSupported;
    if (supported) simd = await supported.call(module.FilesetResolver, false);
  } catch {
    // If the probe itself fails, try the SIMD pair; the loader gives the final
    // answer and the caller can still fall back to `nosimd`.
    simd = true;
  }
  if (simd) return options.wasm;
  if (!options.nosimd) {
    throw new Error(
      'This browser lacks WebAssembly SIMD and no no-SIMD landmark assets were configured.',
    );
  }
  return options.nosimd;
}

async function createLandmarker(
  options: FaceLandmarkerOptions,
): Promise<FaceLandmarkerLike> {
  throwIfAborted(options.signal);
  const module = (await import(
    /* @vite-ignore */ options.moduleUrl
  )) as MediaPipeModule;
  throwIfAborted(options.signal);
  const factory = module.FaceLandmarker;
  if (!factory) throw new Error('MediaPipe FaceLandmarker is unavailable.');
  const wasm = await chooseWasm(module, options);
  throwIfAborted(options.signal);
  const landmarker = await factory.createFromOptions(
    {
      wasmLoaderPath: wasm.loaderUrl,
      wasmBinaryPath: wasm.binaryUrl,
    },
    {
      baseOptions: {
        modelAssetPath: options.modelUrl,
        delegate: 'CPU',
      },
      runningMode: 'IMAGE',
      numFaces: Math.max(1, Math.min(4, options.numFaces ?? 4)),
      minFaceDetectionConfidence:
        options.minFaceDetectionConfidence ?? 0.5,
      minFacePresenceConfidence:
        options.minFacePresenceConfidence ?? 0.5,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    },
  );
  return landmarker;
}

async function getLandmarker(
  options: FaceLandmarkerOptions,
): Promise<FaceLandmarkerLike> {
  const key = runtimeKey(options);
  if (cached && cached.key === key) return cached.promise;
  if (cached) {
    const previous = cached;
    cached = null;
    previous.promise.then((landmarker) => landmarker.close?.()).catch(() => {});
  }
  const promise = createLandmarker(options);
  cached = { key, promise };
  // A failed load must not poison the cache for a later retry.
  promise.catch(() => {
    if (cached?.promise === promise) cached = null;
  });
  return promise;
}

function sourceSize(source: LandmarkSource): { width: number; height: number } {
  const image = source as HTMLImageElement;
  const width =
    image.naturalWidth || image.width || (source as ImageBitmap).width || 0;
  const height =
    image.naturalHeight || image.height || (source as ImageBitmap).height || 0;
  return { width, height };
}

function makeInput(source: LandmarkSource, maxSize: number): HTMLCanvasElement {
  const { width, height } = sourceSize(source);
  if (width < 1 || height < 1) {
    throw new Error('Cannot detect landmarks on an empty image.');
  }
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas is unavailable for landmark input.');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function detectNow(
  source: LandmarkSource,
  options: FaceLandmarkerOptions,
): Promise<FaceAnchor[]> {
  throwIfAborted(options.signal);
  const landmarker = await getLandmarker(options);
  throwIfAborted(options.signal);
  const input = makeInput(source, Math.max(256, options.maxSize ?? 960));
  const result = landmarker.detect(input);
  throwIfAborted(options.signal);
  const faces = result?.faceLandmarks;
  return Array.isArray(faces) ? anchorsFromLandmarks(faces) : [];
}

/**
 * Detect one still image and return refined anchors. Calls are serialised
 * because the underlying MediaPipe task is not re-entrant; editor code can
 * still guard results against a newer source.
 */
export function detectFaceAnchors(
  source: LandmarkSource,
  options: FaceLandmarkerOptions,
): Promise<FaceAnchor[]> {
  const run = queue.then(() => detectNow(source, options));
  queue = run.catch(() => undefined);
  return run;
}

/** Release the cached MediaPipe instance and its WASM heap. */
export function closeFaceLandmarker(): void {
  const current = cached;
  cached = null;
  if (!current) return;
  current.promise
    .then((landmarker) => landmarker.close?.())
    .catch(() => {});
}
