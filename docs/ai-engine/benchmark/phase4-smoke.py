"""Phase 4 smoke test: MobileSAM encoder + decoder (Acly/MobileSAM ONNX).

Inspects the exported graphs, then runs a point-prompt segmentation.
Run: python docs/ai-engine/benchmark/phase4-smoke.py [image] [x_frac] [y_frac]
"""
import os
import sys
import time

import numpy as np
import onnxruntime as ort
from PIL import Image

DIR = os.path.dirname(os.path.abspath(__file__))
ENC = os.environ.get("AUREUM_SAM_ENCODER", r"C:\Users\an385\AppData\Local\Temp\opencode\ai-engine-models\mobilesam-encoder.onnx")
DEC = os.environ.get("AUREUM_SAM_DECODER", r"C:\Users\an385\AppData\Local\Temp\opencode\ai-engine-models\mobilesam-decoder-multi.onnx")
MEAN = np.array([123.675, 116.28, 103.53], dtype=np.float32)
STD = np.array([58.395, 57.12, 57.375], dtype=np.float32)


def main():
    for p in (ENC, DEC):
        if not os.path.exists(p):
            print(f"MODEL NOT FOUND: {p}")
            return 1
    enc = ort.InferenceSession(ENC, providers=["CPUExecutionProvider"])
    dec = ort.InferenceSession(DEC, providers=["CPUExecutionProvider"])
    print("encoder inputs :", [(i.name, i.shape, i.type) for i in enc.get_inputs()])
    print("encoder outputs:", [(o.name, o.shape, o.type) for o in enc.get_outputs()])
    print("decoder inputs :", [(i.name, i.shape, i.type) for i in dec.get_inputs()])
    print("decoder outputs:", [(o.name, o.shape, o.type) for o in dec.get_outputs()])

    path = sys.argv[1] if len(sys.argv) > 1 else r"D:\rk3229\aurum-repo\test-assets\portrait.jpg"
    x = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5
    y = float(sys.argv[3]) if len(sys.argv) > 3 else 0.35
    img = Image.open(path).convert("RGB")
    W, H = img.size
    iname = enc.get_inputs()[0].name
    # Try HWC 0-255 (use_preprocess=True export): feed resized square.
    # The encoder pads to its training size internally. Try longest-side 640.
    longest = 640
    scale = longest / max(W, H)
    nw, nh = int(round(W * scale)), int(round(H * scale))
    small = img.resize((nw, nh), Image.BILINEAR)
    hwc = np.asarray(small, dtype=np.float32)
    t0 = time.perf_counter()
    try:
        emb = enc.run(None, {iname: hwc})[0]
        print(f"encoder HWC ok: {emb.shape} in {time.perf_counter()-t0:.2f}s")
    except Exception as e:
        print("HWC failed:", e)
        # Try normalized NCHW
        nchw = np.transpose((hwc - MEAN) / STD, (2, 0, 1))[None].astype(np.float32)
        emb = enc.run(None, {iname: nchw})[0]
        print(f"encoder NCHW ok: {emb.shape}")

    # Decoder: point_coords in ORIGINAL image coords (official SAM), but our
    # export may expect resized coords. Try both and print shapes.
    din = {i.name: i.shape for i in dec.get_inputs()}
    t0 = time.perf_counter()
    feeds = {}
    for name, shape in din.items():
        if name == "image_embeddings":
            feeds[name] = emb if emb.ndim == 4 else emb[None]
        elif name == "point_coords":
            # SAM convention: coords in ORIGINAL image space; the decoder
            # scales them into the 640 preprocess space using orig_im_size.
            feeds[name] = np.array([[[x * W, y * H]]], dtype=np.float32)
        elif name == "point_labels":
            feeds[name] = np.array([[1.0]], dtype=np.float32)
        elif name == "mask_input":
            feeds[name] = np.zeros((1, 1, 256, 256), dtype=np.float32)
        elif name == "has_mask_input":
            feeds[name] = np.array([0.0], dtype=np.float32)
        elif name == "orig_im_size":
            feeds[name] = np.array([H, W], dtype=np.float32)
        else:
            print("unknown decoder input:", name, shape)
    out = dec.run(None, feeds)
    print(f"decoder ok in {time.perf_counter()-t0:.2f}s, outputs:", [(o.shape, str(o.dtype)) for o in out])
    masks, iou = out[0], out[1] if len(out) > 1 else None
    print("mask range:", masks.min(), masks.max(), "iou:", iou)
    # Composite best-IoU mask over magenta at resized size
    best = int(np.argmax(iou[0])) if iou is not None else 0
    m = masks[0, best].astype(np.float32)
    m = 1 / (1 + np.exp(-m))
    # m is at orig_im_size (W,H); resize to the small preview size
    from PIL import Image as _I
    m_small = np.asarray(_I.fromarray((m * 255).astype(np.uint8)).resize((nw, nh), _I.BILINEAR), dtype=np.float32) / 255
    rgb = np.asarray(small, dtype=np.float32)
    bg = np.zeros_like(rgb); bg[..., 0] = 255
    comp = (rgb * m_small[..., None] + bg * (1 - m_small[..., None])).astype(np.uint8)
    name = "mobilesam-point.png"
    Image.fromarray(comp).save(os.path.dirname(ENC) + os.sep + name)
    print(f"  wrote {name} (mask {best}, frac>0.5={(m > 0.5).mean():.3f})")
    # Also direct-composite at original size: upscale mask
    morig = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), dtype=np.float32) / 255
    compsel = np.asarray(img, dtype=np.float32)
    compo = (compsel * morig[..., None] + bg[:1, :1] * 0 + np.array([255, 0, 255], dtype=np.float32) * (1 - morig[..., None])).astype(np.uint8)
    Image.fromarray(compo).save(os.path.dirname(ENC) + os.sep + "mobilesam-point-orig.png")
    print("  wrote mobilesam-point-orig.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
