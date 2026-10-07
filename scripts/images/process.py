"""
Image pipeline for GES Global Trade.

    python3 scripts/images/process.py            # all images
    python3 scripts/images/process.py p04-racking

For each entry in manifest.json:
  1. Download the source photograph (Unsplash licence: free commercial use,
     no attribution required — sources are still recorded in manifest.json).
  2. Retouch: inpaint the listed rectangles (manufacturer marks, model plates)
     so no third-party branding appears on the site. Rects are in 1600px-wide
     coordinates and scaled to the downloaded size.
  3. Grade: gentle, consistent treatment — slight cool shadows, controlled
     highlights — so 28 photographs read as one series.
  4. Crop (optional aspect, around a focus point) and export responsive
     AVIF + WebP widths to public/img/<dir>/.
  5. Write src/data/images.json (dimensions, widths, dominant colour) for templates.

Requires: opencv-python-headless, pillow (with AVIF support via pillow>=11) — or
falls back to sharp via node for AVIF if Pillow lacks it.
"""
import json
import pathlib
import subprocess
import sys
import urllib.request

import cv2
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
MANIFEST = json.loads((ROOT / "scripts/images/manifest.json").read_text())
CACHE = ROOT / ".cache/img-src"
OUT = ROOT / "public/img"
ENCODER = ROOT / "scripts/images/encode.mjs"


def fetch(entry):
    CACHE.mkdir(parents=True, exist_ok=True)
    src_w = max(entry["widths"])
    p = CACHE / f"{entry['name']}-{src_w}.jpg"
    if not p.exists():
        url = f"https://images.unsplash.com/{entry['base']}?w={min(src_w + 400, 2800)}&q=90&fm=jpg"
        urllib.request.urlretrieve(url, p)
    return p


def retouch(img, rects):
    if not rects:
        return img
    h, w = img.shape[:2]
    s = w / 1600
    mask = np.zeros((h, w), np.uint8)
    img = img.copy()
    for r in rects:
        x0, y0, x1, y1 = (int(v * s) for v in r[:4])
        if len(r) == 6:
            # Clone from an offset patch of the same surface (e.g. a forklift mast).
            dx, dy = int(r[4] * s), int(r[5] * s)
            img[y0:y1, x0:x1] = img[y0 + dy : y1 + dy, x0 + dx : x1 + dx]
            continue
        cv2.rectangle(mask, (x0, y0), (x1, y1), 255, -1)
    if not mask.any():
        return img
    out = cv2.inpaint(img, mask, max(3, int(4 * s)), cv2.INPAINT_NS)
    # Re-add a little grain over inpainted areas so they don't look smeared.
    noise = np.random.default_rng(7).normal(0, 3.2, img.shape).astype(np.float32)
    m = (cv2.GaussianBlur(mask, (0, 0), 2 * s) / 255.0)[..., None]
    return np.clip(out.astype(np.float32) + noise * m, 0, 255).astype(np.uint8)


def grade(img):
    f = img.astype(np.float32) / 255.0
    # Soft highlight roll-off.
    f = np.where(f > 0.82, 0.82 + (f - 0.82) * 0.72, f)
    # Cool, deep shadows (BGR): lift blue slightly, pull red in the lows.
    lum = f.mean(axis=2, keepdims=True)
    shadow = np.clip(1 - lum * 2.2, 0, 1)
    f[..., 0] += 0.025 * shadow[..., 0]
    f[..., 2] -= 0.02 * shadow[..., 0]
    # Mild contrast.
    f = (f - 0.5) * 1.04 + 0.5
    return np.clip(f * 255, 0, 255).astype(np.uint8)


def crop(img, aspect, focus):
    if not aspect:
        return img
    h, w = img.shape[:2]
    if w / h > aspect:
        nw = int(h * aspect)
        x = int(np.clip(focus[0] * w - nw / 2, 0, w - nw))
        return img[:, x : x + nw]
    nh = int(w / aspect)
    y = int(np.clip(focus[1] * h - nh / 2, 0, h - nh))
    return img[y : y + nh]


def dominant(img):
    small = cv2.resize(img, (16, 16), interpolation=cv2.INTER_AREA)
    b, g, r = (small.reshape(-1, 3).mean(axis=0) * 0.6).astype(int)  # darkened placeholder
    return f"#{r:02x}{g:02x}{b:02x}"


def main(only=None):
    meta_path = ROOT / "src/data/images.json"
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
    for e in MANIFEST:
        if only and e["name"] not in only:
            continue
        img = cv2.imread(str(fetch(e)))
        img = retouch(img, e["retouch"]) if img.shape[1] else img
        img = crop(grade(img), e["aspect"], e["focus"])
        h, w = img.shape[:2]
        widths = [x for x in e["widths"] if x <= w] or [w]
        master = CACHE / f"{e['name']}-master.png"
        cv2.imwrite(str(master), img)
        (OUT / e["dir"]).mkdir(parents=True, exist_ok=True)
        subprocess.run(
            ["node", str(ENCODER), str(master), str(OUT / e["dir"] / e["name"]), ",".join(map(str, widths))],
            check=True,
        )
        meta[e["name"]] = {
            "dir": e["dir"],
            "widths": widths,
            "width": widths[-1],
            "height": round(widths[-1] * h / w),
            "color": dominant(img),
            "alt": e["alt"],
            "source": e["href"],
        }
        print(f"{e['name']:28s} {w}x{h} -> {widths}")
    meta_path.write_text(json.dumps(meta, indent=1))


if __name__ == "__main__":
    main(sys.argv[1:] or None)
