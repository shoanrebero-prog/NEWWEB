"""
Image pipeline for GES Global Trade.

    python3 scripts/images/process.py            # all images
    python3 scripts/images/process.py p04-racking

Source masters live in assets/source/ (original AI-generated images; briefs in
docs/IMAGE-BRIEFS.md). For each entry in manifest.json:
  1. Grade: a light, consistent treatment — soft highlight roll-off, cool deep
     shadows — so the set reads as one series.
  2. Export responsive AVIF + WebP widths to public/img/<dir>/ (scripts/images/encode.mjs).
     Widths above the master size are upscaled with Lanczos + light sharpening.
  3. Write src/data/images.json (dimensions, widths, placeholder colour, focal point, alt)
     which the templates read. `focus` becomes CSS object-position so narrow
     (mobile / card) crops keep the product in frame.

Requires: opencv-python-headless, numpy, node + sharp.
"""
import json
import pathlib
import shutil
import subprocess
import sys

import cv2
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
MANIFEST = json.loads((ROOT / "scripts/images/manifest.json").read_text())
CACHE = ROOT / ".cache/img"
OUT = ROOT / "public/img"
ENCODER = ROOT / "scripts/images/encode.mjs"


def grade(img):
    f = img.astype(np.float32) / 255.0
    f = np.where(f > 0.86, 0.86 + (f - 0.86) * 0.75, f)  # highlight roll-off
    lum = f.mean(axis=2, keepdims=True)
    shadow = np.clip(1 - lum * 2.4, 0, 1)[..., 0]
    f[..., 0] += 0.018 * shadow  # BGR: cool the lows slightly
    f[..., 2] -= 0.012 * shadow
    return np.clip(f * 255, 0, 255).astype(np.uint8)


def dominant(img):
    small = cv2.resize(img, (16, 16), interpolation=cv2.INTER_AREA)
    b, g, r = (small.reshape(-1, 3).mean(axis=0) * 0.6).astype(int)
    return f"#{r:02x}{g:02x}{b:02x}"


def main(only=None):
    meta_path = ROOT / "src/data/images.json"
    meta = {} if not only else json.loads(meta_path.read_text())
    if not only and OUT.exists():
        shutil.rmtree(OUT)  # full rebuild: no stale assets left behind
    CACHE.mkdir(parents=True, exist_ok=True)
    for e in MANIFEST:
        if only and e["name"] not in only:
            continue
        img = grade(cv2.imread(str(ROOT / e["src"])))
        h, w = img.shape[:2]
        master = CACHE / f"{e['name']}.png"
        cv2.imwrite(str(master), img)
        out_dir = OUT / e["dir"]
        out_dir.mkdir(parents=True, exist_ok=True)
        for old in out_dir.glob(f"{e['name']}-*"):
            old.unlink()
        widths = e["widths"]
        subprocess.run(["node", str(ENCODER), str(master), str(out_dir / e["name"]), ",".join(map(str, widths)), str(w)], check=True)
        fx, fy = e["focus"]
        meta[e["name"]] = {
            "dir": e["dir"],
            "widths": widths,
            "width": widths[-1],
            "height": round(widths[-1] * h / w),
            "color": dominant(img),
            "pos": f"{round(fx * 100)}% {round(fy * 100)}%",
            "alt": e["alt"],
            "origin": e["origin"],
        }
        print(f"{e['name']:28s} {w}x{h} -> {widths}")
    meta_path.write_text(json.dumps(meta, indent=1))


if __name__ == "__main__":
    main(sys.argv[1:] or None)
