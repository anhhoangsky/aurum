# BlazeFace ONNX smoke (Phase 1)
# Verifies the pinned garavv/blazeface-onnx artifact (blaze.onnx) on CPU.
# Records honest time/shape — not a quality benchmark.
import time
import numpy as np
import onnxruntime as ort
from PIL import Image

MODEL = "docs/ai-retouch/benchmark/blaze-face.onnx"
IMAGE = "test-assets/portrait.jpg"

def main():
    sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
    print("inputs", [(i.name, i.shape, i.type) for i in sess.get_inputs()])
    print("outputs", [(o.name, o.shape, o.type) for o in sess.get_outputs()])

    orig = Image.open(IMAGE).convert("RGB")
    W, H = orig.size
    img = orig.resize((128, 128))
    arr = np.asarray(img, dtype=np.float32) / 255.0
    x = arr.transpose(2, 0, 1)[None, :, :, :]

    for _ in range(3):
        t = time.time()
        out = sess.run(
            None,
            {
                "image": x,
                "conf_threshold": np.array([0.5], dtype=np.float32),
                "max_detections": np.array([10], dtype=np.int64),
                "iou_threshold": np.array([0.3], dtype=np.float32),
            },
        )
        ms = (time.time() - t) * 1000
        print(f"run {ms:.1f} ms out_shape={out[0].shape} first={out[0].flatten()[:4]}")
    print("OK — BlazeFace ONNX loads and runs on CPU")

if __name__ == "__main__":
    main()
