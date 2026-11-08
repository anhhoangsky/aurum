"""Aurum AI Engine — quantitative benchmark vs DIS5K ground truth.

Runs BiRefNet Lite 512 fp16 + MODNet fp16 (ONNX Runtime CPU) over 30 DIS_TE1
samples and computes IoU / Dice / Boundary F-score / Alpha MAE against the
binary GT masks — the same formulas as `src/ai-engine/metrics.ts`.

Setup (one-time, ~400 MB download, NOT committed to the repo):
    python docs/ai-engine/benchmark/download-dis.py

Run:
    python docs/ai-engine/benchmark/benchmark-dis.py [n=30]

Outputs:
    docs/ai-engine/benchmark/results/dis-te1-<n>.json   raw metrics (committed)
    docs/ai-engine/benchmark/results/dis-te1-<n>.md     report (committed)

CAVEAT (read before citing numbers): DIS5K is BiRefNet's own training
distribution (DIS train split). BiRefNet is therefore evaluated in-domain;
MODNet (trained on portrait-matting data) is evaluated out-of-domain. The
comparison is meaningful for implementation validation, not a fair
"which model is better" claim in general. iPhone/browser numbers require
device testing (Phase 6) — these are desktop-CPU numbers only.
"""
import ctypes
import json
import os
import statistics
import sys
import time

import numpy as np
import onnxruntime as ort
import pyarrow.parquet as pq
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESULTS_DIR = os.path.join(ROOT, "benchmark", "results")
TMP = os.environ.get("AUREUM_AI_TMP", r"C:\Users\an385\AppData\Local\Temp\opencode\ai-engine-models")
PARQUET = os.environ.get("AUREUM_DIS_PARQUET", os.path.join(TMP, "DIS_TE1.parquet"))
BIREFNET = os.path.join(TMP, "birefnet-lite-512-fp16.onnx")
MODNET = os.path.join(TMP, "modnet-fp16.onnx")

B_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
B_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
M_MEAN = np.array([0.5, 0.5, 0.5], dtype=np.float32)


class ProcMem(ctypes.Structure):
    _fields_ = [("cb", ctypes.c_ulong), ("PageFaultCount", ctypes.c_ulong),
                ("PeakWorkingSetSize", ctypes.c_size_t), ("WorkingSetSize", ctypes.c_size_t),
                ("QuotaPeakPagedPoolUsage", ctypes.c_size_t), ("QuotaPagedPoolUsage", ctypes.c_size_t),
                ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t), ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
                ("PagefileUsage", ctypes.c_size_t), ("PeakPagefileUsage", ctypes.c_size_t)]


def rss_peak_mb():
    class PM(ctypes.Structure):
        _fields_ = [("cb", ctypes.c_ulong), ("PageFaultCount", ctypes.c_ulong),
                    ("PeakWorkingSetSize", ctypes.c_ulonglong),
                    ("WorkingSetSize", ctypes.c_ulonglong),
                    ("QuotaPeakPagedPoolUsage", ctypes.c_ulonglong),
                    ("QuotaPagedPoolUsage", ctypes.c_ulonglong),
                    ("QuotaPeakNonPagedPoolUsage", ctypes.c_ulonglong),
                    ("QuotaNonPagedPoolUsage", ctypes.c_ulonglong),
                    ("PagefileUsage", ctypes.c_ulonglong),
                    ("PeakPagefileUsage", ctypes.c_ulonglong)]
    pm = PM()
    pm.cb = ctypes.sizeof(PM)
    psapi = ctypes.windll.psapi
    psapi.GetProcessMemoryInfo.argtypes = [ctypes.c_void_p, ctypes.POINTER(PM), ctypes.c_ulong]
    psapi.GetProcessMemoryInfo.restype = ctypes.c_int
    ok = psapi.GetProcessMemoryInfo(ctypes.windll.kernel32.GetCurrentProcess(), ctypes.byref(pm), pm.cb)
    if not ok:
        return 0, 0
    return pm.PeakWorkingSetSize / (1024 * 1024), pm.WorkingSetSize / (1024 * 1024)


def gt_alpha(label_bytes):
    img = Image.open(__import__("io").BytesIO(label_bytes)).convert("L")
    a = np.asarray(img, dtype=np.float32) / 255.0
    return (a > 0.5).astype(np.float32), img.size


def birefnet(sess, img):
    x = img.resize((512, 512), Image.BILINEAR)
    arr = np.asarray(x, dtype=np.float32) / 255.0
    arr = (arr - B_MEAN) / B_STD
    t = np.transpose(arr, (2, 0, 1))[None].astype(np.float32)
    out = sess.run(None, {"input_image": t})[0][0, 0]
    return 1 / (1 + np.exp(-out.astype(np.float32)))


def modnet(sess, img):
    w, h = img.size
    scale = 512 / min(w, h)
    nw = max(32, int(round(w * scale / 32.0)) * 32)
    nh = max(32, int(round(h * scale / 32.0)) * 32)
    x = img.resize((nw, nh), Image.BILINEAR)
    arr = (np.asarray(x, dtype=np.float32) / 255.0 - M_MEAN) / M_MEAN
    t = np.transpose(arr, (2, 0, 1))[None].astype(np.float32)
    return sess.run(None, {"input": t})[0][0, 0]


