/**
 * Tile planning for `realesr-general-x4v3`.
 *
 * The model is fully convolutional with a 34-conv body, so its receptive field
 * is 34 input pixels. A 40 px halo makes interior tile seams numerically exact
 * (measured max error < 1e-5); the halo is *not* an overlap that is blended
 * afterwards, it is real context that is cropped away after inference.
 *
 * A 4x pass over a phone photo can exceed the browser canvas limit and the
 * device's memory long before it exceeds the model's dynamic shape support.
 * This planner therefore probes the client, caps input/output pixels, picks the
 * largest tile that fits the estimated peak memory, and reports the decision so
 * the UI can explain why a photo was resized.
 */

import type { AIClientProfile, AIBackend } from './client';

export const REALESRGAN_ID = 'realesr-general-x4v3';
export const REALESRGAN_SCALE = 4;
/** 34 convs => 34 px radius; 40 leaves a safety margin for Resize rounding. */
export const REALESRGAN_HALO = 40;
export const REALESRGAN_LICENSE = 'BSD-3-Clause';

export type RealESRGANModel = 'balanced' | 'high';

export interface RealESRGANModelInfo {
  readonly id: RealESRGANModel;
  readonly label: string;
  readonly file: string;
  readonly sizeMB: number;
  readonly halo: number;
  readonly license: string;
}

/**
 * The compact model is the default. `x4plus` has 23 RRDB blocks and much
 * larger activations, so it gets its own, lower memory caps and a wider halo
 * (96 px instead of 40 px) to keep tile seams out of the visible result.
 */
export const REALESRGAN_MODELS: Record<RealESRGANModel, RealESRGANModelInfo> = {
  balanced: {
    id: 'balanced',
    label: 'Cân bằng',
    file: 'realesr-general-x4v3.onnx',
    sizeMB: 4.9,
    halo: REALESRGAN_HALO,
    license: REALESRGAN_LICENSE,
  },
  high: {
    id: 'high',
    label: 'Chất lượng cao',
    file: 'Real-ESRGAN-x4plus.onnx',
    sizeMB: 67,
    halo: 96,
    license: 'BSD-3-Clause (original weights)',
  },
};

const MB = 1024 * 1024;
const MIN_TILE = 64;
const ABSOLUTE_MAX_OUTPUT = 67_108_864; // 8192 x 8192
const IOS_CANVAS_LIMIT = 16_777_216; // Safari's conservative canvas area cap

export interface RealESRGANPlanOptions {
  width: number;
  height: number;
  profile: AIClientProfile;
  /** `balanced` is the compact x4v3 model; `high` is the 67 MB x4plus. */
  model?: RealESRGANModel;
  /** Model output scale. Only 4 is supported by this model. */
  scale?: number;
  /** Override the input pixel cap (before the 4x pass). */
  maxInputPixels?: number;
  /** Override the output canvas pixel cap. */
  maxOutputPixels?: number;
  /** Override the estimated peak-memory budget, in MiB. */
  memoryBudgetMB?: number;
  /** Force a tile edge; it is still checked against limits. */
  tileSize?: number;
  halo?: number;
}

export interface RealESRGANPlan {
  readonly id: typeof REALESRGAN_ID;
  readonly model: RealESRGANModel;
  readonly modelLabel: string;
  readonly modelFile: string;
  readonly modelSizeMB: number;
  readonly backend: AIBackend;
  readonly tileSize: number;
  readonly halo: number;
  readonly scale: number;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
  readonly inputWidth: number;
  readonly inputHeight: number;
  readonly outputWidth: number;
  readonly outputHeight: number;
  readonly cols: number;
  readonly rows: number;
  readonly tileCount: number;
  readonly downscaled: boolean;
  readonly inputScale: number;
  readonly estimatedPeakMB: number;
  readonly memoryBudgetMB: number;
  readonly maxInputPixels: number;
  readonly maxOutputPixels: number;
  readonly fits: boolean;
  readonly reasons: readonly string[];
}

interface Caps {
  maxInputPixels: number;
  maxOutputPixels: number;
  memoryBudgetMB: number;
  tiles: readonly number[];
  label: string;
}

