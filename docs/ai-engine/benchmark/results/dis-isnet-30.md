# DIS_TE1 30-sample results: ISNet fp16 vs BiRefNet Lite 512 (desktop CPU)

- Samples: 30 (same stride extraction as dis-te1-30, see benchmark-dis.py)
- Models: onnx-community/ISNet-ONNX fp16 (1024), studioludens BiRefNet Lite 512 fp16
- Script: docs/ai-engine/benchmark/benchmark-isnet.py
- Dates: 2026-11-09

| Model | IoU | Dice | Boundary F (tol 2px) | Alpha MAE | Median |
|---|---|---|---|---|---|
| ISNet fp16 (1024) | 0.9221 | 0.9575 | 0.8301 | 0.0079 | 2314 ms |
| ISNet INT8 (1024) | 0.9182 | 0.9553 | 0.8182 | 0.0082 | 17385 ms |
| BiRefNet Lite 512 | 0.7725 | 0.8388 | 0.5646 | 0.0135 | 2903 ms |

Conclusion (measured, not assumed): ISNet at 1024 is decisively better than
BiRefNet Lite at 512 on DIS ground truth at similar size download (88 vs
94 MB fp16) and similar desktop-CPU time. INT8 keeps quality but is ~7x
slower on CPU (WebGPU INT8 unverified). ISNet replaces BiRefNet as the
preferred background-removal model; BiRefNet Lite stays the small fallback.
ISNet memory estimate (512 MB) still needs device measurement (Phase 6).
