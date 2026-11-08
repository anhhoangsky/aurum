"""One-time download of the DIS_TE1 parquet (ground-truth benchmark data).

Source: nobg/DIS5K mirror on HuggingFace (Apache-2.0 per dataset card;
DIS5K has its own Terms of Use PDF — check it before redistribution).
Downloaded to the local model cache only; never committed to the repo.

Run: python docs/ai-engine/benchmark/download-dis.py
"""
import os

import requests

URL = "https://huggingface.co/datasets/nobg/DIS5K/resolve/main/data/DIS_TE1-00000-of-00001-f9bce3f0fddcae93.parquet"
TMP = os.environ.get("AUREUM_AI_TMP", r"C:\Users\an385\AppData\Local\Temp\opencode\ai-engine-models")


def main():
    os.makedirs(TMP, exist_ok=True)
    out = os.path.join(TMP, "DIS_TE1.parquet")
    if os.path.exists(out):
        print(f"already present: {out}")
        return 0
    print(f"downloading {URL} ...")
    with requests.get(URL, stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(out, "wb") as f:
            for chunk in r.iter_content(1024 * 1024):
                f.write(chunk)
    print(f"saved {out} ({os.path.getsize(out)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