function capsFor(profile: AIClientProfile, model: RealESRGANModel): Caps {
  if (model === 'high') {
    if (profile.backend === 'webgpu') {
      if (profile.ios) {
        return {
          maxInputPixels: 1_500_000,
          maxOutputPixels: 6_000_000,
          memoryBudgetMB: 512,
          tiles: [256, 224, 192, 160, 128, 96, MIN_TILE],
          label: 'webgpu-ios-high',
        };
      }
      if (profile.mobile) {
        return {
          maxInputPixels: 2_000_000,
          maxOutputPixels: 8_000_000,
          memoryBudgetMB: 640,
          tiles: [320, 256, 224, 192, 160, 128, 96, MIN_TILE],
          label: 'webgpu-mobile-high',
        };
      }
      return {
        maxInputPixels: 6_000_000,
        maxOutputPixels: 24_000_000,
        memoryBudgetMB: 1024,
        tiles: [384, 320, 256, 192, 128, MIN_TILE],
        label: 'webgpu-desktop-high',
      };
    }
    if (profile.ios) {
      return {
        maxInputPixels: 500_000,
        maxOutputPixels: 2_000_000,
        memoryBudgetMB: 384,
        tiles: [160, 128, 112, 96, 80, MIN_TILE],
        label: 'wasm-ios-high',
      };
    }
    if (profile.mobile) {
      return {
        maxInputPixels: 700_000,
        maxOutputPixels: 2_800_000,
        memoryBudgetMB: 512,
        tiles: [192, 160, 128, 112, 96, 80, MIN_TILE],
        label: 'wasm-mobile-high',
      };
    }
    return {
      maxInputPixels: 1_500_000,
      maxOutputPixels: 6_000_000,
      memoryBudgetMB: 768,
      tiles: [256, 224, 192, 160, 128, 96, MIN_TILE],
      label: 'wasm-desktop-high',
    };
  }

  if (profile.backend === 'webgpu') {
    if (profile.ios) {
      return {
        maxInputPixels: 4_000_000,
        maxOutputPixels: IOS_CANVAS_LIMIT,
        memoryBudgetMB: 192,
        tiles: [256, 224, 192, 160, 128, 96, MIN_TILE],
        label: 'webgpu-ios',
      };
    }
    if (profile.mobile) {
      return {
        maxInputPixels: 6_000_000,
        maxOutputPixels: 24_000_000,
        memoryBudgetMB: 320,
        tiles: [320, 256, 224, 192, 160, 128, 96, MIN_TILE],
        label: 'webgpu-mobile',
      };
    }
    return {
      maxInputPixels: 24_000_000,
      maxOutputPixels: ABSOLUTE_MAX_OUTPUT,
      memoryBudgetMB: 768,
      tiles: [512, 448, 384, 320, 256, 192, 128, MIN_TILE],
      label: 'webgpu-desktop',
    };
  }

  if (profile.ios) {
    return {
      maxInputPixels: 1_000_000,
      maxOutputPixels: IOS_CANVAS_LIMIT,
      memoryBudgetMB: 128,
      tiles: [160, 128, 112, 96, 80, MIN_TILE],
      label: 'wasm-ios',
    };
  }
  if (profile.mobile) {
    return {
      maxInputPixels: 1_500_000,
      maxOutputPixels: 24_000_000,
      memoryBudgetMB: 192,
      tiles: [192, 160, 128, 112, 96, 80, MIN_TILE],
      label: 'wasm-mobile',
    };
  }
  return {
    maxInputPixels: 4_000_000,
    maxOutputPixels: ABSOLUTE_MAX_OUTPUT,
    memoryBudgetMB: 384,
    tiles: [256, 224, 192, 160, 128, 96, MIN_TILE],
    label: 'wasm-desktop',
  };
}

function peakMB(
  tile: number,
  halo: number,
  scale: number,
  destWidth: number,
  destHeight: number,
  model: RealESRGANModel,
): number {
  const edge = tile + halo * 2;
  const inputTensor = edge * edge * 3 * 4;
  // SRVGGNetCompact keeps 64 feature channels; two live maps is a conservative
  // estimate because ORT reuses arenas but WebGPU keeps input/output textures.
  // x4plus has 23 RRDB blocks and keeps more live feature maps, so budget four.
  const featureMap = edge * edge * 64 * 4;
  const featureMaps = model === 'high' ? 4 : 2;
  const weights = model === 'high' ? REALESRGAN_MODELS.high.sizeMB : 0;
  const outTensor = (tile * scale) * (tile * scale) * 3 * 4;
  const outCanvas = (tile * scale) * (tile * scale) * 4;
  const destination = destWidth * destHeight * 4;
  return (
    (inputTensor + featureMap * featureMaps + outTensor + outCanvas + destination) / MB +
    weights +
    24
  );
}

function fitInput(
  width: number,
  height: number,
  maxInputPixels: number,
  maxOutputPixels: number,
  scale: number,
): { width: number; height: number; scale: number } {
  const byInput = Math.sqrt(maxInputPixels / Math.max(1, width * height));
  const byOutput = Math.sqrt(maxOutputPixels / Math.max(1, width * height * scale * scale));
  const k = Math.min(1, byInput, byOutput);
  let iw = Math.max(1, Math.floor(width * k));
  let ih = Math.max(1, Math.floor(height * k));
  // Rounding can leave the output a little over the cap; shrink the longer
  // edge until it fits. The loop runs only a handful of times.
  let guard = 0;
  while (iw * ih * scale * scale > maxOutputPixels && guard < 4096) {
    if (iw >= ih && iw > 1) iw -= 1;
    else if (ih > 1) ih -= 1;
    else break;
    guard += 1;
  }
  return { width: iw, height: ih, scale: k };
}

/**
 * Build a client-specific plan. Throws only when even a 64 px tile cannot fit,
 * which means the page is already out of memory.
 */
