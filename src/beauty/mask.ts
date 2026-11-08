/**
 * Optional beauty mask builder.
 *
 * This module is deliberately independent from the core renderer: it turns a
 * bitmap plus the server's normalised face boxes into a small RGBA texture.
 * The core shader samples it when present and otherwise keeps its procedural
 * YCbCr/ellipse mask, so devices that never load this bundle still work.
 *
 * Mask channels:
 *   R = skin
 *   G = protected features (eyes, brows, hair, beard)
 *   B = lips
 *   A = 255
 */

import type { BeautyMask, FaceBox } from '../core/types';

export type { BeautyMask };

/** Same normalised box the core accepts from the server-side detector. */
export type BeautyMaskFace = FaceBox;

export interface BeautyMaskOptions {
  /** Normalised face boxes in source-image coordinates. */
  faces?: BeautyMaskFace[];
  /** Longest side of the mask texture. 640 is enough for a 1080 px preview. */
  maxSize?: number;
  /** Separable box-blur radius in mask pixels. */
  feather?: number;
}

export interface BeautyMaskStats {
  skin: number;
  protect: number;
  lips: number;
}

interface Face {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  x: number;
  y: number;
  w: number;
  h: number;
  luma: number;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ellipse(u: number, v: number, cu: number, cv: number, ru: number, rv: number): number {
  const du = (u - cu) / Math.max(0.0001, ru);
  const dv = (v - cv) / Math.max(0.0001, rv);
  return 1 - smoothstep(0.72, 1.05, Math.sqrt(du * du + dv * dv));
}

function median(values: number[]): number {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  return values[values.length >> 1];
}

function faceLuma(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  face: BeautyMaskFace,
): number {
  const values: number[] = [];
  const cx = face.x + face.w / 2;
  const cy = face.y + face.h / 2;
  const rx = face.w * 0.42;
  const ry = face.h * 0.42;
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const u = (col + 0.5) / 7;
      const v = (row + 0.5) / 7;
      const px = Math.round((cx + (u * 2 - 1) * rx) * (width - 1));
      const py = Math.round((cy + (v * 2 - 1) * ry) * (height - 1));
      if (px < 0 || py < 0 || px >= width || py >= height) continue;
      const at = (py * width + px) * 4;
      values.push(luma(data[at] / 255, data[at + 1] / 255, data[at + 2] / 255));
    }
  }
  return values.length ? median(values) : 0.55;
}

interface SkinReference {
  cr: number;
  cb: number;
}

/**
 * Learn the actual skin chroma from cheeks and forehead. A fixed YCbCr window
 * is too broad (teal walls pass it) and too narrow for very dark skin; the
 * detected face gives us a reference that travels with the subject.
 */
function sampleSkin(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  faces: BeautyMaskFace[],
): SkinReference | null {
  const crs: number[] = [];
  const cbs: number[] = [];
  const points = [
    [0.3, 0.62],
    [0.7, 0.62],
    [0.5, 0.26],
  ];
  for (const face of faces) {
    for (const [lu, lv] of points) {
      const cx = Math.round((face.x + lu * face.w) * (width - 1));
      const cy = Math.round((face.y + lv * face.h) * (height - 1));
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const px = cx + dx;
          const py = cy + dy;
          if (px < 0 || py < 0 || px >= width || py >= height) continue;
          const at = (py * width + px) * 4;
          const r = data[at] / 255;
          const g = data[at + 1] / 255;
          const b = data[at + 2] / 255;
          crs.push(0.5 + 0.5 * r - 0.418688 * g - 0.081312 * b);
          cbs.push(0.5 - 0.168736 * r - 0.331264 * g + 0.5 * b);
        }
      }
    }
  }
  if (crs.length < 12) return null;
  return { cr: median(crs), cb: median(cbs) };
}

function boxBlur(data: Uint8Array, width: number, height: number, radius: number): void {
  if (radius < 1) return;
  const temp = new Uint8Array(data.length);
  const span = radius * 2 + 1;
  for (let y = 0; y < height; y += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      let sum = 0;
      for (let x = -radius; x <= radius; x += 1) {
        const sx = Math.min(width - 1, Math.max(0, x));
        sum += data[(y * width + sx) * 4 + channel];
      }
      for (let x = 0; x < width; x += 1) {
        const at = (y * width + x) * 4 + channel;
        temp[at] = Math.round(sum / span);
        const outX = Math.min(width - 1, Math.max(0, x - radius));
        const inX = Math.min(width - 1, Math.max(0, x + radius + 1));
        sum += data[(y * width + inX) * 4 + channel] - data[(y * width + outX) * 4 + channel];
      }
    }
  }
  for (let x = 0; x < width; x += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      let sum = 0;
      for (let y = -radius; y <= radius; y += 1) {
        const sy = Math.min(height - 1, Math.max(0, y));
        sum += temp[(sy * width + x) * 4 + channel];
      }
      for (let y = 0; y < height; y += 1) {
        const at = (y * width + x) * 4 + channel;
        data[at] = Math.round(sum / span);
        const outY = Math.min(height - 1, Math.max(0, y - radius));
        const inY = Math.min(height - 1, Math.max(0, y + radius + 1));
        sum += temp[(inY * width + x) * 4 + channel] - temp[(outY * width + x) * 4 + channel];
      }
    }
  }
}

export type BeautyMaskSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

function sourceSize(source: BeautyMaskSource): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  return { width: source.width, height: source.height };
}

/**
 * Build the mask at a bounded resolution. Face coordinates are normalised, so
 * the same mask works for preview and full-resolution tile export.
 */
