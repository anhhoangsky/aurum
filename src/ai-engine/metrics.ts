/**
 * Quantitative mask metrics for the benchmark protocol (docs/ai-engine/
 * model-selection.md §G). All functions are DOM-free and operate on binarized
 * or soft masks of equal size. `threshold` defaults to 0.5.
 */

import type { Mask } from './mask';

function checkPair(a: Mask, b: Mask): void {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(`Metric size mismatch: ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  }
}

function binarize(mask: Mask, threshold: number): Uint8Array {
  const out = new Uint8Array(mask.data.length);
  for (let i = 0; i < mask.data.length; i += 1) out[i] = mask.data[i]! >= threshold ? 1 : 0;
  return out;
}

/** Intersection over Union on binarized masks. */
export function iou(a: Mask, b: Mask, threshold = 0.5): number {
  checkPair(a, b);
  const A = binarize(a, threshold);
  const B = binarize(b, threshold);
  let inter = 0;
  let union = 0;
  for (let i = 0; i < A.length; i += 1) {
    if (A[i]) union += 1;
    if (A[i] && B[i]) inter += 1;
    else if (B[i]) union += 1;
  }
  return union === 0 ? 1 : inter / union;
}

/** Dice coefficient (2*|A∩B| / (|A|+|B|)). */
export function dice(a: Mask, b: Mask, threshold = 0.5): number {
  checkPair(a, b);
  const A = binarize(a, threshold);
  const B = binarize(b, threshold);
  let inter = 0;
  let sizeA = 0;
  let sizeB = 0;
  for (let i = 0; i < A.length; i += 1) {
    if (A[i]) sizeA += 1;
    if (B[i]) sizeB += 1;
    if (A[i] && B[i]) inter += 1;
  }
  return sizeA + sizeB === 0 ? 1 : (2 * inter) / (sizeA + sizeB);
}

/** Mean absolute error between soft alpha masks. */
export function alphaMAE(a: Mask, b: Mask): number {
  checkPair(a, b);
  let sum = 0;
  for (let i = 0; i < a.data.length; i += 1) sum += Math.abs(a.data[i]! - b.data[i]!);
  return sum / Math.max(1, a.data.length);
}

function boundary(mask: Mask, threshold: number): Uint8Array {
  // 4-connected boundary: foreground pixels with a background neighbour.
  const B = binarize(mask, threshold);
  const { width: w, height: h } = mask;
  const out = new Uint8Array(B.length);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      if (!B[i]) continue;
      const neighbours = [
        y > 0 ? B[i - w] : 0,
        y < h - 1 ? B[i + w] : 0,
        x > 0 ? B[i - 1] : 0,
        x < w - 1 ? B[i + 1] : 0,
      ];
      if (neighbours.some((n) => n === 0)) out[i] = 1;
    }
  }
  return out;
}

/**
 * Boundary F-score with a distance tolerance (pixels). Precision = share of
 * predicted boundary within `tolerance` of the ground-truth boundary, and
 * vice versa. Distance is measured with a small BFS-limited expansion box
 * (tolerance is expected to be 1..3 px at evaluation resolution).
 */
export function boundaryFScore(
  predicted: Mask,
  groundTruth: Mask,
  tolerance = 1,
  threshold = 0.5,
): number {
  checkPair(predicted, groundTruth);
  const P = boundary(predicted, threshold);
  const G = boundary(groundTruth, threshold);
  const sizeP = P.reduce((s, v) => s + v, 0);
  const sizeG = G.reduce((s, v) => s + v, 0);
  if (sizeP === 0 && sizeG === 0) return 1;
  if (sizeP === 0 || sizeG === 0) return 0;

  const dilate = (B: Uint8Array, w: number, h: number, r: number): Uint8Array => {
    const out = new Uint8Array(B.length);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        if (!B[y * w + x]) continue;
        for (let dy = -r; dy <= r; dy += 1) {
          for (let dx = -r; dx <= r; dx += 1) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) out[ny * w + nx] = 1;
          }
        }
      }
    }
    return out;
  };

  const { width: w, height: h } = predicted;
  const GNear = dilate(G, w, h, tolerance);
  const PNear = dilate(P, w, h, tolerance);
  let precisionHits = 0;
  let recallHits = 0;
  for (let i = 0; i < P.length; i += 1) {
    if (P[i] && GNear[i]) precisionHits += 1;
    if (G[i] && PNear[i]) recallHits += 1;
  }
  const precision = precisionHits / sizeP;
  const recall = recallHits / sizeG;
  return precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
}
