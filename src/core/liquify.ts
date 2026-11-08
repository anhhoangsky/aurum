import type { LiquifyDab, LiquifyField } from './types';

/**
 * Free liquify is a small, resolution-independent displacement field. Dabs
 * live in source UV, so a 1080 px preview and a 6000 px export sample the same
 * warp; a tile never needs to know where the stroke started.
 *
 * The field is deliberately tiny (64 px on the short axis). Bilinear sampling
 * turns the bilinear falloff into a smooth warp, and a 64x96 RGBA texture is
 * 24 KB even for a portrait. That keeps the feature free on old GPUs.
 */
export const MAX_LIQUIFY_DABS = 640;
export const MAX_LIQUIFY_RADIUS = 0.35;
export const MAX_LIQUIFY_SHIFT = 0.09;

const FIELD_WIDTH = 64;
const FIELD_MIN_HEIGHT = 24;
const FIELD_MAX_HEIGHT = 128;

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/**
 * Accumulate every dab into one RGBA8 vector field. R/G encode the signed
 * source-UV displacement as `128 + value/shift*127`, so an untouched texel is
 * exactly 128 and decodes to zero. B is reserved; A is unused. The returned
 * `shift` is the actual maximum, which keeps the 8-bit quantisation as fine as
 * possible for small strokes.
 */
export function buildLiquifyField(
  dabs: readonly LiquifyDab[],
  sourceWidth: number,
  sourceHeight: number,
): LiquifyField | null {
  if (!dabs.length) return null;
  const width = FIELD_WIDTH;
  const aspect = clamp(
    sourceHeight / Math.max(1, sourceWidth),
    0.05,
    20,
  );
  const height = Math.max(
    FIELD_MIN_HEIGHT,
    Math.min(FIELD_MAX_HEIGHT, Math.round(width * aspect)),
  );
  const count = width * height;
  const accX = new Float32Array(count);
  const accY = new Float32Array(count);

  for (const dab of dabs) {
    const radius = clamp(dab.radius, 0.002, MAX_LIQUIFY_RADIUS);
    // A radius measured on the source width becomes a larger UV interval on
    // the source height whenever the photo is taller than it is wide.
    const radiusY = radius / aspect;
    const x0 = Math.max(0, Math.floor((dab.x - radius) * width));
    const x1 = Math.min(width - 1, Math.ceil((dab.x + radius) * width));
    const y0 = Math.max(0, Math.floor((dab.y - radiusY) * height));
    const y1 = Math.min(height - 1, Math.ceil((dab.y + radiusY) * height));
    for (let iy = y0; iy <= y1; iy += 1) {
      const v = (iy + 0.5) / height;
      const ny = (v - dab.y) / radiusY;
      for (let ix = x0; ix <= x1; ix += 1) {
        const u = (ix + 0.5) / width;
        const nx = (u - dab.x) / radius;
        const d2 = nx * nx + ny * ny;
        if (d2 >= 1) continue;
        const falloff = 1 - d2;
        const weight = falloff * falloff;
        const index = iy * width + ix;
        accX[index] += dab.dx * weight;
        accY[index] += dab.dy * weight;
      }
    }
  }

  let max = 0;
  for (let i = 0; i < count; i += 1) {
    max = Math.max(max, Math.abs(accX[i]), Math.abs(accY[i]));
  }
  if (max < 1e-6) return null;
  const shift = Math.min(MAX_LIQUIFY_SHIFT, max * 1.02);
  const data = new Uint8Array(count * 4);
  for (let i = 0; i < count; i += 1) {
    const x = clamp(accX[i], -shift, shift);
    const y = clamp(accY[i], -shift, shift);
    const at = i * 4;
    // 128 is the exact zero. 127 steps cover the signed range; using 127.5
    // would make every untouched texel a 0.0003 UV shift, which is visible as
    // a one-pixel drift on a 6000 px export.
    data[at] = Math.round(clamp(128 + (x / shift) * 127, 0, 255));
    data[at + 1] = Math.round(clamp(128 + (y / shift) * 127, 0, 255));
    data[at + 2] = 0;
    data[at + 3] = 255;
  }
  return { width, height, data, shift };
}
