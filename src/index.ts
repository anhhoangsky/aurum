import { AurumCore } from './core/core';
import { AurumEditor } from './ui/ui';

export { AurumCore } from './core/core';
export type { AurumCoreOptions } from './core/core';
export { AurumEditor } from './ui/ui';
export type { AurumUIOptions, Locale, TabId } from './ui/ui';
export { UI_CSS, ensureStyles } from './ui/styles';
export { PRESETS, buildColorTransform, presetById } from './core/color';
export type { Preset } from './core/color';
export {
  probeCapabilities,
  resolveColorSpace,
  resolveDither,
} from './core/capabilities';
export type {
  AurumCapabilities,
  ColorSpaceMode,
  DeviceTier,
  DitherMode,
  RenderColorSpace,
} from './core/capabilities';
export { linearToSrgb, srgbToLinear } from './core/transfer';
export {
  ADJUST_KEYS,
  ADJUST_RANGES,
  HSL_BANDS,
  cloneState,
  defaultAdjust,
  defaultCrop,
  defaultCurves,
  defaultEnhance,
  defaultHSL,
  defaultState,
  defaultTransform,
  normalizeRetouch,
  normalizeState,
} from './core/state';
export {
  MAX_LIQUIFY_DABS,
  MAX_LIQUIFY_RADIUS,
  MAX_LIQUIFY_SHIFT,
  buildLiquifyField,
} from './core/liquify';
export { analyzeBitmap, autoAdjust } from './core/enhance/analyze';
export {
  CURVE_PRESETS,
  buildCurveLUT,
  curvePreset,
  curvesAreIdentity,
  sampleCurve,
} from './core/enhance/curves';
export { LUT_SIZE, LUTS, buildLUT, lutById } from './core/enhance/lut';
export {
  getAIAdapter,
  listAIAdapters,
  registerAIAdapter,
  runAIPipeline,
  unregisterAIAdapter,
} from './core/enhance/ai';
export type {
  AIAdapter,
  AIAdapterFactory,
  AICapability,
  AIPipelineOptions,
} from './core/enhance/ai';
export type { CurvePreset } from './core/enhance/curves';
export type { LUTPreset } from './core/enhance/lut';
export type * from './core/types';

/** Current library version. */
export const version = '1.0.0';

/** Create the full editor (core + included iOS-style UI). */
export function createEditor(
  options: ConstructorParameters<typeof AurumEditor>[0],
) {
  return new AurumEditor(options);
}

/** Create the headless engine only — bring your own UI. */
export function createCore(options: ConstructorParameters<typeof AurumCore>[0]) {
  return new AurumCore(options);
}
