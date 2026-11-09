# BlazeFace smoke — 2026-11-09 (Python ORT 1.31.1 CPU, desktop)

Model: `docs/ai-retouch/benchmark/blaze-face.onnx` (535,842 B, SHA-256 `564740c5…adf8a5`)
Image: `test-assets/portrait.jpg`

```
inputs [('image', [1, 3, 128, 128], 'tensor(float)'), ('conf_threshold', [1], 'tensor(float)'), ('max_detections', [1], 'tensor(int64)'), ('iou_threshold', [1], 'tensor(float)')]
outputs [('selectedBoxes', [1, 896, 16], 'tensor(float)')]
run 4.2 ms out_shape=(1, 16) first=[0.11681666 0.37290764 0.35414243 0.61023384]
run 4.0 ms out_shape=(1, 16) first=[0.11681666 0.37290764 0.35414243 0.61023384]
run 3.0 ms out_shape=(1, 16) first=[0.11681666 0.37290764 0.35414243 0.61023384]
OK — BlazeFace ONNX loads and runs on CPU
```

Decode (HF README order): `top_y=0.117, top_x=0.373, bot_y=0.354, bot_x=0.610` → normalized box `x=0.373, y=0.117, w=0.237, h=0.237` (1 face). iPhone WebGPU timing pending (Phase 6).
