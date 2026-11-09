"""Compare ISNet (onnx-community) vs BiRefNet Lite 512 on the same 30 DIS_TE1
samples. ISNet preprocessing: 1024x1024, (x-128)/256, NCHW; output logits
-> sigmoid (verify range at runtime).
Run: python docs/ai-engine/benchmark/benchmark-isnet.py [n=30]
"""
import os
import statistics
import sys
import time

import numpy as np
import onnxruntime as ort
import pyarrow.parquet as pq
from PIL import Image

TMP = os.environ.get("AUREUM_AI_TMP", r"C:\Users\an385\AppData\Local\Temp\opencode\ai-engine-models")
PARQUET = os.path.join(TMP, "DIS_TE1.parquet")
ISNET_FP16 = os.path.join(TMP, "isnet-fp16.onnx")
ISNET_INT8 = os.path.join(TMP, "isnet-int8.onnx")
BIREFNET = os.path.join(TMP, "birefnet-lite-512-fp16.onnx")

B_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
B_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def metrics(pred, gt):
    p = pred >= 0.5
    g = gt >= 0.5
    inter = np.logical_and(p, g).sum()
    union = np.logical_or(p, g).sum()
    iou = 1.0 if union == 0 else inter / union
    dice = 1.0 if (p.sum() + g.sum()) == 0 else 2 * inter / (p.sum() + g.sum())
    mae = np.abs(pred - gt).mean()
    def bnd(b):
        out = np.zeros_like(b)
        out[1:, :] |= b[1:, :] & ~b[:-1, :]
        out[:-1, :] |= b[:-1, :] & ~b[1:, :]
        out[:, 1:] |= b[:, 1:] & ~b[:, :-1]
        out[:, :-1] |= b[:, :-1] & ~b[:, 1:]
        return out
    pb, gb = bnd(p), bnd(g)
    sp, sg = pb.sum(), gb.sum()
    if sp == 0 and sg == 0:
        bf = 1.0
    elif sp == 0 or sg == 0:
        bf = 0.0
    else:
        def dilate(b, r):
            out = b.copy()
            for dy in range(-r, r + 1):
                for dx in range(-r, r + 1):
                    out |= np.roll(np.roll(b, dy, 0), dx, 1)
            return out
        gn, pn = dilate(gb, 2), dilate(pb, 2)
        prec = (pb & gn).sum() / sp
        rec = (gb & pn).sum() / sg
        bf = 0.0 if prec + rec == 0 else 2 * prec * rec / (prec + rec)
    return iou, dice, bf, mae


def isnet(sess, img):
    x = img.resize((1024, 1024), Image.BILINEAR)
    arr = np.asarray(x, dtype=np.float32)
    arr = (arr - 128.0) / 256.0
    t = np.transpose(arr, (2, 0, 1))[None].astype(np.float32)
    out = sess.run(None, {sess.get_inputs()[0].name: t})[0]
    o = out.reshape(1024, 1024).astype(np.float32)
    if o.min() < -0.01 or o.max() > 1.01:
        o = 1 / (1 + np.exp(-o))
    return o


def birefnet(sess, img):
    x = img.resize((512, 512), Image.BILINEAR)
    arr = np.asarray(x, dtype=np.float32) / 255.0
    arr = (arr - B_MEAN) / B_STD
    t = np.transpose(arr, (2, 0, 1))[None].astype(np.float32)
    out = sess.run(None, {"input_image": t})[0][0, 0]
    return 1 / (1 + np.exp(-out.astype(np.float32)))


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 30
    table = pq.read_table(PARQUET).to_pydict()
    total = len(table["image_name"])
    stride = max(1, total // n)
    idxs = list(range(0, total, stride))[:n]
    images = []
    for i in idxs:
        img = Image.open(__import__("io").BytesIO(table["image"][i]["bytes"])).convert("RGB")
        lab = Image.open(__import__("io").BytesIO(table["label"][i]["bytes"])).convert("L")
        gt = (np.asarray(lab, dtype=np.float32) / 255.0 > 0.5).astype(np.float32)
        images.append((img, gt))
    print(f"{len(images)} samples")
    for name, path, fn in [("isnet-fp16", ISNET_FP16, isnet), ("isnet-int8", ISNET_INT8, isnet), ("birefnet-512", BIREFNET, birefnet)]:
        if not os.path.exists(path):
            print(f"SKIP {name}: missing"); continue
        sess = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
        print(name, [(i.name, i.shape, i.type) for i in sess.get_inputs()], "->", [(o.name, o.shape) for o in sess.get_outputs()])
        agg, times = [], []
        for img, gt in images:
            t0 = time.perf_counter()
            pred = fn(sess, img)
            times.append((time.perf_counter() - t0) * 1000)
            pred = np.asarray(Image.fromarray((pred * 255).astype(np.uint8)).resize((gt.shape[1], gt.shape[0]), Image.BILINEAR), dtype=np.float32) / 255.0
            agg.append(metrics(pred, gt))
        m = np.mean(agg, axis=0)
        print(f"{name}: IoU={m[0]:.4f} Dice={m[1]:.4f} BoundaryF={m[2]:.4f} MAE={m[3]:.4f} median={statistics.median(times):.0f}ms")


if __name__ == "__main__":
    main()
