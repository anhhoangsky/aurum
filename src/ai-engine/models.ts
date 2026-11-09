/**
 * Model adapters: the boundary between the generic runtime and one model's
 * preprocessing/output head.
 *
 * BiRefNet Lite 512 (studioludens/birefnet-lite-512, MIT) preprocessing is
 * taken from the artifact's `preprocessor_config.json` and validated against
 * Python ONNX Runtime (docs/ai-engine/benchmark/phase2-smoke.py):
 * - input: RGB resized to 512x512 (bilinear), rescale 1/255, ImageNet
 *   normalization mean [0.485, 0.456, 0.406] std [0.229, 0.224, 0.225],
 *   layout NCHW, tensor name `input_image`
 * - output: single-channel logits [1,1,512,512]; apply sigmoid externally,
 *   then bilinear-upscale to the original size (engine.ts / mask.ts).
 *
 * The pure helpers (`rgbaToNCHW`, `sigmoidMask`) are DOM-free so Node unit
 * tests can verify them against the Python reference numbers.
 */

import type { Mask } from './mask';
import type { OrtTensor } from './runtime';

export interface ModelAdapter {
  id: string;
  /** Native input edge (shortest edge for dynamic models; exact edge otherwise). */
  inputSize: number;
  /** True: input canvas is square inputSize×inputSize (BiRefNet). False: aspect-preserved (MODNet). */
  square: boolean;
  /** RGBA canvas (square or sized by engine) -> NCHW float32 tensor. */
  toTensor(module: { Tensor: new (t: 'float32', d: Float32Array, dims: readonly number[]) => OrtTensor }, input: HTMLCanvasElement): OrtTensor;
  /** Output tensor -> probability mask at canvas resolution. */
  fromTensor(output: OrtTensor, inputSize: number): Mask;
}

export const BIREFNET_MEAN = [0.485, 0.456, 0.406] as const;
export const BIREFNET_STD = [0.229, 0.224, 0.225] as const;

/**
 * RGBA8 (row-major, no padding) -> NCHW float32 with ImageNet normalization.
 * Bilinear resampling with the same pixel-centre convention as mask.ts.
 */
export function rgbaToNCHW(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  size: number,
  mean: readonly number[] = BIREFNET_MEAN,
  std: readonly number[] = BIREFNET_STD,
): Float32Array {
  if (rgba.length !== width * height * 4) {
    throw new Error(`rgbaToNCHW: expected ${width * height * 4} bytes, got ${rgba.length}`);
  }
  const out = new Float32Array(3 * size * size);
  const sx = width / size;
  const sy = height / size;
  for (let y = 0; y < size; y += 1) {
    const fy = (y + 0.5) * sy - 0.5;
    const y0 = Math.max(0, Math.floor(fy));
    const y1 = Math.min(height - 1, y0 + 1);
    const ty = Math.min(1, Math.max(0, fy - y0));
    for (let x = 0; x < size; x += 1) {
      const fx = (x + 0.5) * sx - 0.5;
      const x0 = Math.max(0, Math.floor(fx));
      const x1 = Math.min(width - 1, x0 + 1);
      const tx = Math.min(1, Math.max(0, fx - x0));
      const dst = y * size + x;
      for (let c = 0; c < 3; c += 1) {
        const top = rgba[(y0 * width + x0) * 4 + c]! * (1 - tx) + rgba[(y0 * width + x1) * 4 + c]! * tx;
        const bottom = rgba[(y1 * width + x0) * 4 + c]! * (1 - tx) + rgba[(y1 * width + x1) * 4 + c]! * tx;
        const v = (top * (1 - ty) + bottom * ty) / 255;
        out[c * size * size + dst] = (v - mean[c]!) / std[c]!;
      }
    }
  }
  return out;
}

/** Sigmoid of a single-channel logit tensor -> probability mask. */
export function sigmoidMask(output: OrtTensor, inputSize: number): Mask {
  const dims = output.dims;
  // Accept [1,1,H,W] or flattened [H*W].
  const h = dims.length === 4 ? Number(dims[2]) : inputSize;
  const w = dims.length === 4 ? Number(dims[3]) : inputSize;
  if (w !== inputSize || h !== inputSize) {
    throw new Error(`Unexpected BiRefNet output shape: ${dims.join('x')}`);
  }
  if (output.data.length < w * h) throw new Error('BiRefNet output is empty');
  const data = new Float32Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    const logit = output.data[i]!;
    data[i] = logit >= 0 ? 1 / (1 + Math.exp(-logit)) : Math.exp(logit) / (1 + Math.exp(logit));
  }
  return { width: w, height: h, data };
}

