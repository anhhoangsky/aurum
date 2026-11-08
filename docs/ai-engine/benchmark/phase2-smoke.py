"""Phase 2 smoke test: BiRefNet Lite 512 fp16 via ONNX Runtime (CPU).

Run: python docs/ai-engine/benchmark/phase2-smoke.py
Model path comes from AUREUM_AI_MODEL env or a default temp location.
Writes a transparent PNG next to the model so the matte can be inspected.
This script never commits weights to the repo.
"""
import os
import statistics
import sys
import time

import numpy as np
import onnxruntime as ort
from PIL import Image

MODEL = os.environ.get(
    "AUREUM_AI_MODEL",
    r"C:\Users\an385\AppData\Local\Temp\opencode\ai-engine-models\birefnet-lite-512-fp16.onnx",
)
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def preprocess(path: str, size: int = 512):
    img = Image.open(path).convert("RGB")
    img = img.resize((size, size), Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    arr = (arr - MEAN) / STD  # HWC
    return np.transpose(arr, (2, 0, 1))[None].astype(np.float32), img.size


def main():
    if not os.path.exists(MODEL):
        print(f"MODEL NOT FOUND: {MODEL}")
        print("Download from https://huggingface.co/studioludens/birefnet-lite-512 (onnx/model_fp16.onnx)")
        return 1
    images = sys.argv[1:] or [
        r"D:\rk3229\aurum-repo\demo\photo-river.jpg",
        r"D:\rk3229\aurum-repo\test-assets\portrait.jpg",
    ]
    sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
    print("inputs :", [(i.name, i.shape, i.type) for i in sess.get_inputs()])
    print("outputs:", [(o.name, o.shape, o.type) for o in sess.get_outputs()])
    for path in images:
        x, _ = preprocess(path)
        times = []
        out = None
        for _ in range(3):
            t0 = time.perf_counter()
            out = sess.run(None, {sess.get_inputs()[0].name: x})[0]
            times.append((time.perf_counter() - t0) * 1000)
        logits = out[0, 0] if out.ndim == 4 else out.reshape(512, 512)
        prob = 1 / (1 + np.exp(-logits.astype(np.float32)))
        print(
            f"{os.path.basename(path)}: shape={out.shape} dtype={out.dtype} "
            f"logits[min={logits.min():.3f} mean={logits.mean():.3f} max={logits.max():.3f}] "
            f"median={statistics.median(times):.0f}ms "
            f"min={min(times):.0f}ms max={max(times):.0f}ms "
            f"alpha[min={prob.min():.3f} mean={prob.mean():.3f} max={prob.max():.3f}]"
        )
        # Save preview: original 512 composite over magenta
        orig, _ = preprocess(path)
        rgb = np.transpose(orig[0] * STD.reshape(3, 1, 1) + MEAN.reshape(3, 1, 1), (1, 2, 0))
        rgb = np.clip(rgb * 255, 0, 255).astype(np.uint8)
        bg = np.zeros_like(rgb)
        bg[..., 0] = 255
        comp = (rgb * prob[..., None] + bg * (1 - prob[..., None])).astype(np.uint8)
        name = os.path.splitext(os.path.basename(path))[0] + "-matte.png"
        Image.fromarray(comp).save(os.path.join(os.path.dirname(MODEL), name))
        print(f"  wrote {name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
