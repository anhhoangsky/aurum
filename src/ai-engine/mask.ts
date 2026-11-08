/**
 * DOM-free mask processing.
 *
 * A mask is a single-channel probability field (Float32Array, values 0..1,
 * row-major, no padding). All operations are pure functions returning NEW
 * masks; inputs are never mutated. This module has no DOM dependency so it
 * runs identically in the browser and in Node (unit tests import the built
 * bundle).
 *
 * Algorithms (deliberately simple and reviewable):
 * - feather / smooth: separable box blur (radius r, 2 passes ~ Gaussian-ish).
 * - expand / contract: separable max/min filter (dilation / erosion) with a
 *   square structuring element of radius r. O(w*h*r) worst case — callers
 *   keep r small (<= 32) and masks at inference resolution when possible.
 * - resize: bilinear interpolation (align-corners=false convention).
 * - add / subtract: pointwise max / 1-(1-a)*(1-b) style alpha compositing:
 *   add = max(a, b) for "paint foreground", subtract = a * (1 - b).
 * - brush dab: circular falloff (smoothstep) — used by the manual refinement
 *   tools (Phase 5 UI drives these primitives).
 */

export interface Mask {
  width: number;
  height: number;
  data: Float32Array;
}

export function createMask(width: number, height: number, fill = 0): Mask {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  return { width: w, height: h, data: new Float32Array(w * h).fill(fill) };
}

export function cloneMask(mask: Mask): Mask {
  return { width: mask.width, height: mask.height, data: new Float32Array(mask.data) };
}

export function invertMask(mask: Mask): Mask {
  const out = new Float32Array(mask.data.length);
  for (let i = 0; i < mask.data.length; i += 1) out[i] = 1 - mask.data[i]!;
  return { width: mask.width, height: mask.height, data: out };
}

export function thresholdMask(mask: Mask, threshold: number): Mask {
  const t = Math.min(1, Math.max(0, threshold));
  const out = new Float32Array(mask.data.length);
  for (let i = 0; i < mask.data.length; i += 1) out[i] = mask.data[i]! >= t ? 1 : 0;
  return { width: mask.width, height: mask.height, data: out };
}

