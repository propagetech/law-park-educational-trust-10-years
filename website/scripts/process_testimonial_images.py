#!/usr/bin/env python3
"""
Batch process testimonial/magazine images: face-aware 9:16 portrait crop + grayscale.

Uses OpenCV (Haar Cascade) for face detection and Pillow for image manipulation.
- Single or multiple faces: crop expands to include all faces with head/shoulders padding.
- No face detected: fallback to center crop so no image is lost.
- Output: 9:16 portrait, grayscale, consistent width (web or print resolution).

Requirements:
    pip install opencv-python Pillow numpy

Usage:
    # Web (1080px width) — default
    python scripts/process_testimonial_images.py

    # Print-friendly resolution (e.g. 2160px width)
    python scripts/process_testimonial_images.py --print

    # Custom input/output
    python scripts/process_testimonial_images.py --input public/magazine/testimonial-images --output public/magazine/NGO_Processed_Images

    # Only specific files (paths after options; --input ignored)
    python scripts/process_testimonial_images.py --output public/magazine/NGO_Processed_Images path/to/a.jpg path/to/b.jpg

    # Stable numbered names (order = argument order for explicit files, sorted for --input)
    python scripts/process_testimonial_images.py --basename-prefix children-story --output public/images/children-stories-processed --print file1.jpeg file2.jpeg
"""

import argparse
import sys
from pathlib import Path
from typing import List, Tuple, Optional

try:
    import cv2
    import numpy as np
    from PIL import Image
except ImportError as e:
    print(f"Error: Missing required library. Install with: pip install opencv-python Pillow numpy")
    sys.exit(1)


# 9:16 portrait
PORTRAIT_W_RATIO = 9
PORTRAIT_H_RATIO = 16

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def get_haar_cascade_path() -> str:
    """Path to Haar Cascade XML shipped with OpenCV."""
    return cv2.data.haarcascades + "haarcascade_frontalface_default.xml"


def detect_faces_cv2(image_bgr: np.ndarray) -> List[Tuple[int, int, int, int]]:
    """
    Detect faces using Haar Cascade.

    Returns:
        List of (x, y, w, h) for each face.
    """
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    cascade_path = get_haar_cascade_path()
    classifier = cv2.CascadeClassifier(cascade_path)
    if classifier.empty():
        raise RuntimeError(f"Failed to load cascade: {cascade_path}")

    # scaleFactor and minNeighbors tuned for variety of sizes and to reduce false positives
    faces = classifier.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=c2_flags(),
    )
    return [tuple(map(int, (x, y, w, h))) for (x, y, w, h) in faces]


def c2_flags() -> int:
    """CV2 flags for detectMultiScale (version-dependent)."""
    try:
        return cv2.CASCADE_SCALE_IMAGE
    except AttributeError:
        return 0


def union_rect(rects: List[Tuple[int, int, int, int]]) -> Optional[Tuple[int, int, int, int]]:
    """Minimum bounding box that encompasses all (x, y, w, h) rects. Returns (x, y, w, h)."""
    if not rects:
        return None
    xs = [r[0] for r in rects]
    ys = [r[1] for r in rects]
    right = max(r[0] + r[2] for r in rects)
    bottom = max(r[1] + r[3] for r in rects)
    x = min(xs)
    y = min(ys)
    w = right - x
    h = bottom - y
    return (x, y, w, h)


def expand_rect(
    x: int, y: int, w: int, h: int,
    padding_factor: float,
    img_width: int, img_height: int,
) -> Tuple[int, int, int, int]:
    """
    Expand rect by padding_factor around its center (for head/shoulders).
    Clamped to image bounds. Returns (x, y, w, h).
    """
    cx = x + w / 2.0
    cy = y + h / 2.0
    new_w = w * padding_factor
    new_h = h * padding_factor
    x1 = int(cx - new_w / 2)
    y1 = int(cy - new_h / 2)
    x2 = int(cx + new_w / 2)
    y2 = int(cy + new_h / 2)
    x1 = max(0, x1)
    y1 = max(0, y1)
    x2 = min(img_width, x2)
    y2 = min(img_height, y2)
    return (x1, y1, x2 - x1, y2 - y1)


