"""Generate the PlainBlack favicon and app-icon set from the brand sources.

PATHS REPAIRED 2026-08-22. Every path in this file was dead when it arrived in the
repo. The output root pointed at a Codex scratch directory, and all three sources
pointed at ~/Desktop/PlainBlack., a folder that no longer exists. The sources were
found intact at ~/Studio/plainblack/assets/Logo & Signatures/ and each replacement
was confirmed on disk before it was written here.

BRAND is an absolute path to a folder OUTSIDE this repo, because that is where the
masters actually live and this repo is public. Override it if the folder moves. It moved
once already: `plainblack/brand/` was renamed to `plainblack/assets/` on 2026-08-31 so
plainblack matches the client folder scheme, and this line was updated with it.

NOTE, NOT CHANGED: GREEN below is #21f294, which is not any of the greens this
business documents. The logo green is #06CC5D and the status green is #3ECF8E; see
plainblack-admin/CLAUDE.md for the full taxonomy and why they are not
interchangeable. Whether the icons should be regenerated on a documented green is a
brand decision, so the value is left exactly as it was.
"""

from __future__ import annotations

import base64
import json
import shutil
import subprocess
from pathlib import Path

# The brand masters live outside this repo.
BRAND = Path("/Users/jaydenbrown/Studio/plainblack/assets/Logo & Signatures")

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent / "assets"
OUT = ROOT / "PlainBlack Icon Favicon Set"
SOURCE_ROUND = BRAND / "Simple Logo/simple logo round.png"
SOURCE_MARK = BRAND / "Icon/PB Icon.png"
SOURCE_FAVICON_WEBP = BRAND / "Icon/favicon.webp"

GREEN = "#21f294"
BLACK = "#050505"
WHITE = "#f7f7f2"


def alpha_bbox(image: Image.Image, threshold: int = 1) -> tuple[int, int, int, int]:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= threshold else 0)
    return mask.getbbox() or (0, 0, rgba.width, rgba.height)


