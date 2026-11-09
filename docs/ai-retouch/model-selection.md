# Aurum AI Retouch — Model Selection (honest, measured)

## A. Face detection (Phase 1 prerequisite for whitening)

### A1. BlazeFace ONNX — **PINNED** (Phase 1)
| Field | Value |
|---|---|
| Repo | `garavv/blazeface-onnx` (community export, Apache-2.0 upstream MediaPipe) |
| Artifact | `blaze.onnx`, input `image [1,3,128,128]`, outputs `selectedBoxes [1,16]` (top_y, top_x, bot_y, bot_x, eyeL x/y, eyeR x/y, nose x/y, mouth x/y, earL x/y, earR x/y — see HF README quick-start) + thresholds `conf_threshold [1] float`, `iou_threshold [1] float`, `max_detections [1] int64` |
| Size | 535,842 B (0.51 MB) — well under iPhone budget |
| SHA-256 (local download 2026-11-09) | `564740c5146673c840257402cee8309161848e48e64d277a862ab4d501adf8a5` |
| Preprocessing | RGB resize 128×128 → /255 → NCHW `(1,3,128,128)` (HF README + smoke) |
| License | Apache-2.0 (verify per-artifact before shipping; upstream MediaPipe) |
| Measured (Python ORT 1.31.1 CPU, desktop, `benchmark/blazeface-smoke.py`) | portrait.jpg → 1 box `[0.117,0.373,0.354,0.610 …]`, ~8 ms. iPhone WebGPU **not yet measured** (Phase 6) |

> BlazeFace `conf_threshold`/`iou_threshold` are model inputs, not post-processing. Decoding follows HF quick-start (first 4 values are `top_y,top_x,bot_y,bot_x`; convert to normalized `x,y,w,h`). Landmarks are optional helpers for the mask, not the core output.

## B. Whitening engine (Phase 1)

No “whitening ONNX” is pinned. Phase 1 engine = **BlazeFace (neural)** + **skin mask (CPU sampler, like `src/beauty/mask.ts`)** + **Retinex L boost** (analytical) applied *only* on skin pixels. Docs label this honestly as AI-assisted, not generative beautify. Full generative beautify (GAN/diffusion) is **blocked** for on-device web (see §E).

## C. Restoration candidates — **rejected / blocked** (measured exclusion)

| Candidate | Size (HEAD 2026-11-09) | Reason |
|---|---|---|
| NAFNet-GoPro-width64 `deepghs/image_restoration` | 467,748,365 B (~446 MB) | Exceeds 512 MB WebGPU budget, OOM on iPhone. Excluded. |
| NAFNet-*.onnx (others) | similar 100 MB+ | Excluded for same budget. No width16/32 pinned artifact found in that repo. |
| SCUNet / Restormer | 50–200 MB range | Same budget risk; not benchmarked locally. Descriptor-only. |
| LaMa inpainting | ~25–50 MB + license check pending | Reserved for Phase 3 blemish removal; **not pinned** until SHA-256 + Python smoke + license. |

## D. Skin segmentation

Selfie segmenter (`mediapipe-selfie-segmenter` 0.25 MB, already pinned in ai-engine registry) is the Low-profile fallback; it is binary (person), **not** alpha matting, and must not be presented as such.

## E. Why not full Meitu GAN on web?

Meitu/Xingtu beautify likely uses server GPUs + proprietary nets ( StarGAN / diffusion, >100 MB, >500 ms on A100 ). On iPhone Safari: WebGPU 512 MB budget, no persistent background compute, Jetsam kills tabs under ~1.2 GB. A distilled mobile beautify net under 20 MB with verified ONNX export has not been found in this audit. Claiming “Meitu-level AI” without such an artifact would be fabrication — so v1 ships the honest, offline, measurable pipeline above.

## Summary

| Task | Primary Phase 1 | Status |
|---|---|---|
| Face detection | BlazeFace ONNX (0.5 MB) | **Pinned** |
| Whitening | Retinex L on skin mask ( BlazeFace + CPU mask ) | **Shipped Phase 1** |
| Smoothing | Guided-filter freq. separation (Phase 2) | Descriptor-only |
| Blemish | Spot detect + LaMa inpaint (Phase 3) | Blocked (needs pinned LaMa) |
| Tone | Retinex + Hue/WB on skin (Phase 4) | Descriptor-only |

> Benchmark protocol must run ≥30 portraits (varied skin tones, backlit, glasses, makeup) before any quality claim. Report actual IoU/Dice/MAE + iPhone timing; never fabricate.
