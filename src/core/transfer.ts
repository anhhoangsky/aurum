/**
 * sRGB transfer functions and the 256-entry lookup table shared by the GPU
 * pipeline and the CPU helpers.
 *
 * The shader stores the decode curve in the red channel and the encode curve
 * in the green channel of one RGBA8 texture, so a hybrid pipeline only needs
 * one texture unit and one sample per channel. The table is generated once and
 * never shipped as an asset.
 */

export const TRANSFER_LUT_SIZE = 256;

export function srgbToLinear(value: number): number {
  const v = value < 0 ? 0 : value > 1 ? 1 : value;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function linearToSrgb(value: number): number {
  const v = value < 0 ? 0 : value > 1 ? 1 : value;
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

let cached: Uint8Array | null = null;

/**
 * RGBA8 atlas: R = sRGB -> linear, G = linear -> sRGB, B = 0, A = 255.
 * The shader samples with a half-texel offset so entry i maps exactly to
 * i / 255; linear filtering then interpolates between adjacent entries.
 */
export function transferLUT(): Uint8Array {
  if (cached) return cached;
  const data = new Uint8Array(TRANSFER_LUT_SIZE * 4);
  for (let i = 0; i < TRANSFER_LUT_SIZE; i += 1) {
    const v = i / (TRANSFER_LUT_SIZE - 1);
    const at = i * 4;
    data[at] = Math.round(srgbToLinear(v) * 255);
    data[at + 1] = Math.round(linearToSrgb(v) * 255);
    data[at + 2] = 0;
    data[at + 3] = 255;
  }
  cached = data;
  return data;
}
