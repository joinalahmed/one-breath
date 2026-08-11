from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "assets" / "generated-buttons-v2"
CHROMA_DIR = ASSET_DIR / "chroma"


def remove_magenta(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    rgb = np.asarray(image, dtype=np.uint8)[..., :3]
    r = rgb[..., 0].astype(np.int16)
    g = rgb[..., 1].astype(np.int16)
    b = rgb[..., 2].astype(np.int16)

    # The generated sheets use a saturated magenta key. This hue test keeps
    # purple, coral, turquoise, cream and gold artwork fully opaque.
    chroma = (
        (r > 145)
        & (b > 145)
        & ((np.minimum(r, b) - g) > 75)
        & (np.abs(r - b) < 105)
    )
    foreground = Image.fromarray((~chroma).astype(np.uint8) * 255, mode="L")
    foreground = foreground.filter(ImageFilter.MedianFilter(3))
    foreground = foreground.filter(ImageFilter.GaussianBlur(0.7))

    result = image.copy()
    result.putalpha(foreground)
    bbox = foreground.getbbox()
    if bbox:
        padding = 10
        bbox = (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(result.width, bbox[2] + padding),
            min(result.height, bbox[3] + padding),
        )
        result = result.crop(bbox)
    result.save(destination, optimize=True)


def create_preview(files: list[Path]) -> None:
    cell_w, cell_h = 620, 410
    columns = 2
    rows = (len(files) + columns - 1) // columns
    preview = Image.new("RGBA", (cell_w * columns, cell_h * rows), (26, 142, 188, 255))
    draw = ImageDraw.Draw(preview)
    for index, path in enumerate(files):
        item = Image.open(path).convert("RGBA")
        item.thumbnail((560, 330), Image.Resampling.LANCZOS)
        col, row = index % columns, index // columns
        x = col * cell_w + (cell_w - item.width) // 2
        y = row * cell_h + 18
        preview.alpha_composite(item, (x, y))
        draw.text((col * cell_w + 22, row * cell_h + 370), path.stem, fill="white")
    preview.save(ASSET_DIR / "pearl-coast-buttons-preview.png", optimize=True)


def main() -> None:
    outputs = []
    for source in sorted(CHROMA_DIR.glob("*.png")):
        destination = ASSET_DIR / source.name
        remove_magenta(source, destination)
        outputs.append(destination)
    create_preview(outputs)


if __name__ == "__main__":
    main()
