/**
 * Adaptive input-resolution planner (Low 512 / Medium 768 / High 1024).
 *
 * Segmentation inference runs at the planned input size; the returned
 * probability mask is upscaled with edge-aware refinement (mask.ts) and
 * composited at ORIGINAL resolution (adapter.ts). The original image is never
 * downscaled as the final output. Fixed-input models ignore `fits` beyond
 * reporting it — they always receive their native input geometry.
 */

import type { DeviceProfile } from './device';

export interface SegmentationPlan {
  inputSize: number;
  sourceWidth: number;
  sourceHeight: number;
  /** True when the source had to be scaled to reach the input size. */
  scaled: boolean;
  /** Estimated peak memory for one inference at this input size (MiB). */
  estimatedPeakMB: number;
  fits: boolean;
  reasons: readonly string[];
}

const MB = 1024 * 1024;

export function planSegmentation(
  width: number,
  height: number,
  device: DeviceProfile,
  requestedResolution?: number,
): SegmentationPlan {
  const sourceWidth = Math.max(1, Math.round(width));
  const sourceHeight = Math.max(1, Math.round(height));
  const inputSize = requestedResolution ?? device.inputResolution;
  const reasons: string[] = [];
  if (device.ios) reasons.push('ios');
  if (device.backend === 'wasm') reasons.push('wasm-fallback');

  const pixels = inputSize * inputSize;
  // Conservative peak estimate: input tensor + 2 live feature maps + output
  // mask + compositing canvas at source size, all float32/RGBA8.
  const inputTensor = pixels * 3 * 4;
  const featureMaps = pixels * 32 * 4 * 2;
  const outputMask = pixels * 4;
  const destination = sourceWidth * sourceHeight * 4;
  const estimatedPeakMB = Math.round((inputTensor + featureMaps + outputMask + destination) / MB + 24);

  const fits = estimatedPeakMB <= device.memoryBudgetMB && pixels <= device.maxInputPixels;
  if (!fits) reasons.push('over-budget');

  return {
    inputSize,
    sourceWidth,
    sourceHeight,
    scaled: sourceWidth !== inputSize || sourceHeight !== inputSize,
    estimatedPeakMB,
    fits,
    reasons,
  };
}
