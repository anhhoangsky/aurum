# Aurum — AI Retouch Engine — Repository Audit

**Date:** 2026-11-09 · **Branch:** `main` · **Status:** Phase 0 audit

## Scope

Build an *independent, offline-first* AI Retouch Engine that adds
Meitu/Xingtu-class retouch (skin smoothing, whitening, blemish removal,
skin tone) **without destabilizing the WebGL Photo Core** (`src/core`, `src/ui`).

## What exists today

| Area | File | Finding |
|---|---|---|
| Procedural retouch | `src/core/shader/modules/portrait.glsl` → `generated.ts` | 3 sliders only: `u_smoothSkin` (bilateral 4/8-tap), `u_blemish` (8-tap average + spot gate), `u_skinTone` (warm/cool mix). Bilateral radius fixed UV `0.0045`, blemish UV `0.011`. No whitening uniform. |
| Skin mask | `src/beauty/mask.ts` (optional bundle `aurum-beauty.esm.js` 1.9 KB gzip) | CPU YCbCr + face-box ellipse + sampled skin reference, `maxSize 512`, RGBA `R=skin G=protect B=lips`. Falls back to procedural `skinWeight()` in shader. |
| Face boxes | `assets/editor.js` `cfg.faces` + `src/landmarks` | Server YuNet boxes + optional MediaPipe Face Landmarker anchors. No on-device face detector in core. |
| AI upscale | `src/ai/realesrgan.ts` | Real-ESRGAN x4v3 (4.9 MB) + x4plus (67 MB). SR/denoise only, no skin head. |
| AI segmentation | `src/ai-engine/` (bundle `aurum-ai-engine.esm.js` 12.5 KB gzip) | BiRefNet Lite 512 (98 MB), ISNet 1024 (88 MB), MODNet 13 MB, selfie segmenter 0.25 MB. No retouch entry. |
| Core/editor | `src/core/types.ts:38-45,372-377`, `src/core/state.ts:37-40,80-83`, `src/core/color.ts:689-692` | `smoothSkin/blemish/skinTexture [0,100]`, `skinTone [-100,100]`, defaults `0,0,55,0`. No `whiten` field. |

## Constraints (carry-over from AI Engine)

- Offline-first: after `installModel()` no network, no telemetry. Models from trusted CDN only at install.
- iPhone Safari primary: serial single heavy job, cancellable, no main-thread block. Budgets: iOS WebGPU 512 MB, WASM 384 MB (Jetsam ≈1.5 GB/tab — see `docs/ai-engine/implementation-plan.md`).
- Original-resolution compositing; never replace original with downsized output. Manual brush refinement required after AI.
- Core untouched: new bundle `dist/aurum-ai-retouch.esm.js`, clean adapter API returning masks/metadata.
- Do not commit experimental weights; do not fabricate quality/benchmark results. Unpinned models stay `descriptor-only`/`blocked`.

## Whitening gap

Meitu/Xingtu “trắng da” is **illuminance-boost limited to skin** (Retinex L boost + tone-curve), not global brightness. Aurum today has no whitening uniform; workaround (brightness/whites) burns global whites. Phase 1 will add `whitenSkin(strength)` via neural face detection + skin mask + Retinex, instead of touching the shader.

## References
- `docs/ai-engine/repository-audit.md`, `model-selection.md`, `implementation-plan.md`
- `src/beauty/index.ts`, `src/ai-engine/index.ts`
