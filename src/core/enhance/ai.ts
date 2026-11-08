/**
 * Optional AI adapters.
 *
 * Nothing in this file ships a model or a runtime. It defines the boundary the
 * core uses when an application wants to plug in a real ONNX/WASM/WebGPU model
 * (for example ONNX Runtime Web with a licensed denoise or restoration model),
 * plus the tiling/cancellation machinery such a model needs on mobile.
 *
 * The native GPU pipeline in `renderer.ts` is always available; AI is an
 * opt-in extra and must never be presented as enabled when no adapter/model is
 * loaded.
 */

import { nextFrame, throwIfAborted } from '../async';

export type AICapability =
  | 'denoise'
  | 'face-restore'
  | 'deblur'
  | 'super-resolution'
  | 'low-light'
  | 'segmentation'
  | 'matting';

export interface AIAdapter {
  readonly id: string;
  readonly label: string;
  readonly capabilities: readonly AICapability[];
  /** SPDX id or a short description of the model/weights licence. */
  readonly license: string;
  readonly modelUrl?: string;
  /** Load runtime + weights. Must reject on failure and honour the signal. */
  load(signal?: AbortSignal): Promise<void>;
  /** Process one tile. The returned bitmap must match the input aspect. */
  run(
    input: ImageBitmap | HTMLCanvasElement,
    signal?: AbortSignal,
  ): Promise<ImageBitmap | HTMLCanvasElement>;
  dispose(): void;
}

export interface AIAdapterFactory {
  readonly id: string;
  readonly label: string;
  readonly capabilities: readonly AICapability[];
  readonly license: string;
  /** The application supplies the dynamic import; the core stays dependency-free. */
  load(): Promise<AIAdapter>;
}

export type AIStage = 'resize' | 'load' | 'tile' | 'done';

export interface AIPipelineOptions {
  /** Input tile edge. Models with a fixed input size should use that size. */
  tileSize?: number;
  /** Output scale (2 or 4 for super-resolution). Defaults to 1. */
  scale?: number;
  /**
   * Context pixels around each tile, cropped after inference. Real-ESRGAN's
   * 34-conv body needs 40; generic models can use a smaller value.
   */
  halo?: number;
  /** @deprecated Alias for `halo`, kept for existing adapters. */
  overlap?: number;
  /** Cap the working input, e.g. when 4x output would exceed the canvas limit. */
  maxInputPixels?: number;
  /** Cap the output canvas area. */
  maxOutputPixels?: number;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
  onStage?: (stage: AIStage, done?: number, total?: number) => void;
}

const registry = new Map<string, AIAdapterFactory>();

/** Register an adapter factory. The core never imports a model itself. */
export function registerAIAdapter(factory: AIAdapterFactory): void {
  registry.set(factory.id, factory);
}

export function unregisterAIAdapter(id: string): void {
  registry.delete(id);
}

export function listAIAdapters(): AIAdapterFactory[] {
  return Array.from(registry.values());
}

export function getAIAdapter(id: string): AIAdapterFactory | undefined {
  return registry.get(id);
}

export { abortError, isAbortError, throwIfAborted } from '../async';

type AISource = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

function canvasOf(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function context2d(canvas: HTMLCanvasElement, read = false): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d', { willReadFrequently: read });
  if (!ctx) throw new Error('2D canvas is unavailable');
  return ctx;
}