/** Normalize an already-sized RGBA image to NCHW float32 (no resize). */
export function normalizeNCHW(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  mean: readonly number[],
  std: readonly number[],
): Float32Array {
  if (rgba.length !== width * height * 4) {
    throw new Error(`normalizeNCHW: expected ${width * height * 4} bytes, got ${rgba.length}`);
  }
  const out = new Float32Array(3 * width * height);
  const pixels = width * height;
  for (let i = 0, j = 0; i < pixels; i += 1, j += 4) {
    for (let c = 0; c < 3; c += 1) {
      out[c * pixels + i] = (rgba[j + c]! / 255 - mean[c]!) / std[c]!;
    }
  }
  return out;
}

export const MODNET_MEAN = [0.5, 0.5, 0.5] as const;
export const MODNET_STD = [0.5, 0.5, 0.5] as const;

/** Copy a [0,1] alpha output tensor to a mask (no sigmoid — MODNet output). */
export function alphaMask(output: OrtTensor): Mask {
  const dims = output.dims;
  const h = dims.length === 4 ? Number(dims[2]) : 0;
  const w = dims.length === 4 ? Number(dims[3]) : 0;
  if (dims.length !== 4 || dims[0] !== 1 || dims[1] !== 1 || !w || !h) {
    throw new Error(`Unexpected MODNet output shape: ${dims.join('x')}`);
  }
  if (output.data.length < w * h) throw new Error('MODNet output is empty');
  const data = new Float32Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    data[i] = Math.min(1, Math.max(0, output.data[i]!));
  }
  return { width: w, height: h, data };
}

function createBIREFNETAdapter(id: string): ModelAdapter {
  return {
    id,
    inputSize: 512,
    square: true,
    toTensor(module, input) {
      const width = input.width;
      const height = input.height;
      const ctx = input.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('2D canvas is unavailable');
      const rgba = ctx.getImageData(0, 0, width, height).data;
      const data = rgbaToNCHW(rgba, width, height, 512);
      return new module.Tensor('float32', data, [1, 3, 512, 512]);
    },
    fromTensor(output, inputSize) {
      return sigmoidMask(output, inputSize);
    },
  };
}

function createISNetAdapter(id: string): ModelAdapter {
  return {
    id,
    inputSize: 1024,
    square: true,
    toTensor(module, input) {
      const width = input.width;
      const height = input.height;
      const ctx = input.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('2D canvas is unavailable');
      const rgba = ctx.getImageData(0, 0, width, height).data;
      // ISNet: (x - 128) / 256 with x in 0..255 == (v - 128/255) / (256/255).
      const data = rgbaToNCHW(rgba, width, height, 1024, [128 / 255, 128 / 255, 128 / 255], [256 / 255, 256 / 255, 256 / 255]);
      return new module.Tensor('float32', data, [1, 3, 1024, 1024]);
    },
    fromTensor(output, inputSize) {
      // ISNet output is already alpha in [0,1] (measured) — no sigmoid.
      const dims = output.dims;
      if (dims.length !== 4 || dims[0] !== 1 || dims[1] !== 1 || Number(dims[2]) !== inputSize || Number(dims[3]) !== inputSize) {
        throw new Error(`Unexpected ISNet output shape: ${dims.join('x')}`);
      }
      if (output.data.length < inputSize * inputSize) throw new Error('ISNet output is empty');
      const data = new Float32Array(inputSize * inputSize);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = Math.min(1, Math.max(0, output.data[i]!));
      }
      return { width: inputSize, height: inputSize, data };
    },
  };
}

function createMODNetAdapter(id: string): ModelAdapter {
  return {
    id,
    inputSize: 512,
    square: false,
    toTensor(module, input) {
      const width = input.width;
      const height = input.height;
      const ctx = input.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('2D canvas is unavailable');
      const rgba = ctx.getImageData(0, 0, width, height).data;
      const data = normalizeNCHW(rgba, width, height, MODNET_MEAN, MODNET_STD);
      return new module.Tensor('float32', data, [1, 3, height, width]);
    },
    fromTensor(output) {
      return alphaMask(output);
    },
  };
}

const adapters = new Map<string, ModelAdapter>();

export function registerModelAdapter(adapter: ModelAdapter): void {
  adapters.set(adapter.id, adapter);
}

export function getModelAdapter(id: string): ModelAdapter | undefined {
  return adapters.get(id);
}

export function listModelAdapters(): ModelAdapter[] {
  return Array.from(adapters.values());
}

// Built-in adapters. Registration is idempotent; hosts may override with
// their own adapter for the same id before creating the engine.
registerModelAdapter(createBIREFNETAdapter('birefnet-lite-512-fp16'));
registerModelAdapter(createBIREFNETAdapter('birefnet-lite-512-fp32'));
registerModelAdapter(createISNetAdapter('isnet-fp16'));
registerModelAdapter(createMODNetAdapter('modnet-fp16'));
registerModelAdapter(createMODNetAdapter('modnet-fp32'));
