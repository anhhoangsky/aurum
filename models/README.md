# models/

Local-only model cache. Binary weights are **not committed to git** (see `.gitignore`).
Only this `README.md` is tracked.

## Why local-only?
- ISNet (`onnx-community/ISNet-ONNX`) is tagged AGPL-3.0 on HF — redistributing
  weights in this repo would carry copyleft questions. Users download directly
  from the trusted CDN at runtime (verified by pinned SHA-256 in
  `src/ai-engine/registry.ts` / `src/ai-retouch/registry.ts`), so Aurum does
  not redistribute them.
- BlazeFace export (`garavv/blazeface-onnx`) has no explicit LICENSE on HF —
  keep download-only until clarified.
- Large binaries (>50 MB) would bloat clone/Pages; `dist/` is already ignored.

## Expected files (all pinned, SHA-256 verified)
| File | Source | Size | License (verified) |
|---|---|---|---|
| `birefnet-lite-512-fp16.onnx` | studioludens/birefnet-lite-512 | 98 MB | MIT |
| `birefnet-lite-512-fp32.onnx` | studioludens/birefnet-lite-512 | 192 MB | MIT |
| `isnet-fp16.onnx` | onnx-community/ISNet-ONNX | 88 MB | AGPL-3.0 (HF) — download-only |
| `modnet-fp16.onnx` | Xenova/modnet | 13 MB | Apache-2.0 |
| `modnet-fp32.onnx` | Xenova/modnet | 26 MB | Apache-2.0 |
| `mediapipe-selfie-segmenter.tflite` | storage.googleapis.com/mediapipe-models | 0.25 MB | Apache-2.0 |
| `blazeface-onnx.onnx` | garavv/blazeface-onnx | 0.5 MB | unknown — download-only |
| `realesr-general-x4v3.onnx` | Real-ESRGAN (copied from `dist/ai/`) | 4.9 MB | BSD-3-Clause |
| `Real-ESRGAN-x4plus.onnx` | Real-ESRGAN (copied from `dist/ai/`) | 67 MB | BSD-3-Clause |

To refresh: re-run the download script from `src/*/registry.ts` URLs and
verify SHA-256 against the pinned values before use.
