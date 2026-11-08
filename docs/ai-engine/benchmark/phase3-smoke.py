"""Phase 3 smoke test: MODNet (Xenova/modnet, fp32) via ONNX Runtime CPU.

Preprocessing from preprocessor_config.json: resize shortest edge 512,
rescale 1/255, normalize mean=std=0.5, size divisible by 32.
Output: alpha matte (sigmoid applied externally if needed — check range).

Run: python docs/ai-engine/benchmark/phase3-smoke.py
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
    r"C:\Users\an385\AppData\Local\Temp\opencode\ai-engine-models\modnet-fp32.onnx",
)
MEAN = np.array([0.5, 0.5, 0.5], dtype=np.float32)
STD = np.array([0.5, 0.5, 0.5], dtype=np.float32)


def preprocess(path: str):
    img = Image.open(path).convert("RGB")
    w, h = img.size
    scale = 512 / min(w, h)
    nw = max(32, int(round(w * scale / 32.0)) * 32)
    nh = max(32, int(round(h * scale / 32.0)) * 32)
    img = img.resize((nw, nh), Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    arr = (arr - MEAN) / STD
    return np.transpose(arr, (2, 0, 1))[None].astype(np.float32), (nw, nh)


def main():
    if not os.path.exists(MODEL):
        print(f"MODEL NOT FOUND: {MODEL}")
        return 1
    images = sys.argv[1:] or [
        r"D:\rk3229\aurum-repo\test-assets\portrait.jpg",
        r"D:\rk3229\aurum-repo\demo\photo-river.jpg",
    ]
    sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
    print("inputs :", [(i.name, i.shape, i.type) for i in sess.get_inputs()])
    print("outputs:", [(o.name, o.shape, o.type) for o in sess.get_outputs()])
    for path in images:
        x, (nw, nh) = preprocess(path)
        times = []
        out = None
        for _ in range(3):
            t0 = time.perf_counter()
            out = sess.run(None, {sess.get_inputs()[0].name: x})[0]
            times.append((time.perf_counter() - t0) * 1000)
        # Take the first output tensor, squeeze to HxW
        arr = np.asarray(out)
        flat = arr.reshape(arr.shape[0], -1) if arr.ndim > 2 else arr
        # MODNet returns alpha in [0,1] directly in most exports; if the
        # range looks like logits, apply sigmoid and note it.
        vals = flat[0].astype(np.float32)
        if vals.min() < -0.01 or vals.max() > 1.01:
            prob = 1 / (1 + np.exp(-vals))
            print("  output looks like logits -> applied sigmoid")
        else:
            prob = vals
        prob = prob.reshape(nh, nw)
        print(
            f"{os.path.basename(path)}: out={out.shape} dtype={out.dtype} "
            f"median={statistics.median(times):.0f}ms "
            f"alpha[min={prob.min():.3f} mean={prob.mean():.3f} max={prob.max():.3f}] "
            f"input={nw}x{nh}"
        )
        orig = Image.open(path).convert("RGB").resize((nw, nh), Image.BILINEAR)
        rgb = np.asarray(orig, dtype=np.float32)
        bg = np.zeros_like(rgb)
        bg[..., 0] = 255
        comp = (rgb * prob[..., None] + bg * (1 - prob[..., None])).astype(np.uint8)
        name = os.path.splitext(os.path.basename(path))[0] + "-modnet.png"
        Image.fromarray(comp).save(os.path.join(os.path.dirname(MODEL), name))
        print(f"  wrote {name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
