/**
 * Adapter — composites the retouched image at original resolution.
 * Retinex whitening: original RGB + skin mask -> luminance boost on skin.
 *
 * Whitening formula (per skin pixel):
 *   Y = luma(R,G,B)
 *   boostedY = Y * (1 + strength * 0.35 * (1 - Y)) // lifts midtones more, shadows less
 *   scale = boostedY / max(Y, 1e-4)
 *   R' = clamp(R*scale), G' = clamp(G*scale), B' = clamp(B*scale)
 * Preserves hue, lifts only skin. Strength 0..1.
 */

import type { AISource } from './types';
import { resizeMask, type Mask } from './mask';

function canvasOf(width: number, height: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round(height));
  return c;
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

export async function compositeWhitened(
  source: AISource,
  skinMask: Mask,
  options: { strength?: number } = {},
): Promise<Blob> {
  const { width, height } = sourceSize(source);
  const canvas = canvasOf(width, height);
  const ctx = ctx2d(canvas);
  ctx.drawImage(source, 0, 0, width, height);
  const image = ctx.getImageData(0, 0, width, height);
  const mask = resizeMask(skinMask, width, height);
  const strength = Math.min(1, Math.max(0, options.strength ?? 0.5));
  const data = image.data;
  for (let i = 0, j = 0; i < mask.data.length; i++, j += 4) {
    const w = mask.data[i] ?? 0;
    if (w <= 0.001) continue;
    const r = data[j] ?? 0, g = data[j + 1] ?? 0, b = data[j + 2] ?? 0;
    const Y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const boosted = Math.min(1, Y * (1 + strength * 0.35 * (1 - Y) * w));
    const scale = Y <= 1e-4 ? 1 : boosted / Y;
    // Interpolate between original and boosted by mask weight
    const blend = w;
    data[j] = Math.round(Math.min(255, r * (1 - blend + blend * scale)));
    data[j + 1] = Math.round(Math.min(255, g * (1 - blend + blend * scale)));
    data[j + 2] = Math.round(Math.min(255, b * (1 - blend + blend * scale)));
  }
  ctx.putImageData(image, 0, 0);
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) throw new Error('PNG encoding failed');
  return blob;
}

export function previewCheckerboard(
  source: AISource,
  skinMask: Mask,
  options: { maxSide?: number } = {},
): HTMLCanvasElement {
  const { width, height } = sourceSize(source);
  const maxSide = options.maxSide ?? 1080;
  const k = Math.min(1, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * k));
  const h = Math.max(1, Math.round(height * k));
  const canvas = canvasOf(w, h);
  const ctx = ctx2d(canvas);
  // checker backdrop (shows transparent over edited area)
  const cell = Math.max(4, Math.round(w / 16));
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      ctx.fillStyle = (x / cell + y / cell) % 2 === 0 ? '#3a3a3f' : '#232327';
      ctx.fillRect(x, y, cell, cell);
    }
  }
  // Draw semi-transparent mask tint (gold) to visualize skin
  const mask = resizeMask(skinMask, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  for (let i = 0, j = 0; i < mask.data.length; i++, j += 4) {
    const v = mask.data[i] ?? 0;
    if (v > 0.02) {
      // gold tint proportional to mask
      data[j] = Math.round((data[j] ?? 0) * (1 - v * 0.35) + 243 * v * 0.35);
      data[j + 1] = Math.round((data[j + 1] ?? 0) * (1 - v * 0.35) + 199 * v * 0.35);
      data[j + 2] = Math.round((data[j + 2] ?? 0) * (1 - v * 0.35) + 123 * v * 0.35);
    }
  }
  ctx.putImageData(img, 0, 0);
  // Overlay source at 50% to show context
  ctx.globalAlpha = 0.55;
  ctx.drawImage(source, 0, 0, width, height, 0, 0, w, h);
  ctx.globalAlpha = 1;
  return canvas;
}
