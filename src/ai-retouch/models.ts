import type { OrtTensor } from './runtime';

export interface DecodedFace {
  box: { x: number; y: number; w: number; h: number }; // normalized
  confidence: number;
  landmarks: { eyeL: {x:number;y:number}; eyeR: {x:number;y:number}; nose: {x:number;y:number}; mouth: {x:number;y:number} } | null;
}

/** BlazeFace ORT inputs: image [1,3,128,128] RGB/255, thresholds. */
export function blazefaceToTensor(module: { Tensor: new (t: 'float32', d: Float32Array, dims: readonly number[]) => OrtTensor }, input: HTMLCanvasElement): OrtTensor {
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
  // selectedBoxes [1,16]: top_y, top_x, bot_y, bot_x, eyeL x/y, eyeR x/y, nose x/y, mouth x/y, earL x/y, earR x/y
  const d = output.data;
  if (d.length < 16) return [];
  const top_y = d[0] ?? 0, top_x = d[1] ?? 0, bot_y = d[2] ?? 0, bot_x = d[3] ?? 0;
  const x = Math.min(top_x, bot_x), y = Math.min(top_y, bot_y);
  const w = Math.abs(bot_x - top_x), h = Math.abs(bot_y - top_y);
  if (w <= 0 || h <= 0) return [];
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const face: DecodedFace = {
    box: { x: clamp01(x), y: clamp01(y), w: clamp01(w), h: clamp01(h) },
    confidence: 0.9,
    landmarks: {
      eyeL: { x: clamp01((d[4] ?? 0)), y: clamp01((d[5] ?? 0)) },
      eyeR: { x: clamp01((d[6] ?? 0)), y: clamp01((d[7] ?? 0)) },
      nose: { x: clamp01((d[8] ?? 0)), y: clamp01((d[9] ?? 0)) },
      mouth: { x: clamp01((d[10] ?? 0)), y: clamp01((d[11] ?? 0)) },
    },
  };
  return [face];
}
