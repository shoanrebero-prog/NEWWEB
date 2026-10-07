"""
GES Global Trade — logo system generator.

Builds every logo variant as outlined SVG (no font dependency) from one
geometric definition, so the mark can be tuned in a single place.

    python3 scripts/brand/build-logo.py

Concept — "the closing loop":
  * A heavy navy arc forms the G: the supply side, solid and engineered.
  * The G's opening is bridged by a thin electric-blue arc that completes the
    circle: the connection between supply and opportunity (global reach).
  * The G's crossbar runs from the rim into a single node at the centre:
    one origin point (Salalah) routing outward.
"""
import math
import pathlib

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
FONTS = ROOT / "node_modules/@fontsource/sora/files"
OUT = ROOT / "public/brand"

NAVY = "#0B1F3A"
ACCENT = "#2BA8FF"
WHITE = "#FFFFFF"
MONO_DARK = "#0B1F3A"

# --------------------------------------------------------------------------
# Symbol geometry (64 x 64 grid)
# --------------------------------------------------------------------------
C = 32.0          # centre
R_OUT = 28.0      # outer radius of the G ring
R_IN = 19.5       # inner radius  -> ring weight 8.5
BRIDGE_W = 2.8
BRIDGE_R = R_OUT - BRIDGE_W / 2   # sits on the outer rim: the silhouette closes into a full circle
BAR_TOP, BAR_BOTTOM = 27.6, 36.1        # crossbar band
BODY_START = math.degrees(math.asin((BAR_BOTTOM - C) / R_OUT))  # ring meets crossbar flush
BODY_END = 316.0       # degrees, SVG orientation (clockwise, 0 = east)
BRIDGE_START, BRIDGE_END = 322.5, 344.5
BAR_LEFT = 38.2
NODE_R = 4.1


def pt(r, deg):
    a = math.radians(deg)
    return C + r * math.cos(a), C + r * math.sin(a)


def f(n):
    return f"{n:.2f}".rstrip("0").rstrip(".")


def annular(r1, r2, a0, a1):
    """Closed path for a ring segment from angle a0 to a1 (clockwise)."""
    sweep = (a1 - a0) % 360
    large = 1 if sweep > 180 else 0
    x0, y0 = pt(r2, a0)
    x1, y1 = pt(r2, a1)
    x2, y2 = pt(r1, a1)
    x3, y3 = pt(r1, a0)
    return (
        f"M{f(x0)} {f(y0)}A{f(r2)} {f(r2)} 0 {large} 1 {f(x1)} {f(y1)}"
        f"L{f(x2)} {f(y2)}A{f(r1)} {f(r1)} 0 {large} 0 {f(x3)} {f(y3)}Z"
    )


def symbol_paths():
    body = annular(R_IN, R_OUT, BODY_START, BODY_END)
    # Crossbar: rectangle from BAR_LEFT to the outer rim, clipped to the circle
    # on the right so it reads as one continuous form with the ring.
    xr_top = C + math.sqrt(R_OUT**2 - (BAR_TOP - C) ** 2)
    xr_bot = C + math.sqrt(R_OUT**2 - (BAR_BOTTOM - C) ** 2)
    bar = (
        f"M{f(BAR_LEFT)} {f(BAR_TOP)}H{f(xr_top)}"
        f"A{f(R_OUT)} {f(R_OUT)} 0 0 1 {f(xr_bot)} {f(BAR_BOTTOM)}"
        f"H{f(BAR_LEFT)}Z"
    )
    bridge = annular(BRIDGE_R - BRIDGE_W / 2, BRIDGE_R + BRIDGE_W / 2, BRIDGE_START, BRIDGE_END)
    node = (
        f"M{f(C - NODE_R)} {f(C)}a{f(NODE_R)} {f(NODE_R)} 0 1 0 {f(2 * NODE_R)} 0"
        f"a{f(NODE_R)} {f(NODE_R)} 0 1 0 {f(-2 * NODE_R)} 0Z"
    )
    return {"solid": body + bar, "bridge": bridge, "node": node}


# --------------------------------------------------------------------------
# Wordmark (Sora, outlined)
# --------------------------------------------------------------------------
def text_path(text, weight, size, tracking_em, x=0.0, baseline=0.0):
    font = TTFont(FONTS / f"sora-latin-{weight}-normal.woff2")
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    scale = size / upm
    pen = SVGPathPen(gs)
    cursor = x
    for ch in text:
        gname = cmap[ord(ch)]
        g = gs[gname]
        tp = TransformPen(pen, (scale, 0, 0, -scale, cursor, baseline))
        g.draw(tp)
        cursor += g.width * scale + tracking_em * size
    width = cursor - x - tracking_em * size
    return pen.getCommands(), width


def cap_height(weight, size):
    font = TTFont(FONTS / f"sora-latin-{weight}-normal.woff2")
    return font["OS/2"].sCapHeight / font["head"].unitsPerEm * size


