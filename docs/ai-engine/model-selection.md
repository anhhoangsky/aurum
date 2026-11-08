# Aurum AI Engine — Model Selection Report

Status: **researched, not benchmark-verified**. No model here has been run on
Aurum hardware yet; every claim below is marked with its evidence level.
Nothing in this document is a substitute for the §5 benchmark protocol.

## A. Background removal — BiRefNet Lite (primary candidate)

| Fact | Value | Evidence |
|---|---|---|
| Family | BiRefNet (bilateral reference, CAAI AIR'24), MIT-licensed (per repo) | repo + HF mirrors |
| Native input | 1024×1024 | multiple ONNX mirrors |
| Lite variant | 512×512 input exists as a separate community ONNX (`birefnet-lite-512`) | HF model card |
| Alternative size | `BiRefNet_lite-2K` (2560×1440 inputs) — too large for iPhone default | upstream repo |
| Full BiRefNet FP32 ONNX | ~973 MB (REPLICATE-scale figure) — **excluded** for browser default | benchmark write-ups |
| Quantization | No official INT8 browser build found; FP32/FP16 ONNX mirrors exist | — |

Decision: target **BiRefNet Lite at 512 (Low) / 768 (Medium) / 1024 (High)**,
single-shot (the model has a fixed input geometry and a global receptive field —
tiling a fixed-input segmentation model creates seam artifacts and is **not**
planned). The 512/768/1024 "profiles" are input-resize targets; the exact
preprocessing (resize policy, normalization mean/std, output head) must be
captured from the official inference code before Phase 2 and recorded in
`models.ts` — currently marked `preprocessing: 'to-be-validated'` (blocker).

Hair/edge quality, FP16 vs FP32 on Apple GPU, and INT8 availability are all
**unmeasured** — they are acceptance items for Phase 2, not assumptions.

## B. Person matting — LongPipe XL (as specified)

**Not verifiable.** Searches for a public "LongPipe XL" human-matting model
(weights, license, ONNX export, input geometry) return no usable source; the
name does not resolve to a public artifact. This is a **documented blocker**,
not a silent substitution.

Phase 3 plan, in order:
1. Ask the task owner for the exact LongPipe XL artifact (URL + license).
2. If unavailable, evaluate in this order, each as a separate registry entry:
   - **MODNet** (human matting, ONNX mirrors ~25 MB, real-time class) —
     purpose-built for portrait matting, runs on CPU/WASM;
   - **BackgroundMattingV2** (heavier, better edges, mobile variant exists);
   - MediaPipe Selfie Segmentation as the weak baseline (§D) — binary mask,
     **not** alpha matting; must not be presented as matting.
3. Whichever wins must be evaluated on hair/glasses/semi-transparent items
   against ground truth (§5). A segmentation model is never claimed as matting.

## C. Person / object instance segmentation

| Candidate | What it actually does | iPhone fit |
|---|---|---|
| **EdgeTAM** (SAM 2 derivative) | Promptable (point/box) *video* object segmentation/tracking, 2D spatial perceiver, real-time on phone at ~16 FPS per CVPR'25 paper | Good candidate for interactive object masks; encoder + memory attention must be measured, not assumed |
| **MobileSAM** | Promptable still-image segmentation, distilled from SAM, up to ~66× smaller / 5–38× faster than SAM | Best-documented mobile option; still-image point/box prompts |
| MediaPipe Image Segmenter | Semantic multi-category segmentation (person, hair, skin, background…) | Category masks, **not** per-instance separation |

Important distinction enforced by the API: **semantic** (MediaPipe category),
**foreground** (BiRefNet), **instance** (one mask per detected person/object),
and **interactive** (point/box prompt → MobileSAM/EdgeTAM) are four different
contracts. `segmentPeople()` (instance list) returns `status: 'not-supported'`
until an instance-capable model is installed and verified — it never fakes
instances by splitting a semantic mask.

## D. Baseline — MediaPipe Selfie Segmentation

~447 KB float32, 256×256 input, real-time on phones, already self-hosted in
Aurum's `landmarks/` flow (Face Landmarker, not Selfie Segmentation — a
different task). Suitable as the Low-profile fallback and benchmark floor.
Binary mask only; no hair-level alpha. License/task details to be recorded in
the registry entry when the ONNX/TFLite artifact is vendored.

## E. Runtime note (ONNX Runtime Web)

Aurum already ships ORT Web (`src/ai/realesrgan.ts`): WebGPU preferred with
WASM fallback, `proxy: false`, single-thread on non-COOP/COEP pages. The AI
Engine reuses this posture (`runtime.ts`). WebGL2 execution is **not** assumed
available for these graphs — ORT Web's WebGL EP is limited; WebGPU + WASM SIMD
are the supported backends. WebNN (`navigator.ml`) is probed but not relied on.

## F. Selection summary

| Task | Primary | Fallback | Status |
|---|---|---|---|
| Background removal | BiRefNet Lite (512/768/1024) | MediaPipe Selfie (Low) | Descriptor in `models.ts`; preprocessing blocker |
| Person matting | LongPipe XL *(unverified)* | MODNet → BackgroundMattingV2 | **Blocker: artifact not found** |
| Instance segmentation | MobileSAM (still) / EdgeTAM (video + interactive) | MediaPipe semantic (not instances) | Not started (Phase 4) |
| Object segmentation (interactive) | MobileSAM / EdgeTAM | — | Not started (Phase 4) |
| Baseline | MediaPipe Selfie Segmentation | — | Reference only |

Download-size target (<100 MB main model) is plausible for Lite/MODNet class
models but **unverified** until the exact artifacts are pinned with SHA-256.

## G. Benchmark protocol (Phase 2/6, must precede any quality claim)

- ≥30 images: long/curly hair, backlit hair, glasses, overlapping people,
  complex clothing, transparent objects, product shots, complex backgrounds.
- Ground-truth alpha masks per image (license permitting).
- Metrics: IoU, Dice, Boundary F-score, Alpha MAE, inference time (cold/warm,
  single/10/30 consecutive), peak memory, download size.
- Targets: Boundary F ≥ 0.95, Alpha MAE ≤ 0.04, 12 MP < 8 s, no crash in the
  30-image run, fully offline after install. **Report actuals; never fabricate.**
- Devices: at least one real iPhone (Safari) + one desktop Chrome. Emulation
  alone does not satisfy the iPhone requirement.
