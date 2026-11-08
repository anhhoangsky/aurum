# DIS_TE1 benchmark results (desktop CPU, ONNX Runtime)

- Samples: 30 (stride extraction from PARQUET, see script)
- Models: BiRefNet Lite 512 fp16, MODNet fp16
- Targets ref: Boundary F >= 0.95, Alpha MAE <= 0.04 (from task spec)

## birefnet: mean IoU 0.7725 · Dice 0.8388 · Boundary F 0.5646 · Alpha MAE 0.0135
- Median 2450.4 ms · p95 2690.4 ms · 30-consecutive median 2389.6 ms (max 2707.0)
- Peak RSS 7351.2 MB (delta 3731.9 MB incl. ORT+model)

## modnet: mean IoU 0.1405 · Dice 0.1958 · Boundary F 0.1264 · Alpha MAE 0.1116
- Median 450.2 ms · p95 600.3 ms · 30-consecutive median 571.6 ms (max 615.0)
- Peak RSS 7351.2 MB (delta 3731.9 MB incl. ORT+model)

Caveat: BiRefNet trained on DIS distribution (in-domain); MODNet is portrait-matting (out-of-domain). Desktop-CPU numbers only.
Peak RSS includes the full parquet loaded in host RAM (harness artifact, not model memory) — real-device memory profiling is Phase 6.