/** Pointwise max (paint foreground over) or a*(1-b) (erase with brush b). */
export function combineMasks(a: Mask, b: Mask, mode: 'add' | 'subtract'): Mask {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(`Mask size mismatch: ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  }
  const out = new Float32Array(a.data.length);
  for (let i = 0; i < a.data.length; i += 1) {
    out[i] = mode === 'add' ? Math.max(a.data[i]!, b.data[i]!) : a.data[i]! * (1 - b.data[i]!);
  }
  return { width: a.width, height: a.height, data: out };
}

/** Separable box blur with edge clamping. radius <= 0 returns a clone. */
export function featherMask(mask: Mask, radius: number): Mask {
  const r = Math.max(0, Math.round(radius));
  if (r === 0) return cloneMask(mask);
  const { width: w, height: h } = mask;
  const src = mask.data;
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const win = 2 * r + 1;

  // Horizontal pass: src -> tmp
  for (let y = 0; y < h; y += 1) {
    const row = y * w;
    // Seed the sliding window with clamped edge values.
    let sum = 0;
    for (let x = -r; x <= r; x += 1) {
      const cx = Math.min(w - 1, Math.max(0, x));
      sum += src[row + cx]!;
    }
    for (let x = 0; x < w; x += 1) {
      tmp[row + x] = sum / win;
      const xOut = Math.min(w - 1, x + r + 1);
      const xIn = Math.max(0, x - r);
      sum += src[row + xOut]! - src[row + xIn]!;
    }
  }
  // Vertical pass: tmp -> out
  for (let x = 0; x < w; x += 1) {
    let sum = 0;
    for (let y = -r; y <= r; y += 1) {
      const cy = Math.min(h - 1, Math.max(0, y));
      sum += tmp[cy * w + x]!;
    }
    for (let y = 0; y < h; y += 1) {
      out[y * w + x] = sum / win;
      const yOut = Math.min(h - 1, y + r + 1);
      const yIn = Math.max(0, y - r);
      sum += tmp[yOut * w + x]! - tmp[yIn * w + x]!;
    }
  }
  return { width: w, height: h, data: out };
}

/** Separable max (expand) / min (contract) filter. */
export function morphMask(mask: Mask, radius: number, mode: 'expand' | 'contract'): Mask {
  const r = Math.max(0, Math.round(radius));
  if (r === 0) return cloneMask(mask);
  const { width: w, height: h } = mask;
  const src = mask.data;
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const pick = mode === 'expand' ? Math.max : Math.min;

  for (let y = 0; y < h; y += 1) {
    const row = y * w;
    for (let x = 0; x < w; x += 1) {
      let v = src[row + x]!;
      for (let k = -r; k <= r; k += 1) {
        const cx = Math.min(w - 1, Math.max(0, x + k));
        v = pick(v, src[row + cx]!);
      }
      tmp[row + x] = v;
    }
  }
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let v = tmp[y * w + x]!;
      for (let k = -r; k <= r; k += 1) {
        const cy = Math.min(h - 1, Math.max(0, y + k));
        v = pick(v, tmp[cy * w + x]!);
      }
      out[y * w + x] = v;
    }
  }
  return { width: w, height: h, data: out };
}

/** Bilinear resize with align-corners=false (pixel-centre convention). */
export function resizeMask(mask: Mask, width: number, height: number): Mask {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  if (w === mask.width && h === mask.height) return cloneMask(mask);
  const src = mask.data;
  const out = new Float32Array(w * h);
  const sx = mask.width / w;
  const sy = mask.height / h;
  for (let y = 0; y < h; y += 1) {
    const fy = (y + 0.5) * sy - 0.5;
    const y0 = Math.max(0, Math.floor(fy));
    const y1 = Math.min(mask.height - 1, y0 + 1);
    const ty = Math.min(1, Math.max(0, fy - y0));
    for (let x = 0; x < w; x += 1) {
      const fx = (x + 0.5) * sx - 0.5;
      const x0 = Math.max(0, Math.floor(fx));
      const x1 = Math.min(mask.width - 1, x0 + 1);
      const tx = Math.min(1, Math.max(0, fx - x0));
      const top = src[y0 * mask.width + x0]! * (1 - tx) + src[y0 * mask.width + x1]! * tx;
      const bottom = src[y1 * mask.width + x0]! * (1 - tx) + src[y1 * mask.width + x1]! * tx;
      out[y * w + x] = top * (1 - ty) + bottom * ty;
    }
  }
  return { width: w, height: h, data: out };
}

/** Circular brush dab with smoothstep falloff, in mask pixel coordinates. */
export function brushDab(
  mask: Mask,
  cx: number,
  cy: number,
  radius: number,
  strength: number,
  mode: 'add' | 'subtract',
): Mask {
  const out = cloneMask(mask);
  const r = Math.max(1, radius);
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(mask.width - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(mask.height - 1, Math.ceil(cy + r));
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy) / r;
      if (d >= 1) continue;
      const t = 1 - d;
      const falloff = t * t * (3 - 2 * t);
      const i = y * mask.width + x;
      const v = strength * falloff;
      out.data[i] = mode === 'add' ? Math.min(1, out.data[i]! + v) : Math.max(0, out.data[i]! - v);
    }
  }
  return out;
}

/**
 * Apply the mask as foreground alpha over RGBA pixels (original resolution).
 * `rgba` is modified in place; the SAME ImageData is returned for chaining.
 */
export function applyAlpha(rgba: Uint8ClampedArray, mask: Mask): Uint8ClampedArray {
  if (rgba.length !== mask.width * mask.height * 4) {
    throw new Error('applyAlpha: RGBA size does not match mask size');
  }
  for (let i = 0, j = 0; i < mask.data.length; i += 1, j += 4) {
    rgba[j + 3] = Math.round(Math.min(1, Math.max(0, mask.data[i]!)) * 255);
  }
  return rgba;
}

/** Convert a mask to an RGBA8 BeautyMask-shaped payload (A = foreground). */
export function maskToRGBA(mask: Mask): { width: number; height: number; data: Uint8Array } {
  const data = new Uint8Array(mask.width * mask.height * 4);
  for (let i = 0, j = 0; i < mask.data.length; i += 1, j += 4) {
    const v = Math.round(Math.min(1, Math.max(0, mask.data[i]!)) * 255);
    data[j] = v;
    data[j + 1] = v;
    data[j + 2] = v;
    data[j + 3] = v;
  }
  return { width: mask.width, height: mask.height, data };
}

export interface MaskComponent {
  id: number;
  mask: Mask;
  area: number;
  /** Mean probability inside the component (0..1). */
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
}

/**
 * Split a binarized mask into 4-connected components (flood fill).
 * Components smaller than `minArea` are dropped. This is how one semantic
 * person mask becomes per-instance masks — touching/overlapping people that
 * form a single component stay merged (documented limitation, not hidden).
 */
export function connectedComponents(
  mask: Mask,
  threshold = 0.5,
  minArea = 64,
): MaskComponent[] {
  const { width: w, height: h } = mask;
  const labels = new Int32Array(w * h).fill(-1);
  const stats = new Map<
    number,
    { area: number; sum: number; minX: number; minY: number; maxX: number; maxY: number }
  >();
  const stack: number[] = [];
  let nextId = 0;

  for (let start = 0; start < w * h; start += 1) {
    if (labels[start] !== -1 || mask.data[start]! < threshold) continue;
    const id = nextId;
    nextId += 1;
    let area = 0;
    let sum = 0;
    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;
    stack.length = 0;
    stack.push(start);
    labels[start] = id;
    while (stack.length > 0) {
      const i = stack.pop()!;
      const x = i % w;
      const y = (i / w) | 0;
      area += 1;
      sum += mask.data[i]!;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const neighbours = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1];
      for (const n of neighbours) {
        if (n >= 0 && labels[n] === -1 && mask.data[n]! >= threshold) {
          labels[n] = id;
          stack.push(n);
        }
      }
    }
    if (area >= minArea) {
      stats.set(id, { area, sum, minX, minY, maxX, maxY });
    }
  }
  const components: MaskComponent[] = [];
  for (const [id, st] of [...stats.entries()].sort((a, b) => a[0] - b[0])) {
    components.push({
      id,
      mask: createMask(w, h),
      area: st.area,
      confidence: st.sum / st.area,
      box: { x: st.minX, y: st.minY, w: st.maxX - st.minX + 1, h: st.maxY - st.minY + 1 },
    });
  }
  const byId = new Map(components.map((c) => [c.id, c]));
  for (let i = 0; i < w * h; i += 1) {
    const comp = byId.get(labels[i]);
    if (comp && mask.data[i]! >= threshold) comp.mask.data[i] = 1;
  }
  return components;
}