def metrics(pred, gt):
    p = pred >= 0.5
    g = gt >= 0.5
    inter = np.logical_and(p, g).sum()
    union = np.logical_or(p, g).sum()
    iou = 1.0 if union == 0 else inter / union
    dice = 1.0 if (p.sum() + g.sum()) == 0 else 2 * inter / (p.sum() + g.sum())
    mae = np.abs(pred - gt).mean()
    # Boundary F-score, tolerance 2 px (4-connected boundaries, as metrics.ts).
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
    return {"iou": float(iou), "dice": float(dice), "boundary_f": float(bf), "alpha_mae": float(mae)}


def run_model(sess, kind, images):
    times, rows = [], []
    for img, gt, name in images:
        t0 = time.perf_counter()
        pred = birefnet(sess, img) if kind == "birefnet" else modnet(sess, img)
        pred = np.asarray(Image.fromarray((pred * 255).astype(np.uint8)).resize((gt.shape[1], gt.shape[0]), Image.BILINEAR), dtype=np.float32) / 255.0
        times.append((time.perf_counter() - t0) * 1000)
        m = metrics(pred, gt)
        rows.append({"image": name, "ms": round(times[-1], 1), **{k: round(v, 4) for k, v in m.items()}})
    return times, rows


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 30
    for p, what in [(PARQUET, "DIS_TE1.parquet"), (BIREFNET, "BiRefNet fp16"), (MODNET, "MODNet fp16")]:
        if not os.path.exists(p):
            print(f"MISSING {what}: {p}\nRun: python docs/ai-engine/benchmark/download-dis.py")
            return 1
    table = pq.read_table(PARQUET).to_pydict()
    total = len(table["image_name"])
    stride = max(1, total // n)
    idxs = list(range(0, total, stride))[:n]
    images = []
    for i in idxs:
        img = Image.open(__import__("io").BytesIO(table["image"][i]["bytes"])).convert("RGB")
        gt, _ = gt_alpha(table["label"][i]["bytes"])
        images.append((img, gt, table["image_name"][i]))
    print(f"extracted {len(images)} samples (stride {stride} over {total})")

    peak0, _ = rss_peak_mb()
    results = {"n": len(images), "dataset": "DIS_TE1 (nobg/DIS5K mirror, parquet)", "host": "desktop CPU"}
    for kind, path in [("birefnet", BIREFNET), ("modnet", MODNET)]:
        sess = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
        cold0 = time.perf_counter()
        times, rows = run_model(sess, kind, images)
        cold = (time.perf_counter() - cold0) * 1000
        # 30 consecutive (stability): reuse the same session on image 0
        cons = []
        img0 = images[0][0]
        for _ in range(30):
            t0 = time.perf_counter()
            (birefnet if kind == "birefnet" else modnet)(sess, img0)
            cons.append((time.perf_counter() - t0) * 1000)
        peak, _ = rss_peak_mb()
        agg = {k: round(statistics.mean(r[k] for r in rows), 4) for k in ("iou", "dice", "boundary_f", "alpha_mae")}
        results[kind] = {
            "mean": agg,
            "median_ms": round(statistics.median(times), 1),
            "p95_ms": round(sorted(times)[int(0.95 * len(times)) - 1], 1),
            "cold_ms": round(cold, 1),
            "consec30_median_ms": round(statistics.median(cons), 1),
            "consec30_max_ms": round(max(cons), 1),
            "peak_rss_mb": round(peak, 1),
            "peak_rss_delta_mb": round(peak - peak0, 1),
            "rows": rows,
        }
        print(kind, agg, f"median {results[kind]['median_ms']}ms peakRSS {peak:.0f}MB")
    os.makedirs(RESULTS_DIR, exist_ok=True)
    with open(os.path.join(RESULTS_DIR, f"dis-te1-{n}.json"), "w") as f:
        json.dump(results, f, indent=1)
    md = ["# DIS_TE1 benchmark results (desktop CPU, ONNX Runtime)", "",
          f"- Samples: {results['n']} (stride extraction from PARQUET, see script)",
          "- Models: BiRefNet Lite 512 fp16, MODNet fp16",
          "- Targets ref: Boundary F >= 0.95, Alpha MAE <= 0.04 (from task spec)",
          ""]
    for kind in ("birefnet", "modnet"):
        r = results[kind]
        md.append(f"## {kind}: mean IoU {r['mean']['iou']:.4f} · Dice {r['mean']['dice']:.4f} · "
                  f"Boundary F {r['mean']['boundary_f']:.4f} · Alpha MAE {r['mean']['alpha_mae']:.4f}")
        md.append(f"- Median {r['median_ms']} ms · p95 {r['p95_ms']} ms · "
                  f"30-consecutive median {r['consec30_median_ms']} ms (max {r['consec30_max_ms']})")
        md.append(f"- Peak RSS {r['peak_rss_mb']} MB (delta {r['peak_rss_delta_mb']} MB incl. ORT+model)")
        md.append("")
    md.append("Caveat: BiRefNet trained on DIS distribution (in-domain); MODNet is portrait-matting (out-of-domain). Desktop-CPU numbers only.
Peak RSS includes the full parquet loaded in host RAM (harness artifact, not model memory) — real-device memory profiling is Phase 6.")
    with open(os.path.join(RESULTS_DIR, f"dis-te1-{n}.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(md))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
