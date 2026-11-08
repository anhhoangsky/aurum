import type { Adjustments, AutoAnalysis, AutoResult } from '../types';
import { ADJUST_RANGES, clamp, defaultAdjust } from '../state';

type Bitmap = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

function luma(r: number, g: number, b: number): number {
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function percentile(hist: Uint32Array, total: number, fraction: number): number {
  const target = total * fraction;
  let sum = 0;
  for (let i = 0; i < 256; i += 1) {
    sum += hist[i];
    if (sum >= target) return i / 255;
  }
  return 1;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  const mid = values.length >> 1;
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) * 0.5;
}

/**
 * Downscale to a small canvas and gather the statistics Auto Enhance needs.
 * This is deliberately CPU-only and cheap (~256² pixels): it must never stall
 * the render loop, and it must work before any AI runtime is available.
 */
export async function analyzeBitmap(
  bitmap: Bitmap,
  maxSize = 256,
  faceCount = 0,
): Promise<AutoAnalysis> {
  const width = 'width' in bitmap ? bitmap.width : 0;
  const height = 'height' in bitmap ? bitmap.height : 0;
  if (!width || !height) throw new Error('Cannot analyse an empty image');
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const w = Math.max(8, Math.round(width * scale));
  const h = Math.max(8, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas is unavailable');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, w, h);
  let pixels: Uint8ClampedArray;
  try {
    pixels = ctx.getImageData(0, 0, w, h).data;
  } catch {
    throw new Error('Cannot analyse a cross-origin image without CORS');
  }

  // Yield once so a button-triggered analysis cannot block a paint.
  await new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });

  const total = w * h;
  const hist = new Uint32Array(256);
  const lumas = new Float32Array(total);
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sumSat = 0;
  let satCount = 0;
  let skin = 0;
  let clipLow = 0;
  let clipHigh = 0;

  for (let i = 0, p = 0; i < total; i += 1, p += 4) {
    const r = pixels[p] / 255;
    const g = pixels[p + 1] / 255;
    const b = pixels[p + 2] / 255;
    const l = luma(r, g, b);
    lumas[i] = l;
    hist[Math.round(l * 255)] += 1;
    sumR += r;
    sumG += g;
    sumB += b;
    if (l < 0.02) clipLow += 1;
    if (l > 0.98) clipHigh += 1;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max > 0.04) {
      sumSat += (max - min) / max;
      satCount += 1;
    }
    const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 0.5;
    const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 0.5;
    if (
      cr > 0.34 &&
      cr < 0.66 &&
      cb > 0.31 &&
      cb < 0.6 &&
      l > 0.12 &&
      l < 0.95
    ) {
      skin += 1;
    }
  }

  // Laplacian energy and block statistics for noise/sharpness.
  let lapSum = 0;
  let lapCount = 0;
  const block = 8;
  const blockStd: number[] = [];
  const blockGrad: number[] = [];
  for (let by = 0; by + block <= h; by += block) {
    for (let bx = 0; bx + block <= w; bx += block) {
      let sum = 0;
      let sum2 = 0;
      let grad = 0;
      let n = 0;
      for (let y = by; y < by + block; y += 1) {
        for (let x = bx; x < bx + block; x += 1) {
          const i = y * w + x;
          const l = lumas[i];
          sum += l;
          sum2 += l * l;
          if (x > 0 && y > 0 && x < w - 1 && y < h - 1) {
            const lap =
              4 * l - lumas[i - 1] - lumas[i + 1] - lumas[i - w] - lumas[i + w];
            grad += Math.abs(lap);
            lapSum += Math.abs(lap);
            lapCount += 1;
          }
          n += 1;
        }
      }
      const mean = sum / Math.max(1, n);
      const variance = Math.max(0, sum2 / Math.max(1, n) - mean * mean);
      blockStd.push(Math.sqrt(variance));
      blockGrad.push(grad / Math.max(1, n));
    }
  }
  const flat: number[] = [];
  if (blockGrad.length) {
    const sorted = blockGrad.slice().sort((a, b) => a - b);
    const threshold = sorted[Math.floor(sorted.length * 0.3)] ?? 0;
    for (let i = 0; i < blockGrad.length; i += 1) {
      if (blockGrad[i] <= threshold) flat.push(blockStd[i]);
    }
  }
  const noise = flat.length ? median(flat) : 0;
  const sharpness = lapCount ? lapSum / lapCount : 0;

  const analysis: AutoAnalysis = {
    width: w,
    height: h,
    mean: (sumR + sumG + sumB) / (total * 3),
    median: percentile(hist, total, 0.5),
    p1: percentile(hist, total, 0.01),
    p5: percentile(hist, total, 0.05),
    p95: percentile(hist, total, 0.95),
    p99: percentile(hist, total, 0.99),
    clipLow: clipLow / total,
    clipHigh: clipHigh / total,
    meanR: sumR / total,
    meanG: sumG / total,
    meanB: sumB / total,
    saturation: satCount ? sumSat / satCount : 0,
    noise,
    sharpness,
    skinRatio: skin / total,
    faceCount: Math.max(0, Math.round(faceCount)),
  };
  return analysis;
}

