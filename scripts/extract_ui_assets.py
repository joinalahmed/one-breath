from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "assets" / "extracted-buttons" / "source-home-screen.png"
OUT = SOURCE.parent


# crop = (left, top, right, bottom)
# shape = (kind, inset, radius)
ASSETS = {
    "hud-level-ring": ((30, 42, 179, 184), ("ellipse", 2, 0)),
    "hud-pearl-counter": ((181, 65, 399, 169), ("rounded", 2, 48)),
    "hud-fish-counter": ((419, 65, 640, 169), ("rounded", 2, 48)),
    "hud-streak-counter": ((657, 65, 844, 169), ("rounded", 2, 48)),
    "button-start-dive": ((179, 1250, 782, 1428), ("rounded", 3, 86)),
    "button-gear": ((55, 1425, 258, 1654), ("rounded", 3, 52)),
    "button-quests": ((273, 1425, 479, 1654), ("rounded", 3, 52)),
    "button-photos": ((491, 1425, 698, 1654), ("rounded", 3, 52)),
    "button-map": ((706, 1425, 912, 1654), ("rounded", 3, 52)),
}


def mask_for(size: tuple[int, int], shape: tuple[str, int, int]) -> Image.Image:
    kind, inset, radius = shape
    scale = 4
    w, h = size
    mask = Image.new("L", (w * scale, h * scale), 0)
    draw = ImageDraw.Draw(mask)
    bounds = (
        inset * scale,
        inset * scale,
        (w - inset - 1) * scale,
        (h - inset - 1) * scale,
    )
    if kind == "ellipse":
        draw.ellipse(bounds, fill=255)
    else:
        draw.rounded_rectangle(bounds, radius=radius * scale, fill=255)
    mask = mask.resize((w, h), Image.Resampling.LANCZOS)
    return mask.filter(ImageFilter.GaussianBlur(0.35))


def trim(image: Image.Image, padding: int = 3) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    bottom = min(image.height, bbox[3] + padding)
    return image.crop((left, top, right, bottom))


def contact_sheet(files: list[Path]) -> None:
    thumbs = []
    for path in files:
        image = Image.open(path).convert("RGBA")
        image.thumbnail((360, 220), Image.Resampling.LANCZOS)
        thumbs.append((path.stem, image.copy()))

    cell_w, cell_h = 420, 290
    cols = 2
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGBA", (cell_w * cols, cell_h * rows), (12, 97, 151, 255))
    draw = ImageDraw.Draw(sheet)
    for index, (name, image) in enumerate(thumbs):
        col, row = index % cols, index // cols
        x = col * cell_w + (cell_w - image.width) // 2
        y = row * cell_h + 18
        sheet.alpha_composite(image, (x, y))
        draw.text((col * cell_w + 20, row * cell_h + 250), name, fill="white")
    sheet.save(OUT / "pearl-coast-ui-assets-preview.png")


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    outputs = []
    for name, (box, shape) in ASSETS.items():
        crop = source.crop(box)
        crop.putalpha(mask_for(crop.size, shape))
        crop = trim(crop)
        path = OUT / f"{name}.png"
        crop.save(path, optimize=True)
        outputs.append(path)
    contact_sheet(outputs)


if __name__ == "__main__":
    main()