def contain_icon(
    source: Image.Image,
    size: int,
    *,
    padding: float = 0.08,
    background: str | None = None,
    crop: bool = True,
) -> Image.Image:
    src = source.convert("RGBA")
    if crop:
        src = src.crop(alpha_bbox(src))

    canvas = Image.new("RGBA", (size, size), background or (0, 0, 0, 0))
    max_side = max(1, int(size * (1 - padding * 2)))
    scale = min(max_side / src.width, max_side / src.height)
    new_size = (max(1, round(src.width * scale)), max(1, round(src.height * scale)))
    resized = src.resize(new_size, Image.Resampling.LANCZOS)
    offset = ((size - resized.width) // 2, (size - resized.height) // 2)
    canvas.alpha_composite(resized, offset)
    return canvas


def flat_mark_icon(source: Image.Image, size: int, *, padding: float = 0.075) -> Image.Image:
    fitted = contain_icon(source, size, padding=padding)
    alpha = fitted.getchannel("A")
    flat = Image.new("RGBA", (size, size), GREEN)
    flat.putalpha(alpha)
    return flat


def write_png(path: Path, image: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)


def embedded_svg(path: Path, image_path: Path, title: str) -> None:
    data = base64.b64encode(image_path.read_bytes()).decode("ascii")
    with Image.open(image_path) as image:
        width, height = image.size
    path.write_text(
        f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">
  <title>{title}</title>
  <image width="{width}" height="{height}" href="data:image/png;base64,{data}" />
</svg>
""",
        encoding="utf-8",
    )


def make_trace_svg(mask_path: Path, out_path: Path, color: str) -> None:
    subprocess.run(
        [
            "/opt/homebrew/bin/potrace",
            "-s",
            "--flat",
            "--turdsize",
            "6",
            "--opttolerance",
            "0.35",
            "-C",
            color,
            "-o",
            str(out_path),
            str(mask_path),
        ],
        check=True,
    )
    svg = out_path.read_text(encoding="utf-8")
    svg = svg.replace("<title></title>", "<title>PlainBlack icon</title>")
    svg = svg.replace("<svg ", '<svg role="img" aria-label="PlainBlack icon" ')
    out_path.write_text(svg, encoding="utf-8")


def make_mask(mark: Image.Image, path: Path) -> None:
    rgba = mark.convert("RGBA")
    alpha = rgba.getchannel("A")
    # Trace the visible alpha shape; black pixels are what potrace turns into paths.
    mask = Image.new("1", rgba.size, 1)
    mask_pixels = mask.load()
    alpha_pixels = alpha.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            if alpha_pixels[x, y] > 24:
                mask_pixels[x, y] = 0
    mask.save(path)


def copy_file(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def preview_sheet(path: Path, rows: list[tuple[str, Image.Image]]) -> None:
    tile = 220
    label_h = 54
    cols = 3
    rows_count = (len(rows) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tile, rows_count * (tile + label_h)), BLACK)
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 12)
    except OSError:
        font = ImageFont.load_default()

    checker_light = (38, 38, 38)
    checker_dark = (18, 18, 18)

    for index, (label, image) in enumerate(rows):
        col = index % cols
        row = index // cols
        x0 = col * tile
        y0 = row * (tile + label_h)
        area = Image.new("RGB", (tile, tile), BLACK)
        chk = ImageDraw.Draw(area)
        for cy in range(0, tile, 16):
            for cx in range(0, tile, 16):
                fill = checker_light if (cx // 16 + cy // 16) % 2 == 0 else checker_dark
                chk.rectangle((cx, cy, cx + 15, cy + 15), fill=fill)
        thumb_size = 148
        thumb = contain_icon(image, thumb_size, padding=0.02, background=None, crop=False)
        area.paste(
            thumb.convert("RGBA"),
            ((tile - thumb_size) // 2, (tile - thumb_size) // 2),
            thumb.convert("RGBA"),
        )
        sheet.paste(area, (x0, y0))
        draw.text((x0 + 12, y0 + tile + 12), label, fill=WHITE, font=font)

    sheet.save(path, "PNG", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "assets").mkdir(exist_ok=True)
    (OUT / "svg").mkdir(exist_ok=True)
    (OUT / "source").mkdir(exist_ok=True)

    round_logo = Image.open(SOURCE_ROUND).convert("RGBA")
    mark = Image.open(SOURCE_MARK).convert("RGBA")
    favicon_webp = Image.open(SOURCE_FAVICON_WEBP).convert("RGBA")

    copy_file(SOURCE_ROUND, OUT / "source" / "simple-logo-round.png")
    copy_file(SOURCE_MARK, OUT / "source" / "pb-icon.png")
    copy_file(SOURCE_FAVICON_WEBP, OUT / "source" / "favicon.webp")

    favicon_sizes = [16, 32, 48, 64, 96, 128, 256]
    for size in favicon_sizes:
        write_png(OUT / "assets" / f"favicon-{size}x{size}.png", flat_mark_icon(mark, size, padding=0.075))

    write_png(OUT / "favicon.png", flat_mark_icon(mark, 32, padding=0.075))
    write_png(OUT / "assets" / "favicon.png", flat_mark_icon(mark, 32, padding=0.075))

    icon_specs = [
        ("apple-touch-icon.png", 180, 0.03, BLACK),
        ("assets/icon-180.png", 180, 0.03, BLACK),
        ("assets/icon-192.png", 192, 0.03, BLACK),
        ("assets/icon-512.png", 512, 0.03, BLACK),
        ("assets/android-chrome-192x192.png", 192, 0.03, BLACK),
        ("assets/android-chrome-512x512.png", 512, 0.03, BLACK),
        ("assets/mstile-150x150.png", 150, 0.05, BLACK),
        ("assets/icon-maskable-192.png", 192, 0.16, BLACK),
        ("assets/icon-maskable-512.png", 512, 0.16, BLACK),
    ]
    preview_rows: list[tuple[str, Image.Image]] = []
    for name, size, padding, background in icon_specs:
        image = contain_icon(round_logo, size, padding=padding, background=background)
        write_png(OUT / name, image)
        preview_rows.append((name.split("/")[-1], image))

    # Browser .ico with multiple embedded sizes.
    ico_source = flat_mark_icon(mark, 512, padding=0.075)
    ico_source.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

    embedded_svg(OUT / "svg" / "pb-icon-embedded.svg", OUT / "source" / "pb-icon.png", "PlainBlack PB icon")
    embedded_svg(OUT / "svg" / "plainblack-round-logo-embedded.svg", OUT / "source" / "simple-logo-round.png", "PlainBlack round logo")

    mask_path = OUT / "svg" / "pb-icon-mask.pbm"
    make_mask(mark, mask_path)
    make_trace_svg(mask_path, OUT / "svg" / "pb-icon-flat.svg", GREEN)
    make_trace_svg(mask_path, OUT / "favicon.svg", GREEN)
    make_trace_svg(mask_path, OUT / "safari-pinned-tab.svg", "#000000")
    mask_path.unlink()

    manifest = {
        "name": "PlainBlack",
        "short_name": "PlainBlack",
        "icons": [
            {"src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/assets/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable"},
            {"src": "/assets/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
        "theme_color": BLACK,
        "background_color": BLACK,
        "display": "standalone",
    }
    (OUT / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    (OUT / "browserconfig.xml").write_text(
        f"""<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/assets/mstile-150x150.png"/>
      <TileColor>{BLACK}</TileColor>
    </tile>
  </msapplication>
</browserconfig>
""",
        encoding="utf-8",
    )

    (OUT / "head-tags.html").write_text(
        """<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#21f294">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#050505">
""",
        encoding="utf-8",
    )

    readme = """# PlainBlack Icon and Favicon Set

Generated from the supplied PlainBlack logo files.

Recommended website files:

- `favicon.ico`
- `favicon.svg`
- `favicon.png`
- `apple-touch-icon.png`
- `site.webmanifest`
- `browserconfig.xml`
- everything in `assets/`

SVG notes:

- `favicon.svg` and `svg/pb-icon-flat.svg` are traced vector SVGs of the PB mark.
- `svg/pb-icon-embedded.svg` preserves the original textured PNG inside an SVG wrapper.
- `svg/plainblack-round-logo-embedded.svg` preserves the full round logo inside an SVG wrapper.

The favicon files use the green PB mark so the icon stays readable at tiny sizes.
The app/touch icons use the round PlainBlack logo on a black square background.
"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")

    preview_rows.extend(
        [
            ("favicon-16x16.png", Image.open(OUT / "assets" / "favicon-16x16.png").convert("RGBA")),
            ("favicon-32x32.png", Image.open(OUT / "assets" / "favicon-32x32.png").convert("RGBA")),
            ("favicon-96x96.png", Image.open(OUT / "assets" / "favicon-96x96.png").convert("RGBA")),
            ("PB source", mark),
        ]
    )
    preview_sheet(OUT / "preview-sheet.png", preview_rows)


if __name__ == "__main__":
    main()