function sourceSize(source: AISource): { width: number; height: number } {
  if (typeof HTMLImageElement !== 'undefined' && source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  return { width: source.width, height: source.height };
}

function fitWorking(
  width: number,
  height: number,
  maxInputPixels?: number,
  maxOutputPixels?: number,
  scale = 1,
): { width: number; height: number; k: number } {
  if (!maxInputPixels && !maxOutputPixels) return { width, height, k: 1 };
  const byInput = maxInputPixels
    ? Math.sqrt(Math.max(1, maxInputPixels) / Math.max(1, width * height))
    : 1;
  const byOutput = maxOutputPixels
    ? Math.sqrt(Math.max(1, maxOutputPixels) / Math.max(1, width * height * scale * scale))
    : 1;
  const k = Math.min(1, byInput, byOutput);
  return {
    width: Math.max(1, Math.floor(width * k)),
    height: Math.max(1, Math.floor(height * k)),
    k,
  };
}

/**
 * Draw the tile plus its halo. Pixels outside the source are filled by
 * replicating the nearest edge, which keeps a photo's border colour instead of
 * introducing a black frame. Interior seams are exact because the halo is
 * cropped away after inference.
 */
function drawPaddedTile(
  ctx: CanvasRenderingContext2D,
  source: AISource,
  imageWidth: number,
  imageHeight: number,
  x: number,
  y: number,
  w: number,
  h: number,
  halo: number,
): void {
  const px = x - halo;
  const py = y - halo;
  const pw = w + halo * 2;
  const ph = h + halo * 2;
  const sx = Math.max(0, px);
  const sy = Math.max(0, py);
  const sw = Math.min(imageWidth, px + pw) - sx;
  const sh = Math.min(imageHeight, py + ph) - sy;

  ctx.clearRect(0, 0, pw, ph);
  // Centre: real pixels, including the halo that overlaps neighbouring tiles.
  ctx.drawImage(source, sx, sy, sw, sh, sx - px, sy - py, sw, sh);
  // Top/bottom bands, then left/right bands (their full height covers corners).
  if (sy > py) ctx.drawImage(source, sx, 0, sw, 1, sx - px, 0, sw, sy - py);
  if (sy + sh < py + ph) {
    ctx.drawImage(
      source,
      sx,
      imageHeight - 1,
      sw,
      1,
      sx - px,
      sy + sh - py,
      sw,
      py + ph - (sy + sh),
    );
  }
  if (sx > px) ctx.drawImage(source, 0, sy, 1, sh, 0, sy - py, sx - px, sh);
  if (sx + sw < px + pw) {
    ctx.drawImage(
      source,
      imageWidth - 1,
      sy,
      1,
      sh,
      sx + sw - px,
      sy - py,
      px + pw - (sx + sw),
      sh,
    );
  }
  // Four corners, so a tile that is fully outside one axis still gets a colour.
  if (sx > px && sy > py) ctx.drawImage(source, 0, 0, 1, 1, 0, 0, sx - px, sy - py);
  if (sx + sw < px + pw && sy > py) {
    ctx.drawImage(
      source,
      imageWidth - 1,
      0,
      1,
      1,
      sx + sw - px,
      0,
      px + pw - (sx + sw),
      sy - py,
    );
  }
  if (sx > px && sy + sh < py + ph) {
    ctx.drawImage(
      source,
      0,
      imageHeight - 1,
      1,
      1,
      0,
      sy + sh - py,
      sx - px,
      py + ph - (sy + sh),
    );
  }
  if (sx + sw < px + pw && sy + sh < py + ph) {
    ctx.drawImage(
      source,
      imageWidth - 1,
      imageHeight - 1,
      1,
      1,
      sx + sw - px,
      sy + sh - py,
      px + pw - (sx + sw),
      py + ph - (sy + sh),
    );
  }
}

/**
 * Run an adapter over the source in halo-padded tiles. The destination is a
 * single canvas; only one input tile and one output tile are alive at a time,
 * which is what keeps an iPhone from allocating a 100 MB inference buffer.
 */
export async function runAIPipeline(
  adapter: AIAdapter,
  source: AISource,
  options: AIPipelineOptions = {},
): Promise<HTMLCanvasElement> {
  const { width, height } = sourceSize(source);
  if (!width || !height) throw new Error('AI pipeline needs a non-empty image');
  const scale = Math.max(0.25, Math.min(4, options.scale ?? 1));
  const tileSize = Math.max(32, Math.min(2048, Math.round(options.tileSize ?? 512)));
  const halo = Math.max(
    0,
    Math.min(128, Math.round(options.halo ?? options.overlap ?? 8)),
  );
  const working = fitWorking(
    width,
    height,
    options.maxInputPixels,
    options.maxOutputPixels,
    scale,
  );

  let inputSource: AISource = source;
  let inputWidth = width;
  let inputHeight = height;
  if (working.k < 1) {
    options.onStage?.('resize');
    const resized = canvasOf(working.width, working.height);
    const rctx = context2d(resized);
    rctx.imageSmoothingEnabled = true;
    rctx.imageSmoothingQuality = 'high';
    rctx.drawImage(source, 0, 0, width, height, 0, 0, working.width, working.height);
    inputSource = resized;
    inputWidth = working.width;
    inputHeight = working.height;
  }

  const outWidth = Math.max(1, Math.round(inputWidth * scale));
  const outHeight = Math.max(1, Math.round(inputHeight * scale));
  const destination = canvasOf(outWidth, outHeight);
  const destCtx = context2d(destination);
  destCtx.imageSmoothingEnabled = true;
  destCtx.imageSmoothingQuality = 'high';

  const tileCanvas = canvasOf(tileSize + halo * 2, tileSize + halo * 2);
  const tileCtx = context2d(tileCanvas, true);

  const cols = Math.ceil(inputWidth / tileSize);
  const rows = Math.ceil(inputHeight / tileSize);
  const total = cols * rows;

  try {
    options.onStage?.('load');
    await adapter.load(options.signal);
    let done = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        throwIfAborted(options.signal);
        const x = col * tileSize;
        const y = row * tileSize;
        const w = Math.min(tileSize, inputWidth - x);
        const h = Math.min(tileSize, inputHeight - y);
        const pw = w + halo * 2;
        const ph = h + halo * 2;

        if (tileCanvas.width !== pw || tileCanvas.height !== ph) {
          tileCanvas.width = pw;
          tileCanvas.height = ph;
        }
        drawPaddedTile(tileCtx, inputSource, inputWidth, inputHeight, x, y, w, h, halo);

        const output = await adapter.run(tileCanvas, options.signal);
        throwIfAborted(options.signal);
        const outW = 'width' in output ? output.width : pw;
        const outH = 'height' in output ? output.height : ph;
        const kx = outW / Math.max(1, pw);
        const ky = outH / Math.max(1, ph);
        const cropX = Math.min(outW - 1, halo * kx);
        const cropY = Math.min(outH - 1, halo * ky);
        const cropW = Math.min(outW - cropX, w * kx);
        const cropH = Math.min(outH - cropY, h * ky);
        // Consistent rounding at both edges: adjacent tiles meet exactly even
        // when the output scale is fractional.
        const dx = Math.round(x * scale);
        const dy = Math.round(y * scale);
        const dw = Math.max(1, Math.round((x + w) * scale) - dx);
        const dh = Math.max(1, Math.round((y + h) * scale) - dy);
        destCtx.drawImage(
          output as CanvasImageSource,
          cropX,
          cropY,
          cropW,
          cropH,
          dx,
          dy,
          dw,
          dh,
        );
        if ('close' in output && typeof output.close === 'function') output.close();

        done += 1;
        options.onStage?.('tile', done, total);
        options.onProgress?.(done / total);
        await nextFrame();
      }
    }
    options.onStage?.('done', total, total);
  } finally {
    adapter.dispose();
  }
  return destination;
}
