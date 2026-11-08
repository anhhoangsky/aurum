/**
 * AurumEditorAdapter — converts AI Engine results into editor-usable assets
 * WITHOUT touching the WebGL rendering architecture.
 *
 * - `compositeTransparentPNG()`: original-resolution RGB + AI alpha → PNG blob.
 * - `previewCheckerboard()`: mask preview over a transparent checkerboard
 *   (or a custom background image) at preview resolution.
 *
 * The adapter only READS `core.sourceBitmap()` (read-only full-resolution
 * bitmap). It never calls mutating core methods; Phase 5 will wire undo/redo
 * and layer creation on top of this headless surface.
 */

import type { AISource } from './types';
import { applyAlpha, resizeMask, type Mask } from './mask';

function canvasOf(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function sourceSize(source: AISource): { width: number; height: number } {
  if (typeof HTMLImageElement !== 'undefined' && source instanceof HTMLImageElement) {
    return { width: source.naturalWidth || source.width, height: source.naturalHeight || source.height };
  }
  return { width: source.width, height: source.height };
}

function ctx2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is unavailable');
  return ctx;
}

/** Original-resolution transparent PNG from source RGB + AI foreground mask. */
export async function compositeTransparentPNG(
  source: AISource,
  foregroundMask: Mask,
): Promise<Blob> {
  const { width, height } = sourceSize(source);
  const canvas = canvasOf(width, height);
  const ctx = ctx2d(canvas);
  ctx.drawImage(source, 0, 0, width, height);
  const image = ctx.getImageData(0, 0, width, height);
  const mask = resizeMask(foregroundMask, width, height);
  applyAlpha(image.data, mask);
  ctx.putImageData(image, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('PNG encoding failed');
  return blob;
}

/**
 * Mask preview over a checkerboard (transparent) or a custom background.
 * Returns a canvas the host can display; the editor preview is untouched.
 */
export function previewCheckerboard(
  source: AISource,
  foregroundMask: Mask,
  options: { maxSide?: number; background?: AISource } = {},
): HTMLCanvasElement {
  const { width, height } = sourceSize(source);
  const maxSide = options.maxSide ?? 1080;
  const k = Math.min(1, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * k));
  const h = Math.max(1, Math.round(height * k));
  const canvas = canvasOf(w, h);
  const ctx = ctx2d(canvas);

  if (options.background) {
    const bs = sourceSize(options.background);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(options.background, 0, 0, bs.width, bs.height, 0, 0, w, h);
  } else {
    const cell = Math.max(4, Math.round(w / 16));
    for (let y = 0; y < h; y += cell) {
      for (let x = 0; x < w; x += cell) {
        ctx.fillStyle = (x / cell + y / cell) % 2 === 0 ? '#3a3a3f' : '#232327';
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }

  const fg = canvasOf(w, h);
  const fctx = ctx2d(fg);
  fctx.imageSmoothingEnabled = true;
  fctx.imageSmoothingQuality = 'high';
  fctx.drawImage(source, 0, 0, width, height, 0, 0, w, h);
  const image = fctx.getImageData(0, 0, w, h);
  applyAlpha(image.data, resizeMask(foregroundMask, w, h));
  fctx.putImageData(image, 0, 0);
  ctx.drawImage(fg, 0, 0);
  return canvas;
}
