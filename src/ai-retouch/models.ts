import type { OrtTensor } from './runtime';

export interface DecodedFace {
  box: { x: number; y: number; w: number; h: number }; // normalized
  confidence: number;
  landmarks: { eyeL: {x:number;y:number}; eyeR: {x:number;y:number}; nose: {x:number;y:number}; mouth: {x:number;y:number} } | null;
}

/** BlazeFace ORT inputs: image [1,3,128,128] RGB/255, thresholds. */
export function blazefaceToTensor(module: { Tensor: new (t: string, d: Float32Array | BigInt64Array, dims: readonly number[]) => OrtTensor }, input: HTMLCanvasElement): OrtTensor {
  const w = input.width, h = input.height;
  const ctx = input.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas is unavailable');
  const rgba = ctx.getImageData(0, 0, w, h).data;
  // Resize to 128×128 bilinear (simplified: nearest of top-left for small input; canvas already resized)
  const data = new Float32Array(3 * 128 * 128);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const sx = Math.min(w - 1, Math.round((x / 128) * w));
      const sy = Math.min(h - 1, Math.round((y / 128) * h));
      const at = (sy * w + sx) * 4;
      const dst = y * 128 + x;
      data[0 * 128 * 128 + dst] = (rgba[at] ?? 0) / 255;
      data[1 * 128 * 128 + dst] = (rgba[at + 1] ?? 0) / 255;
      data[2 * 128 * 128 + dst] = (rgba[at + 2] ?? 0) / 255;
    }
  }
  return new module.Tensor('float32', data, [1, 3, 128, 128]);
}

export function decodeBlazeBoxes(output: OrtTensor): DecodedFace[] {
  // selectedBoxes flat: Nx16 blocks (N = detections). Each block:
  // top_y, top_x, bot_y, bot_x, eyeL x/y, eyeR x/y, nose x/y, mouth x/y, earL x/y, earR x/y
  // NMS output is [1,16] for 1 face, [1,896,16] padded when empty (all zeros).
  const d = output.data as Float32Array;
  if (!d.length) return [];
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const faces: DecodedFace[] = [];
  const blocks = Math.floor(d.length / 16);
  for (let i = 0; i < blocks; i++) {
    const o = i * 16;
    const top_y = d[o] ?? 0, top_x = d[o + 1] ?? 0, bot_y = d[o + 2] ?? 0, bot_x = d[o + 3] ?? 0;
    const x = Math.min(top_x, bot_x), y = Math.min(top_y, bot_y);
    const w = Math.abs(bot_x - top_x), h = Math.abs(bot_y - top_y);
    // Empty padding rows are all zeros => w/h = 0 => skip
    if (!(w > 0.001 && h > 0.001)) continue;
    // BlazeFace returns coordinates already in 0..1; guard against 0..128 scale
    const norm = (v: number) => (v > 1.5 ? clamp01(v / 128) : clamp01(v));
    faces.push({
      box: { x: norm(x), y: norm(y), w: norm(w), h: norm(h) },
      confidence: 0.9,
      landmarks: {
        eyeL: { x: norm(d[o + 4] ?? 0), y: norm(d[o + 5] ?? 0) },
        eyeR: { x: norm(d[o + 6] ?? 0), y: norm(d[o + 7] ?? 0) },
        nose: { x: norm(d[o + 8] ?? 0), y: norm(d[o + 9] ?? 0) },
        mouth: { x: norm(d[o + 10] ?? 0), y: norm(d[o + 11] ?? 0) },
      },
    });
    // Cap at max_detections (10); stop after first few valid rows
    if (faces.length >= 10) break;
  }
  return faces;
}
