# Third-party models

Aurum downloads model weights at install time from the pinned Hugging Face
URLs in `src/ai-engine/registry.ts` and `src/ai-retouch/registry.ts`. Weights
are never committed to this repository and are cached locally (IndexedDB) so
inference works offline afterwards. Every artifact is pinned by SHA-256.

License values below were checked against the Hugging Face model cards on
**2026-11-09**. A model card can change after this date; re-check before
redistributing the weights or shipping a build that bundles them.

| Model | Registry id | Weights source | Model-card license | Notes |
|---|---|---|---|---|
| BiRefNet Lite 512 (fp16/fp32) | `birefnet-lite-512-fp16`, `birefnet-lite-512-fp32` | `studioludens/birefnet-lite-512` | MIT | Upstream `ZhengPeng7/BiRefNet_lite` is MIT. |
| ISNet general use 1024 (fp16) | `isnet-fp16` | `onnx-community/ISNet-ONNX` | **AGPL-3.0** | Copyleft. Review obligations before redistribution or a hosted service. Selected for quality, not license. |
| MODNet (fp32/fp16) | `modnet-fp32`, `modnet-fp16` | `Xenova/modnet` | Apache-2.0 | Fallback person matting. Upstream MODNet is Apache-2.0/NACC. |
| BlazeFace ONNX (128 px) | `blazeface-onnx` | `garavv/blazeface-onnx` | **Not declared** | The conversion card has no license metadata. Upstream MediaPipe BlazeFace is Apache-2.0, but that does not automatically license this ONNX conversion. Verify before redistribution. |
| MediaPipe Selfie Segmenter | `mediapipe-selfie-segmenter` | descriptor only | Apache-2.0 | Not the default path; MediaPipe model card. |
| LongPipe XL | `longpipe-xl` | — | unknown | Blocked: no verifiable public artifact. |

## Expo/on-device note

`src/ai-retouch/engine.ts` currently uses the BlazeFace ONNX conversion for
face boxes. If the missing license declaration is a blocker for a release,
replace it with a model whose card declares a license (or self-host the
MediaPipe BlazeFace asset under its Apache-2.0 terms).