/**
 * Turn measurements into conservative adjustments. Every value is bounded by
 * the public ADJUST_RANGES, so Auto Enhance can never produce a state that
 * `setState()` would later clamp differently.
 */
export function autoAdjust(analysis: AutoAnalysis): AutoResult {
  const adjust = defaultAdjust();
  const notes: string[] = [];
  const set = (key: keyof Adjustments, value: number): void => {
    const [min, max] = ADJUST_RANGES[key];
    adjust[key] = clamp(Math.round(value), min, max);
  };

  const medianLuma = Math.max(0.035, analysis.median);
  const ev = clamp(Math.log2(0.46 / medianLuma), -0.75, 0.75);
  set('exposure', ev * 100);
  if (analysis.median < 0.3) notes.push('low-light');
  if (analysis.clipHigh > 0.03) notes.push('overexposed');
  if (analysis.clipLow > 0.05) notes.push('underexposed');

  const spread = analysis.p95 - analysis.p5;
  set('contrast', clamp((0.62 - spread) * 90, -18, 30));
  if (spread < 0.45) notes.push('flat');

  if (analysis.clipHigh > 0.015) {
    set('highlights', -clamp(analysis.clipHigh * 900, 10, 65));
  } else if (analysis.p95 > 0.94) {
    set('highlights', -15);
  } else if (analysis.p95 < 0.78) {
    set('highlights', 10);
  }

  if (analysis.p5 < 0.08) {
    set('shadows', clamp((0.08 - analysis.p5) * 420, 8, 55));
  }

  if (analysis.p99 < 0.88) {
    set('whites', clamp((0.88 - analysis.p99) * 120, 0, 20));
  } else if (analysis.clipHigh > 0.03) {
    set('whites', -12);
  }

  if (analysis.p1 > 0.1) {
    set('blacks', -clamp((analysis.p1 - 0.1) * 180, 0, 20));
  } else if (analysis.p1 < 0.01) {
    set('blacks', 6);
  }

  const wb = (analysis.meanB - analysis.meanR) * 90;
  set('warmth', clamp(wb, -22, 22));
  if (wb > 8) notes.push('cool-cast');
  if (wb < -8) notes.push('warm-cast');

  const green = (analysis.meanG - (analysis.meanR + analysis.meanB) * 0.5) * 120;
  set('tint', clamp(green, -18, 18));
  if (green > 8) notes.push('green-cast');
  if (green < -8) notes.push('magenta-cast');

  set('saturation', clamp((0.3 - analysis.saturation) * 70, -12, 22));
  set('vibrance', clamp((0.34 - analysis.saturation) * 55, -8, 26));

  if (analysis.sharpness < 0.025) {
    set('sharpen', clamp((0.025 - analysis.sharpness) * 600, 0, 30));
  }
  if (analysis.sharpness < 0.012) notes.push('soft');

  if (analysis.noise > 0.008) {
    set('denoise', clamp((analysis.noise - 0.008) * 700, 0, 40));
  }
  if (analysis.noise > 0.02) notes.push('noisy');

  set('clarity', clamp((0.62 - spread) * 40, 0, 18));

  if (analysis.skinRatio > 0.015 || analysis.faceCount > 0) {
    set('smoothSkin', clamp(analysis.skinRatio * 120 + analysis.faceCount * 3, 0, 24));
    notes.push('portrait');
  }

  return { adjust, analysis, notes };
}
