export interface Mask { width: number; height: number; data: Float32Array; }

export function resizeMask(mask: Mask, width: number, height: number): Mask {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  if (w === mask.width && h === mask.height) return { width: mask.width, height: mask.height, data: new Float32Array(mask.data) };
  const src = mask.data;
  const out = new Float32Array(w * h);
  const sx = mask.width / w, sy = mask.height / h;
  for (let y = 0; y < h; y++) {
    const fy = (y + 0.5) * sy - 0.5;
    const y0 = Math.max(0, Math.floor(fy)), y1 = Math.min(mask.height - 1, y0 + 1);
    const ty = Math.min(1, Math.max(0, fy - y0));
    for (let x = 0; x < w; x++) {
      const fx = (x + 0.5) * sx - 0.5;
      const x0 = Math.max(0, Math.floor(fx)), x1 = Math.min(mask.width - 1, x0 + 1);
      const tx = Math.min(1, Math.max(0, fx - x0));
      const top = (src[y0 * mask.width + x0] ?? 0) * (1 - tx) + (src[y0 * mask.width + x1] ?? 0) * tx;
      const bottom = (src[y1 * mask.width + x0] ?? 0) * (1 - tx) + (src[y1 * mask.width + x1] ?? 0) * tx;
      out[y * w + x] = top * (1 - ty) + bottom * ty;
    }
  }
  return { width: w, height: h, data: out };
}

export function featherMask(mask: Mask, radius: number): Mask {
  const r = Math.max(0, Math.round(radius));
  if (r === 0) return { width: mask.width, height: mask.height, data: new Float32Array(mask.data) };
  const { width: w, height: h } = mask;
  const src = mask.data;
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const win = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let sum = 0;
    for (let x = -r; x <= r; x++) sum += src[row + Math.min(w - 1, Math.max(0, x))] ?? 0;
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum / win;
      sum += (src[row + Math.min(w - 1, x + r + 1)] ?? 0) - (src[row + Math.max(0, x - r)] ?? 0);
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.min(h - 1, Math.max(0, y)) * w + x] ?? 0;
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / win;
      sum += (tmp[Math.min(h - 1, y + r + 1) * w + x] ?? 0) - (tmp[Math.max(0, y - r) * w + x] ?? 0);
    }
  }
  return { width: w, height: h, data: out };
}

export function applyAlpha(rgba: Uint8ClampedArray, mask: Mask): Uint8ClampedArray {
  if (rgba.length !== mask.width * mask.height * 4) throw new Error('RGBA mask size mismatch');
  for (let i = 0, j = 0; i < mask.data.length; i++, j += 4) rgba[j + 3] = Math.round(Math.min(1, Math.max(0, mask.data[i] ?? 0)) * 255);
  return rgba;
}
