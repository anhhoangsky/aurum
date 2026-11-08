/**
 * Optional Beauty bundle.
 *
 * Kept out of the core entry so the default editor never pays for the CPU
 * mask pass. Load it lazily, build a mask from the source bitmap and hand it
 * to `core.setBeautyMask()`. The core falls back to its procedural mask when
 * this module is absent, so old devices and headless integrations are
 * unaffected.
 */

export { buildBeautyMask, beautyMaskStats } from './mask';
export type {
  BeautyMask,
  BeautyMaskFace,
  BeautyMaskOptions,
  BeautyMaskSource,
  BeautyMaskStats,
} from './mask';