export function buildBeautyMask(
  source: BeautyMaskSource,
  options: BeautyMaskOptions = {},
): BeautyMask {
  const maxSize = Math.max(64, Math.min(2048, Math.round(options.maxSize ?? 640)));
  const { width: sourceWidth, height: sourceHeight } = sourceSize(source);
  const scale = Math.min(1, maxSize / Math.max(1, sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Beauty mask needs a 2D canvas');
  ctx.drawImage(source, 0, 0, width, height);
  const image = ctx.getImageData(0, 0, width, height);
  const pixels = image.data;

  const boxes = (options.faces ?? [])
    .filter((face) => face.w > 0 && face.h > 0)
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    .slice(0, 4);
  const faces: Face[] = boxes.map((face) => ({
    x: face.x,
    y: face.y,
    w: face.w,
    h: face.h,
    cx: face.x + face.w / 2,
    cy: face.y + face.h / 2,
    rx: face.w * 0.62,
    ry: face.h * 0.72,
    luma: faceLuma(pixels, width, height, face),
  }));
  const reference = sampleSkin(pixels, width, height, boxes);

  const out = new Uint8Array(width * height * 4);
  for (let py = 0; py < height; py += 1) {
    const v = (py + 0.5) / height;
    for (let px = 0; px < width; px += 1) {
      const u = (px + 0.5) / width;
      const at = (py * width + px) * 4;
      const r = pixels[at] / 255;
      const g = pixels[at + 1] / 255;
      const b = pixels[at + 2] / 255;
      const y = luma(r, g, b);
      const cr = 0.5 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const cb = 0.5 - 0.168736 * r - 0.331264 * g + 0.5 * b;

      // Skin chroma. With face boxes we compare against the sampled skin
      // reference; without them we fall back to a conservative fixed window
      // (Cb 0.30-0.50, Cr 0.50-0.72), which rejects teal and most foliage.
      const lumaGate = smoothstep(0.06, 0.18, y) * (1 - smoothstep(0.93, 1.0, y));
      let chroma: number;
      if (reference) {
        const dcr = cr - reference.cr;
        const dcb = cb - reference.cb;
        const distance = Math.sqrt(dcr * dcr + dcb * dcb);
        chroma = (1 - smoothstep(0.035, 0.085, distance)) * lumaGate;
      } else {
        chroma =
          smoothstep(0.50, 0.55, cr) * (1 - smoothstep(0.68, 0.72, cr)) *
          smoothstep(0.30, 0.34, cb) * (1 - smoothstep(0.46, 0.50, cb)) *
          lumaGate;
      }

      let face = 0;
      let protect = 0;
      let lips = 0;
      let best: Face | null = null;
      let bestWeight = 0;
      for (const item of faces) {
        const dx = (u - item.cx) / Math.max(0.0001, item.rx);
        const dy = (v - item.cy) / Math.max(0.0001, item.ry);
        const weight = 1 - smoothstep(0.72, 1.0, Math.sqrt(dx * dx + dy * dy));
        if (weight > bestWeight) {
          bestWeight = weight;
          best = item;
        }
        face = Math.max(face, weight);
      }

      if (best) {
        const lu = (u - best.x) / Math.max(0.0001, best.w);
        const lv = (v - best.y) / Math.max(0.0001, best.h);
        // Facial hair, brows and eyes are much darker than the face median.
        // A relative threshold keeps dark skin from being treated as hair.
        const dark = 1 - smoothstep(best.luma * 0.46, best.luma * 0.72, y);
        const eyeL = ellipse(lu, lv, 0.32, 0.42, 0.14, 0.095) * dark;
        const eyeR = ellipse(lu, lv, 0.68, 0.42, 0.14, 0.095) * dark;
        const browL = ellipse(lu, lv, 0.32, 0.31, 0.19, 0.06) * dark;
        const browR = ellipse(lu, lv, 0.68, 0.31, 0.19, 0.06) * dark;
        // The forehead band catches a fringe; the side ellipses catch hair
        // that hangs into the face box without relying on a face-parsing model.
        const hair =
          ellipse(lu, lv, 0.5, 0.1, 0.5, 0.14) * dark +
          ellipse(lu, lv, 0.04, 0.5, 0.16, 0.5) * dark +
          ellipse(lu, lv, 0.96, 0.5, 0.16, 0.5) * dark;
        const beard = ellipse(lu, lv, 0.5, 0.84, 0.36, 0.18) * dark;
        lips =
          ellipse(lu, lv, 0.5, 0.7, 0.17, 0.075) *
          smoothstep(0.05, 0.16, r - Math.max(g, b));
        protect = clamp01(
          Math.max(eyeL, eyeR, browL, browR, hair, beard, lips * 0.55),
        );
      }

      // Inside a face box the ellipse carries the mask; outside it (neck,
      // shoulders) the reference match still contributes at reduced strength.
      const gate = faces.length ? Math.max(0.3, face) : 1;
      const skin = clamp01(chroma * gate * (1 - protect));
      out[at] = Math.round(skin * 255);
      out[at + 1] = Math.round(clamp01(protect) * 255);
      out[at + 2] = Math.round(clamp01(lips) * 255);
      out[at + 3] = 255;
    }
  }

  boxBlur(out, width, height, Math.max(0, Math.min(8, Math.round(options.feather ?? 2))));
  return { width, height, data: out };
}

export function beautyMaskStats(mask: BeautyMask): BeautyMaskStats {
  let skin = 0;
  let protect = 0;
  let lips = 0;
  const count = mask.width * mask.height;
  for (let i = 0; i < mask.data.length; i += 4) {
    skin += mask.data[i];
    protect += mask.data[i + 1];
    lips += mask.data[i + 2];
  }
  return {
    skin: skin / Math.max(1, count * 255),
    protect: protect / Math.max(1, count * 255),
    lips: lips / Math.max(1, count * 255),
  };
}
