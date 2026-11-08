# Aurum AI Engine — Phase 0: Repository Architecture Report

Branch: `feature/aurum-ai-engine` (branched from `main` @ `d347e67`).
Status: **Implemented** (this document). No editor code was modified in Phase 0.

## 1. Existing architecture (audited, not changed)

```
src/
  index.ts                 public exports: createEditor / createCore
  core/
    core.ts                AurumCore: load (createImageBitmap, EXIF orientation),
                           state/history, gestures, export
    renderer.ts            WebGL1 preview/export (unit quad, UNPACK_FLIP_Y off),
                           Canvas2D fallback, texture cap min(8192, MAX_TEXTURE_SIZE)
    capabilities.ts        probeCapabilities(): webgl 0|1|2, highp, maxTexture,
                           deviceMemoryGB, tier low|mid|high|ultra (cached)
    enhance/ai.ts          AIAdapter / runAIPipeline: halo-padded tiled inference,
                           AbortSignal, one tile alive at a time (iPhone-safe)
    enhance/analyze.ts     classical CPU image analysis (no model)
    shader/                build-time GLSL variants (9), beauty/liquify/anchors
  beauty/mask.ts           optional CPU skin/feature mask builder (RGBA, UV space)
  landmarks/mediapipe.ts   lazy self-hosted MediaPipe Face Landmarker, SIMD fallback,
                           serialized queue, instance closed after each image
  ai/                      standalone bundle dist/aurum-ai.esm.js (Real-ESRGAN x4):
      client.ts            probeAIClient(): WebGPU adapter, WebGL2, WebNN, iOS,
                           COOP/COEP + SharedArrayBuffer, saveData (never throws)
      plan.ts              tile planner: per-device pixel/memory budgets,
                           iOS canvas cap 16.7 MP, halo 40px (x4v3) / 96px (x4plus)
      realesrgan.ts        ONNX Runtime Web adapter: WebGPU -> WASM fallback,
                           RGBA -> NCHW float32, session release on dispose
  ui/                      AurumEditor chrome (thin observer over core events)
build.mjs                  esbuild: ESM/CJS/IIFE core + AI/Beauty/Landmarks bundles,
                           copies ORT runtimes + ONNX models into dist/ai/
editor.html + assets/      standalone host page: #editor-config contract
                           (mediaUrl/saveUrl/csrf/faces/ai/landmarks), Trusted Types
```

## 2. Integration points for the AI Engine

| Concern | Existing mechanism | AI Engine decision |
|---|---|---|
| Image loading | `AurumCore.load()` / `sourceBitmap()` (read-only full-res bitmap) | Read `sourceBitmap()` only; never mutate or replace it |
| Compositing | WebGL pipeline + `setBeautyMask(mask)` (RGBA `BeautyMask`, source-UV space, `width*height*4`) | Reuse the same RGBA mask shape for AI alpha; beauty channels (R/G/B) stay separate — AI mask uses A as foreground alpha |
| Export | `core.export({type:'image/png'})`, `getImageData()` | Adapter composites original-resolution RGB + AI alpha on a 2D canvas, then `toBlob('image/png')`; core export path untouched |
| History | `History` (60 entries, 900 ms coalescing) | AI results are discrete operations; adapter requests one history commit per apply (Phase 5) |
| Capability probe | `probeAIClient()` (WebGPU/WebNN/WebGL2/iOS/COOP-COEP) | Reuse verbatim; map to quality profiles Low/Medium/High |
| Memory budget | `plan.ts` caps: iOS WebGPU 192 MB / WASM 128 MB (x4v3), iOS canvas 16.7 MP | Mirror these caps for segmentation; adaptive input 512/768/1024 |
| Inference tiling | `runAIPipeline()` halo tiling, AbortSignal, `nextFrame()` yield | Reuse for tiled inference where the model is fully convolutional; fixed-input models (BiRefNet) run single-shot at native input size (§7) |
| ORT runtime | `realesrgan.ts`: dynamic `import(runtimeUrl)`, `env.wasm.proxy=false`, WASM fallback on session failure | Generalize into `runtime.ts`; never bundle ORT into the core |
| Build | esbuild multi-entry, `dist/` git-ignored, `assets/` synced by `sync-assets.mjs` | New entry `src/ai-engine/index.ts` → `dist/aurum-ai-engine.esm.js` (separate bundle, core stays ~58 KB gzip) |
| Tests | `test-*.html` regression pages (browser, print measurements) | `test-ai-engine.html` follows the same pattern (DOM-free core runs under Node too) |
| CSP / privacy | Self-hosted runtimes, `connect-src 'self'` blocks telemetry | AI Engine: model files are data only, checksummed, never executed as JS; inference makes **zero** network calls |

## 3. Constraints discovered

1. **Core must stay dependency-free** (~58.6 KB gzip). Anything heavy (ORT, models, MediaPipe) lives in a separate lazy bundle — the AI Engine follows this.
2. **WebGL1 preview, not WebGL2**: the renderer is WebGL1 + Canvas2D fallback. The AI Engine's WebGL2/WebGPU runtime is independent and must not create contexts that starve the preview (probe contexts are short-lived and released, as in `capabilities.ts`).
3. **iOS Safari is the binding constraint**: 16.7 MP canvas cap, ~128–192 MB inference budgets, no COOP/COEP by default (single-thread WASM), WebGPU available but memory-tight. One heavy model at a time, one inference job at a time.
4. **No test runner exists** — verification is browser regression pages + `tsc --noEmit`. New code must stay DOM-free where possible so it can be exercised in Node.
5. **Model weights are not in the repo** (`dist/ai/` is built, git-ignored). The AI Engine must not commit weights either; models are downloaded at install time, verified, and stored in IndexedDB/Cache Storage.
6. **Existing `src/ai/` (Real-ESRGAN) is unrelated work** (super-resolution). The new subsystem lives in `src/ai-engine/` to avoid destabilizing it.

## 4. Where the AI Engine plugs in (planned, Phase 5)

```
feature/aurum-ai-engine
  src/ai-engine/
    types.ts       API contracts (AurumAI, structured results)
    device.ts      quality profile resolution from probeAIClient()
    registry.ts    ModelRegistry: id/version/source/size/sha256/license/runtime
    cache.ts       IndexedDB model store + SHA-256 verification (crypto.subtle)
    queue.ts       serial job queue, cancellation, one job at a time
    memory.ts      adaptive input-resolution planner (512/768/1024)
    mask.ts        DOM-free mask ops: threshold/invert/feather/expand/contract/
                   add/subtract/resize/composite (separable box blur, max/min filter)
    metrics.ts     IoU / Dice / Boundary F-score / Alpha MAE (DOM-free)
    runtime.ts     generic ORT session runner: WebGPU -> WASM fallback, dispose
    models.ts      candidate model descriptors (status: not-installed)
    engine.ts      AurumAI: removeBackground / segmentPeople / segmentObjects /
                   getInstalledModels / installModel / dispose
    adapter.ts     AurumEditorAdapter: core.sourceBitmap + mask -> PNG at
                   original resolution; checkerboard preview canvas
    index.ts       public entry
  docs/ai-engine/  this report, model selection, implementation plan, status
  test-ai-engine.html
```

The editor (`src/core`, `src/ui`) is **not modified** by this branch until Phase 5, and then only through the adapter.
