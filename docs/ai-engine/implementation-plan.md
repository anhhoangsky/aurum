# Aurum AI Engine — Implementation Plan & Status

Branch: `feature/aurum-ai-engine`. **Do not merge to `main` without approval.**

## API contract (implemented in `src/ai-engine/types.ts`)

```ts
const ai = await AurumAI.create({ offline: true, quality: 'professional' });
const result = await ai.removeBackground(image, {
  resolution: 'adaptive', refineEdges: true, preserveHair: true,
});
const people = await ai.segmentPeople(image);            // instances when supported
const objects = await ai.segmentObjects(image, { interactive: true, point: { x: .5, y: .5 } });
// → { success, masks, instances, metadata: { modelId, modelVersion, backend,
//     inputResolution, inferenceTime }, error?: { code, message } }
```

`success:false` with a machine-readable `error.code` (`model-not-installed`,
`not-supported`, `aborted`, `out-of-memory`) is a first-class result. The
engine never fabricates masks.

## Phase status

| Phase | Scope | Status |
|---|---|---|
| 0 | Audit, branch, constraints doc | **Implemented** (`docs/ai-engine/repository-audit.md`) |
| 0 | Model selection report | **Implemented** (researched; LongPipe XL = blocker) |
| 1 | Device profiles, registry, offline cache + SHA-256, serial queue, memory planner | **Implemented** (`device.ts`, `registry.ts`, `cache.ts`, `queue.ts`, `memory.ts`) — unit-tested in browser page + Node |
| 1 | Generic ORT runtime (WebGPU → WASM fallback, dispose) | **Implemented** (`runtime.ts`), **not tested** with a real segmentation ONNX |
| 1 | Small inference test | **Not yet supported** — no model artifact installed; see blocker below |
| 2 | Background removal (BiRefNet Lite) | **Not yet supported** — descriptor only; preprocessing must be validated against official code |
| 2 | Mask post-processing (threshold, feather, expand/contract, smooth, resize, composite) | **Implemented** (`mask.ts`, pure TS, tested) |
| 2 | Original-resolution transparent PNG export | **Implemented** in adapter (`adapter.ts`, untested with AI mask) |
| 3 | Person matting (LongPipe XL) | **Blocked**: artifact unverifiable (see model-selection.md §B) |
| 4 | Instance / interactive segmentation | **Not yet supported** — returns `not-supported` honestly |
| 5 | Editor adapter + panels + undo/redo | **Partially**: headless adapter + checkerboard preview implemented; UI panels not started |
| 6 | iPhone optimization | **Not yet supported** — needs real-device testing |
| — | Benchmark dashboard, ground-truth set, metrics formulas | Metrics **implemented** (`metrics.ts`: IoU/Dice/Boundary F/Alpha MAE); dataset + dashboard **not started** |

## Blockers (need owner input)

1. **LongPipe XL artifact**: URL + license + ONNX export. Without it, Phase 3
   cannot start; fallback order is documented in model-selection.md §B.
2. **BiRefNet Lite artifact + preprocessing**: pin the exact ONNX file(s) and
   record official resize/normalization/output-head details in `models.ts`
   before Phase 2 inference code is written.
3. **Real iPhone** for Phase 6 (Safari WebGPU memory, tab suspension, thermal).
4. **Benchmark images with ground-truth alpha** (≥30) + licenses.

## Security / privacy invariants (enforced in code)

- Inference inputs never leave the device: runtime has no network calls;
  model fetch happens only in `installModel()`, after which `fetch` is never
  used for image data.
- Model bytes are verified with SHA-256 (`crypto.subtle`) before acceptance;
  a mismatch rejects the install and keeps any previous working version.
- Model files are treated as data: ORT only, never executed as JS.
- One heavy job at a time (`queue.ts`), every job accepts `AbortSignal`,
  sessions are released on `dispose()` and on WebGPU device loss.