def make_916_crop_around_rect(
    img_width: int, img_height: int,
    content_x: int, content_y: int, content_w: int, content_h: int,
) -> Tuple[int, int, int, int]:
    """
    Compute 9:16 portrait crop that contains the given content rect, centered on it.
    Crop may extend outside image (caller can pad). Returns (x, y, crop_w, crop_h).
    """
    cx = content_x + content_w / 2.0
    cy = content_y + content_h / 2.0
    # Smallest 9:16 box that contains content
    crop_w = max(content_w, content_h * PORTRAIT_W_RATIO / PORTRAIT_H_RATIO)
    crop_h = crop_w * PORTRAIT_H_RATIO / PORTRAIT_W_RATIO
    if crop_h < content_h:
        crop_h = content_h
        crop_w = crop_h * PORTRAIT_W_RATIO / PORTRAIT_H_RATIO
    x = int(cx - crop_w / 2)
    y = int(cy - crop_h / 2)
    return (x, y, int(crop_w), int(crop_h))


def clamp_crop_to_image(
    x: int, y: int, crop_w: int, crop_h: int,
    img_width: int, img_height: int,
) -> Tuple[int, int, int, int]:
    """Clamp crop to image; may shrink. Returns (x, y, w, h)."""
    x1 = max(0, x)
    y1 = max(0, y)
    x2 = min(img_width, x + crop_w)
    y2 = min(img_height, y + crop_h)
    return (x1, y1, x2 - x1, y2 - y1)


def extract_region_padded(
    image: np.ndarray,
    x: int, y: int, crop_w: int, crop_h: int,
    fill: Tuple[int, ...] = (128, 128, 128),
) -> np.ndarray:
    """
    Extract region (x, y, crop_w, crop_h). If region goes outside image, pad with fill.
    Returns BGR image of size (crop_h, crop_w).
    """
    img_h, img_w = image.shape[:2]
    out = np.zeros((crop_h, crop_w, image.shape[2]), dtype=image.dtype)
    out[:] = fill

    # Source region (clamped)
    sx1 = max(0, x)
    sy1 = max(0, y)
    sx2 = min(img_w, x + crop_w)
    sy2 = min(img_h, y + crop_h)
    # Destination offsets
    dx1 = sx1 - x
    dy1 = sy1 - y
    dx2 = dx1 + (sx2 - sx1)
    dy2 = dy1 + (sy2 - sy1)
    if dx2 <= dx1 or dy2 <= dy1:
        return out
    out[dy1:dy2, dx1:dx2] = image[sy1:sy2, sx1:sx2]
    return out


def center_crop_916(img_width: int, img_height: int) -> Tuple[int, int, int, int]:
    """Largest 9:16 crop centered in image. Returns (x, y, w, h)."""
    if img_height * PORTRAIT_W_RATIO >= img_width * PORTRAIT_H_RATIO:
        crop_h = img_height
        crop_w = int(img_height * PORTRAIT_W_RATIO / PORTRAIT_H_RATIO)
    else:
        crop_w = img_width
        crop_h = int(img_width * PORTRAIT_H_RATIO / PORTRAIT_W_RATIO)
    x = (img_width - crop_w) // 2
    y = (img_height - crop_h) // 2
    return (x, y, crop_w, crop_h)


