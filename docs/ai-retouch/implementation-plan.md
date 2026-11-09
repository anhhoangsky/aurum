# Aurum AI Retouch — Implementation Plan

## Goal
Meitu/Xingtu-like skin retouch (smoothing, whitening, blemish, tone) as an **independent offline-first bundle** `dist/aurum-ai-retouch.esm.js`, without touching `src/core` shader path or `src/ui` editor chrome. Core stays ~73 KB gzip; retouch bundle target <30 KB gzip + separate ONNX bytes in IndexedDB.

## Architecture
```
src/ai-retouch/
  types.ts    RetouchTask, FaceBox, Landmark, RetouchResult, AurumRetouch
  device.ts   probe via probeAIClient, budgets (iOS WebGPU 512 / WASM 384)
  registry.ts pinned BlazeFace (installable) + descriptor-only NAFNet/SCUNet/LaMa
  cache.ts    IndexedDB aurum-ai-retouch/models, SHA-256 verify before store
  queue.ts    serial JobQueue (1 heavy job), AbortSignal
  memory.ts   planRetouch(width,height,device) estimatedPeakMB, maxInputPixels (face crop)
  runtime.ts  ORT dynamic import, WebGPU→WASM fallback, dispose per job
  models.ts   BlazeFace adapter (toTensor → boxes+landmarks decoder)
  mask.ts     skin mask ops: resize/feather/morph + Retinex helpers
  adapter.ts  compositeTransparent / compositeRetouched (original-res)
  engine.ts   AurumRetouchImpl facade with whitenSkin/smoothSkinAI/removeBlemish/adjustSkinTone
  index.ts    public exports
```

## Adapter contract (Phase 1)

```ts
whitenSkin(source, { strength: 0..1, faces?, signal, onProgress }) -> RetouchResult {
  success, task: 'skin-whitening', faces: FaceBox[], landmarks?, skinMask, composite?: ImageData, metadata: {modelId, backend, inferenceTime...}
}
```

- `smoothSkinAI`, `removeBlemish`, `adjustSkinTone` return `{ success:false, error:{code:'model-not-installed'|'not-supported'} }` until Phases 2–4 pin their models. Engine never fakes AI output.
- All jobs go through serial queue, accept `AbortSignal`, release ORT session on `dispose()`, and never read/write core state. Host (`demo` / future panel) composites via `adapter.ts` and loads result with `editor.load(blob)` (history reset warned, like ai-engine).

## Phases

| Phase | Deliverable | Gate |
|---|---|---|
| **0** | Audit + model selection docs (this commit) | Docs reviewed |
| **1** | Engine skeleton + BlazeFace pin + `whitenSkin` + IndexedDB + ORT runtime + `test-ai-retouch.html` + benchmark smoke | `npm run typecheck/build` pass; Python smoke 8ms verified; iPhone WebGPU timing **pending** |
| **2** | `smoothSkinAI`: guided-filter freq. separation (base/detail) + skinTexture slider | Benchmark ≥30 portraits, texture preservation visual check |
| **3** | `removeBlemish`: spot detect + LaMa inpaint ONNX (pin after license+SHA) | Pin LaMa exact bytes, smoke on acne/mole set |
| **4** | `adjustSkinTone`: Retinex + hue/WB on skin | No blue-shift on lips/teeth |
| **5** | Panel UI (demo) with before/after, brush refine, undo | User manual test |
| **6** | iPhone field measurement (time/memory/OOM) | Report actuals, no fabrication |

## iPhone Safari posture
- Single heavy job (face detect at 128px, whiten at preview 1080px max, export full-res tile-chunked)
- `maxInputPixels`: iOS WebGPU 4 MP, WASM 1 MP (matches `ai-engine/device.ts`)
- Session disposed after each job; model bytes only in IndexedDB, never bundled
- If `estimatedPeakMB > memoryBudgetMB` → refuse `out-of-memory` (honest) instead of crashing tab

## Non-goals
- No server upload, no cloud beautify, no telemetry. No bundling ORT/wasm or ONNX bytes in JS. No generative face alteration (face shape/eye) in v1 — landmarks only steer masks.

## Test plan
- `test-ai-retouch.html`: probe backend, install BlazeFace (CDN once), whitenSkin on `test-assets/portrait.jpg`, show mask/composite, Abort, OOM path (force low budget)
- Python smoke: `docs/ai-retouch/benchmark/blazeface-smoke.py` (CPU ORT) — record time/shape
- Browser E2E on iPhone 12 Pro Max: 3 faces, varied skin tone, backlit — record time/quality

## Blockers
- LaMa license + size still pending (Phase 3)
- iPhone WebGPU timing for BlazeFace not measured (Phase 6)
- Skin-whitening aesthetic is Retinex, not learned GAN — users expecting Meitu “plastic” skin may perceive it as lighter, not generative. Documented honestly.
