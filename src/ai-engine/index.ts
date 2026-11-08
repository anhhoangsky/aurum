/**
 * Aurum AI Engine — independent, offline-first segmentation subsystem.
 *
 * Built as its own bundle (`dist/aurum-ai-engine.esm.js`). The core editor
 * never imports it, so ORT and model code stay out of the core's size budget.
 * See docs/ai-engine/ for the architecture, model selection, and status.
 */

export { create } from './engine';
export type { AurumAICreateOptions } from './engine';
export { probeDeviceProfile, resolveDeviceProfile } from './device';
export type { DeviceProfile } from './device';
export { MODEL_REGISTRY, getModelDescriptor, listModels } from './registry';
export type { ModelDescriptor } from './registry';
export { registerModelAdapter, getModelAdapter, listModelAdapters, rgbaToNCHW, sigmoidMask } from './models';
export type { ModelAdapter } from './models';
export { JobQueue } from './queue';
export { planSegmentation } from './memory';
export type { SegmentationPlan } from './memory';
export { createSession } from './runtime';
export type { LoadedSession, OrtModule, OrtSession, OrtTensor, RuntimeOptions, RuntimeUrls } from './runtime';
export {
  applyAlpha,
  brushDab,
  cloneMask,
  combineMasks,
  createMask,
  featherMask,
  invertMask,
  maskToRGBA,
  morphMask,
  resizeMask,
  thresholdMask,
} from './mask';
export type { Mask } from './mask';
export { alphaMAE, boundaryFScore, dice, iou } from './metrics';
export { compositeTransparentPNG, previewCheckerboard } from './adapter';
export type {
  AIError,
  AIInputResolution,
  AIInstance,
  AIMaskResult,
  AIQuality,
  AIResult,
  AIResultMetadata,
  AISource,
  AITask,
  AurumAI,
  AurumAIOptions,
  InstalledModel,
  RemoveBackgroundOptions,
  SegmentObjectsOptions,
} from './types';