# --------------------------------------------------------------------------
# Compositions
# --------------------------------------------------------------------------
def symbol_group(solid, bridge, node, tx=0, ty=0, s=1.0):
    p = symbol_paths()
    return (
        f'<g transform="translate({f(tx)} {f(ty)}) scale({f(s)})">'
        f'<path fill="{solid}" d="{p["solid"]}"/>'
        f'<path fill="{bridge}" d="{p["bridge"]}"/>'
        f'<path fill="{node}" d="{p["node"]}"/></g>'
    )


def svg(w, h, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" '
        f'role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'
    )


def horizontal(colors, label="GES Global Trade"):
    """Primary lockup: symbol + GES (bold) + GLOBAL TRADE (regular), one line."""
    solid, bridge, node, text = colors
    sym = 64
    gap = 18
    size = 30
    ch = cap_height(700, size)
    baseline = 32 + ch / 2
    x = sym + gap
    ges, w1 = text_path("GES", 700, size, 0.04, x, baseline)
    x2 = x + w1 + size * 0.42
    gt, w2 = text_path("GLOBAL TRADE", 400, size, 0.06, x2, baseline)
    total = x2 + w2
    body = symbol_group(solid, bridge, node) + f'<path fill="{text}" d="{ges}{gt}"/>'
    return svg(total, 64, body, label)


def stacked(colors, label="GES Global Trade"):
    """Two-line lockup: GES over tracked GLOBAL TRADE, width-matched."""
    solid, bridge, node, text = colors
    x = 64 + 16
    big = 34
    ges, w1 = text_path("GES", 700, big, 0.05, x, 6 + cap_height(700, big))
    # Fit "GLOBAL TRADE" to the same width as "GES" + generous tracking.
    small = 10.2
    probe, pw = text_path("GLOBAL TRADE", 500, small, 0.0, 0, 0)
    tracking = (w1 - pw) / (len("GLOBAL TRADE") - 1) / small
    gt, w2 = text_path("GLOBAL TRADE", 500, small, tracking, x, 58)
    total = x + max(w1, w2)
    body = symbol_group(solid, bridge, node) + f'<path fill="{text}" d="{ges}{gt}"/>'
    return svg(total, 64, body, label)


def compact(colors, label="GES"):
    solid, bridge, node, text = colors
    x = 64 + 14
    size = 32
    ges, w1 = text_path("GES", 700, size, 0.05, x, 32 + cap_height(700, size) / 2)
    body = symbol_group(solid, bridge, node) + f'<path fill="{text}" d="{ges}"/>'
    return svg(x + w1, 64, body, label)


def symbol(colors, label="GES Global Trade symbol"):
    solid, bridge, node, _ = colors
    return svg(64, 64, symbol_group(solid, bridge, node), label)


def favicon():
    # Simplified for 16-32px: rounded navy tile, white G, accent bridge + node.
    p = symbol_paths()
    body = (
        f'<rect width="64" height="64" rx="14" fill="{NAVY}"/>'
        f'<g transform="translate(6 6) scale(.8125)">'
        f'<path fill="{WHITE}" d="{p["solid"]}"/>'
        f'<path fill="{ACCENT}" d="{p["bridge"]}"/>'
        f'<path fill="{ACCENT}" d="{p["node"]}"/></g>'
    )
    return svg(64, 64, body, "GES")


VARIANTS = {
    # name: (solid, bridge, node, text)
    "dark": (NAVY, ACCENT, ACCENT, NAVY),          # for light backgrounds
    "light": (WHITE, ACCENT, ACCENT, WHITE),       # for dark backgrounds
    "mono-dark": (MONO_DARK,) * 4,
    "mono-light": (WHITE,) * 4,
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, colors in VARIANTS.items():
        (OUT / f"ges-logo-{name}.svg").write_text(horizontal(colors))
        (OUT / f"ges-logo-stacked-{name}.svg").write_text(stacked(colors))
        (OUT / f"ges-compact-{name}.svg").write_text(compact(colors))
        (OUT / f"ges-symbol-{name}.svg").write_text(symbol(colors))
    (OUT / "favicon.svg").write_text(favicon())
    # Raw path data for the inline JS logo component.
    p = symbol_paths()
    _, _, _, _ = VARIANTS["light"]
    ges, w1 = text_path("GES", 700, 30, 0.04, 82, 32 + cap_height(700, 30) / 2)
    gt, w2 = text_path("GLOBAL TRADE", 400, 30, 0.06, 82 + w1 + 30 * 0.42, 32 + cap_height(700, 30) / 2)
    js = (
        "// Generated by scripts/brand/build-logo.py — do not edit by hand.\n"
        f"export const SYMBOL = {{ solid: '{p['solid']}', bridge: '{p['bridge']}', node: '{p['node']}' }};\n"
        f"export const WORD_GES = '{ges}';\n"
        f"export const WORD_GLOBAL_TRADE = '{gt}';\n"
        f"export const WORD_WIDTH = {f(82 + w1 + 30 * 0.42 + w2)};\n"
        f"export const GES_WIDTH = {f(82 + w1)};\n"
    )
    (ROOT / "src/brand").mkdir(parents=True, exist_ok=True)
    (ROOT / "src/brand/logo-paths.js").write_text(js)
    print("ok")


if __name__ == "__main__":
    main()
