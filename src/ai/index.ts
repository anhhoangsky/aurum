/**
 * Standalone AI entry point.
 *
 * Import this bundle only when the application offers AI processing. The core
 * editor (`aurum.esm.js`) never imports it, so ONNX Runtime and the model stay
 * out of the 50 KB core budget.
 */

export { probeAIClient, resetAIClientProbe } from './client';
export type { AIBackend, AIClientProfile } from './client';
export {
  describeRealESRGANPlan,
  planRealESRGAN,
  REALESRGAN_HALO,
  REALESRGAN_ID,
  REALESRGAN_LICENSE,
  REALESRGAN_MODELS,
  REALESRGAN_SCALE,
} from './plan';
export type {
  RealESRGANModel,
  RealESRGANModelInfo,
  RealESRGANPlan,
  RealESRGANPlanOptions,
} from './plan';
export { createRealESRGANFactory } from './realesrgan';
export type { RealESRGANFactoryOptions, RealESRGANRuntimeUrls } from './realesrgan';