export function planRealESRGAN(options: RealESRGANPlanOptions): RealESRGANPlan {
  const sourceWidth = Math.max(1, Math.round(options.width));
  const sourceHeight = Math.max(1, Math.round(options.height));
  const model = options.model === 'high' ? 'high' : 'balanced';
  const modelInfo = REALESRGAN_MODELS[model];
  const scale = Math.max(1, Math.min(8, Math.round(options.scale ?? REALESRGAN_SCALE)));
  const halo = Math.max(0, Math.min(128, Math.round(options.halo ?? modelInfo.halo)));
  const caps = capsFor(options.profile, model);
  const maxInputPixels = Math.max(
    1,
    Math.round(options.maxInputPixels ?? caps.maxInputPixels),
  );
  let maxOutputPixels = Math.max(
    1,
    Math.round(options.maxOutputPixels ?? caps.maxOutputPixels),
  );
  const memoryBudgetMB = Math.max(64, Math.round(options.memoryBudgetMB ?? caps.memoryBudgetMB));

  if (options.profile.ios) {
    maxOutputPixels = Math.min(maxOutputPixels, IOS_CANVAS_LIMIT);
  }

  const reasons: string[] = [caps.label];
  if (model === 'high') reasons.push('high-quality');
  if (options.profile.backend === 'wasm') reasons.push('wasm-fallback');
  if (options.profile.mobile) reasons.push('mobile-memory');
  if (options.profile.ios) reasons.push('ios-canvas-cap');

  let fit = fitInput(sourceWidth, sourceHeight, maxInputPixels, maxOutputPixels, scale);
  if (fit.width < sourceWidth || fit.height < sourceHeight) {
    if (fit.scale < 1) reasons.push('downscaled');
    if (Math.sqrt(maxOutputPixels / (scale * scale)) < Math.sqrt(sourceWidth * sourceHeight)) {
      reasons.push('output-cap');
    }
  }

  const tiles = options.tileSize
    ? [Math.max(MIN_TILE, Math.round(options.tileSize))]
    : caps.tiles;
  const maxTexture = Math.max(1024, options.profile.maxTextureDimension2D);

  let chosen = tiles[tiles.length - 1];
  let chosenMB = Infinity;
  let fits = false;

  // If the destination alone is too large for the budget, lower the output cap
  // and re-fit the input. This is what keeps a 12 MP photo runnable on a phone
  // instead of failing after the model has already loaded.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    for (const tile of tiles) {
      const edge = tile + halo * 2;
      if (edge > maxTexture || tile * scale > maxTexture) continue;
      const mb = peakMB(tile, halo, scale, fit.width * scale, fit.height * scale, model);
      if (mb <= memoryBudgetMB) {
        chosen = tile;
        chosenMB = mb;
        fits = true;
        break;
      }
      if (mb < chosenMB) {
        chosen = tile;
        chosenMB = mb;
      }
    }
    if (fits) break;
    // Shrink the output to 80% of its area and try again.
    const nextCap = Math.floor(maxOutputPixels * 0.8);
    if (nextCap < 256 * 256) break;
    maxOutputPixels = nextCap;
    fit = fitInput(sourceWidth, sourceHeight, maxInputPixels, maxOutputPixels, scale);
    reasons.push('memory-cap');
  }

  if (!fits) {
    // Still return the smallest plan; the caller can show a warning. The model
    // itself can run a 64 px tile on any WebAssembly build.
    chosen = Math.min(...tiles);
    chosenMB = peakMB(chosen, halo, scale, fit.width * scale, fit.height * scale, model);
    reasons.push('over-budget');
  }

  const outputWidth = fit.width * scale;
  const outputHeight = fit.height * scale;
  const cols = Math.ceil(fit.width / chosen);
  const rows = Math.ceil(fit.height / chosen);

  return {
    id: REALESRGAN_ID,
    model,
    modelLabel: modelInfo.label,
    modelFile: modelInfo.file,
    modelSizeMB: modelInfo.sizeMB,
    backend: options.profile.backend,
    tileSize: chosen,
    halo,
    scale,
    sourceWidth,
    sourceHeight,
    inputWidth: fit.width,
    inputHeight: fit.height,
    outputWidth,
    outputHeight,
    cols,
    rows,
    tileCount: cols * rows,
    downscaled: fit.width < sourceWidth || fit.height < sourceHeight,
    inputScale: fit.scale,
    estimatedPeakMB: Math.round(chosenMB),
    memoryBudgetMB,
    maxInputPixels,
    maxOutputPixels,
    fits,
    reasons,
  };
}

/** Short Vietnamese explanation for the plan, suitable for a toast or sheet. */
export function describeRealESRGANPlan(plan: RealESRGANPlan): string {
  const mp = (plan.outputWidth * plan.outputHeight) / 1_000_000;
  const size = `${plan.outputWidth}×${plan.outputHeight} (${mp.toFixed(1)} MP)`;
  const prefix = `${plan.modelLabel} · AI 4× · ${plan.backend.toUpperCase()}`;
  if (!plan.downscaled) {
    return `${prefix} · tile ${plan.tileSize}px · ${size}`;
  }
  return `${prefix} · ảnh được thu về ${plan.inputWidth}×${plan.inputHeight} trước khi xử lý · ${size}`;
}