def process_image(
    image_path: Path,
    output_dir: Path,
    output_width: int,
    padding_factor: float,
    jpeg_quality: int,
    use_grayscale: bool,
    output_basename: Optional[str] = None,
) -> Optional[str]:
    """
    Load image, detect faces, compute 9:16 crop (or center fallback), resize, grayscale, save.

    Returns:
        Output filename if successful, else None.
    """
    # Load with OpenCV (BGR)
    bgr = cv2.imread(str(image_path))
    if bgr is None:
        return None
    img_h, img_w = bgr.shape[:2]

    faces = detect_faces_cv2(bgr)

    if faces:
        # Minimum bounding box around all faces
        u = union_rect(faces)
        if u:
            x, y, w, h = expand_rect(u[0], u[1], u[2], u[3], padding_factor, img_w, img_h)
            crop_x, crop_y, crop_w, crop_h = make_916_crop_around_rect(
                img_w, img_h, x, y, w, h
            )
        else:
            crop_x, crop_y, crop_w, crop_h = center_crop_916(img_w, img_h)
    else:
        # No face: fallback to center 9:16 crop
        crop_x, crop_y, crop_w, crop_h = center_crop_916(img_w, img_h)

    # Extract crop (with padding if crop extends outside image)
    cropped = extract_region_padded(bgr, crop_x, crop_y, crop_w, crop_h)
    # Resize to target width (9:16)
    target_h = int(output_width * PORTRAIT_H_RATIO / PORTRAIT_W_RATIO)
    resized = cv2.resize(cropped, (output_width, target_h), interpolation=cv2.INTER_LANCZOS4)

    if use_grayscale:
        resized = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

    # Save with PIL for consistent JPEG options
    if use_grayscale:
        pil_image = Image.fromarray(resized, mode="L")
    else:
        resized_rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(resized_rgb, mode="RGB")

    output_dir.mkdir(parents=True, exist_ok=True)
    stem = output_basename if output_basename else image_path.stem
    out_name = stem + ".jpg"
    out_path = output_dir / out_name
    pil_image.save(str(out_path), "JPEG", quality=jpeg_quality, optimize=True)
    return out_name


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Batch process images: 9:16 portrait crop (face-aware), grayscale, consistent size."
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("public/magazine/testimonial-images"),
        help="Input folder of images",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/magazine/NGO_Processed_Images"),
        help="Output folder (NGO_Processed_Images)",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=None,
        help="Output width in pixels (default: 1080 for web, 2160 for --print)",
    )
    parser.add_argument(
        "--print",
        action="store_true",
        help="Use print-friendly resolution (2160px width) so magazine doesn’t lose quality",
    )
    parser.add_argument(
        "--padding",
        type=float,
        default=2.0,
        help="Expand face bbox by this factor for head/shoulders (default: 2.0)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=92,
        help="JPEG quality 1–100 (default: 92)",
    )
    parser.add_argument(
        "--no-grayscale",
        action="store_true",
        help="Keep color; default is grayscale",
    )
    parser.add_argument(
        "--basename-prefix",
        type=str,
        default=None,
        help="Save as {prefix}-01.jpg, {prefix}-02.jpg, ... (order preserved for explicit files)",
    )
    parser.add_argument(
        "--basename-start",
        type=int,
        default=1,
        help="First index when using --basename-prefix (default: 1)",
    )
    parser.add_argument(
        "files",
        nargs="*",
        type=Path,
        help="Optional image paths to process only these files (ignores --input)",
    )
    args = parser.parse_args()

    output_dir = args.output
    output_width = args.width
    if output_width is None:
        output_width = 2160 if args.print else 1080

    if args.files:
        missing = [p for p in args.files if not p.is_file()]
        if missing:
            for p in missing:
                print(f"Error: Not a file: {p}")
            sys.exit(1)
        seen = set()
        image_files = []
        for p in args.files:
            r = p.resolve()
            if r in seen:
                continue
            seen.add(r)
            image_files.append(r)
        source_label = f"{len(image_files)} explicit path(s)"
    else:
        input_dir = args.input
        if not input_dir.is_dir():
            print(f"Error: Input directory not found: {input_dir}")
            sys.exit(1)
        image_files = []
        for ext in SUPPORTED_EXTENSIONS:
            image_files.extend(input_dir.glob(f"*{ext}"))
            image_files.extend(input_dir.glob(f"*{ext.upper()}"))
        image_files = sorted(set(image_files))
        source_label = str(input_dir)

    if not image_files:
        print(f"No images found in {source_label}")
        sys.exit(0)

    print(f"Processing {len(image_files)} image(s) from {source_label}")
    print(f"Output: {output_dir} | {output_width}px width | 9:16 portrait | Grayscale: {not args.no_grayscale}")
    print()

    success = 0
    for index, path in enumerate(image_files, start=args.basename_start):
        out_base = None
        if args.basename_prefix:
            out_base = f"{args.basename_prefix}-{index:02d}"
        out_name = process_image(
            path,
            output_dir,
            output_width=output_width,
            padding_factor=args.padding,
            jpeg_quality=args.quality,
            use_grayscale=not args.no_grayscale,
            output_basename=out_base,
        )
        if out_name:
            print(f"  OK: {path.name} -> {out_name}")
            success += 1
        else:
            print(f"  SKIP (failed to load): {path.name}")

    print()
    print(f"Done. {success}/{len(image_files)} images saved to {output_dir}")


if __name__ == "__main__":
    main()
