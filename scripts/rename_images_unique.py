#!/usr/bin/env python3
"""
Rename image files in a directory with unique, URL-friendly names.

Usage:
  python scripts/rename_images_unique.py [directory] [--prefix PREFIX] [--dry-run] [--copy-to DIR]

Examples:
  python scripts/rename_images_unique.py assets/
  python scripts/rename_images_unique.py "public/images/Magazine photos" --prefix gallery_
  python scripts/rename_images_unique.py assets/ --copy-to public/images --dry-run
"""

import argparse
import re
import shutil
from pathlib import Path


# Extensions treated as images (lowercase)
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".heic"}


def sanitize_basename(name: str) -> str:
    """Replace spaces and awkward chars with a single hyphen."""
    name = re.sub(r"[\s_]+", "-", name)
    name = re.sub(r"[^\w\-.]", "", name)
    return name.strip(".-") or "image"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Rename image files with unique names (e.g. prefix_001.ext)."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default="assets",
        help="Directory containing images to rename (default: assets)",
    )
    parser.add_argument(
        "--prefix",
        default="img",
        help="Prefix for new filenames (default: img) -> img_001, img_002, ...",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only print renames, do not change files",
    )
    parser.add_argument(
        "--copy-to",
        metavar="DIR",
        help="Copy renamed files to this directory instead of renaming in place",
    )
    parser.add_argument(
        "--ext",
        default=None,
        help="Force output extension (e.g. .jpg). If not set, keep original extension.",
    )
    args = parser.parse_args()

    root = Path(args.directory)
    if not root.is_dir():
        print(f"Error: not a directory: {root}")
        return

    # Collect image files (recursive by default for assets)
    files: list[Path] = []
    for ext in IMAGE_EXTENSIONS:
        files.extend(root.rglob(f"*{ext}"))
    files.sort(key=lambda p: (p.parent, p.name))

    if not files:
        print(f"No image files found in {root}")
        return

    out_dir: Path | None = None
    if args.copy_to:
        out_dir = Path(args.copy_to)
        out_dir.mkdir(parents=True, exist_ok=True)

    used_names: set[str] = set()
    max_num = len(files)
    pad = len(str(max_num))

    for i, path in enumerate(files, start=1):
        ext = args.ext or path.suffix.lower()
        if not ext.startswith("."):
            ext = "." + ext
        new_name = f"{args.prefix}_{i:0{pad}}{ext}"
        if out_dir:
            dest = out_dir / new_name
        else:
            dest = path.parent / new_name

        while dest.name in used_names:
            i += 1
            new_name = f"{args.prefix}_{i:0{pad}}{ext}"
            dest = (out_dir or path.parent) / new_name
        used_names.add(dest.name)

        if args.dry_run:
            if out_dir:
                print(f"  {path}  ->  {dest}")
            else:
                print(f"  {path.name}  ->  {new_name}")
        else:
            if out_dir:
                shutil.copy2(path, dest)
                print(f"Copied: {path} -> {dest}")
            else:
                if path.resolve() != dest.resolve():
                    path.rename(dest)
                    print(f"Renamed: {path.name} -> {new_name}")

    print(f"\nTotal: {len(files)} file(s)" + (" (dry run)" if args.dry_run else ""))


if __name__ == "__main__":
    main()
