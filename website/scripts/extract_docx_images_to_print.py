#!/usr/bin/env python3
"""
Extract embedded images from a .docx at native resolution (raw word/media bytes).
Names files from document text: signature block before the image, else the first
short line after (skipping closings like 'Regards').
"""
from __future__ import annotations

import argparse
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_EMBED = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"


def local(tag: str) -> str:
    if "}" in tag:
        return tag.split("}", 1)[1]
    return tag


def text_of_para(p: ET.Element) -> str:
    parts: list[str] = []
    for t in p.iter():
        if local(t.tag) == "t" and t.text:
            parts.append(t.text)
        if local(t.tag) == "t" and t.tail:
            parts.append(t.tail)
    return "".join(parts).strip()


QUOTE_STARTS = (
    "i ",
    "we ",
    "your ",
    "this ",
    "the ",
    "it ",
    "law park",
    "charulata",
    "charu ",
    "thank",
    "good ",
    "really ",
    "hi ",
    "seeing ",
    "first ",
    "have a ",
    "congratulations",
    "great ",
    "very happy",
    "kudos",
    "amazing",
    "i am",
    "i think",
    "i just",
    "i'm ",
)


def looks_like_body_not_name(t: str) -> bool:
    s = t.strip().lower()
    if len(s) > 85:
        return True
    for p in QUOTE_STARTS:
        if s.startswith(p):
            return True
    return False


def is_closing_or_header(t: str) -> bool:
    s = t.strip().lower().rstrip(".,")
    if not s:
        return True
    closings = (
        "regards",
        "warm regards",
        "best wishes",
        "thanks",
        "thank you",
        "with best regards",
        "sincerely",
        "yours truly",
        "cheers",
        "best regards",
    )
    if s in closings:
        return True
    if s.startswith("best wishes") and len(s) < 30:
        return True
    if "csr initiative" in s:
        return True
    if "law park educational trust!!" in s:
        return True
    return False


def slugify(s: str, max_len: int = 80) -> str:
    s = s.strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r'[<>:"/\\|?*]', "", s)
    s = s.replace(" ", "-")
    s = re.sub(r"-+", "-", s).strip("-")
    if len(s) > max_len:
        s = s[:max_len].rstrip("-")
    return s or "image"


def block_before(paras: list, i: int) -> list[str]:
    rev: list[str] = []
    j = i - 1
    while j >= 0:
        t = paras[j][0]
        if not t:
            if rev:
                break
            j -= 1
            continue
        if len(t) > 120:
            break
        rev.append(t)
        j -= 1
    return list(reversed(rev))


def pick_from_block(block: list[str]) -> tuple[str | None, str]:
    for line in block:
        if is_closing_or_header(line):
            continue
        if looks_like_body_not_name(line):
            continue
        return line, "before-block"
    for line in block:
        if not is_closing_or_header(line):
            return line, "before-block-fallback"
    if block:
        return block[0], "before-block-last"
    return None, "none"


def name_from_after(paras: list, i: int) -> tuple[str | None, str]:
    for j in range(i + 1, min(i + 10, len(paras))):
        t = paras[j][0]
        if not t:
            continue
        if len(t) > 120 or looks_like_body_not_name(t):
            continue
        if is_closing_or_header(t):
            continue
        return t, "after"
    return None, "none"


def pick_basename(paras: list, i: int) -> tuple[str, str]:
    block = block_before(paras, i)
    name, source = pick_from_block(block)
    if name:
        return name, source
    na, s2 = name_from_after(paras, i)
    if na:
        return na, s2
    if block:
        return block[0], "before-raw-fallback"
    return "testimonial", "none"


def extract(docx_path: Path, out_dir: Path) -> list[dict]:
    out_dir.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(docx_path, "r") as z:
        rels_xml = z.read("word/_rels/document.xml.rels")
        doc_xml = z.read("word/document.xml")

    rid_to_target: dict[str, str] = {}
    for rel in ET.fromstring(rels_xml):
        if rel.tag.endswith("Relationship"):
            tid = rel.get("Id")
            tgt = rel.get("Target", "")
            if tid and tgt.startswith("media/"):
                rid_to_target[tid] = tgt.replace("\\", "/")

    root = ET.fromstring(doc_xml)
    body = root.find(f".//{{{NS_W}}}body")
    if body is None:
        raise SystemExit("No document body in docx")

    paras: list[list] = []
    embed_paras: list[tuple[int, list[str]]] = []
    for child in body:
        if local(child.tag) != "p":
            continue
        txt = text_of_para(child)
        embeds: list[str] = []
        for blip in child.iter():
            if local(blip.tag) == "blip":
                e = blip.get(R_EMBED)
                if e:
                    embeds.append(e)
        paras.append([txt, embeds])
        if embeds:
            embed_paras.append((len(paras) - 1, embeds))

    manifest: list[dict] = []
    used: dict[str, bool] = {}

    with zipfile.ZipFile(docx_path, "r") as z:
        for pi, embeds in embed_paras:
            for rid in embeds:
                target = rid_to_target.get(rid)
                if not target:
                    continue
                inner = target.split("/")[-1]
                ext = Path(inner).suffix.lower() or ".jpeg"
                raw_name, source = pick_basename(paras, pi)
                base = slugify(raw_name)
                key = base.lower()
                n = 2
                while key in used:
                    base = slugify(raw_name) + f"-{n}"
                    key = base.lower()
                    n += 1
                used[key] = True
                dest = out_dir / f"{base}{ext}"
                data = z.read(f"word/{target}")
                dest.write_bytes(data)
                manifest.append(
                    {
                        "file": dest.name,
                        "source_paragraph_index": pi,
                        "relationship_id": rid,
                        "docx_media": target,
                        "name_source": source,
                        "label_from_doc": raw_name[:200],
                        "bytes": len(data),
                    }
                )

    meta_path = out_dir / "extraction-manifest.json"
    meta_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract docx images to print folder with doc-based names.")
    parser.add_argument("docx", type=Path, help="Path to .docx")
    parser.add_argument(
        "-o",
        "--out",
        type=Path,
        help="Output directory (default: <docx_parent>/print)",
    )
    args = parser.parse_args()
    docx_path = args.docx.resolve()
    out = args.out.resolve() if args.out else docx_path.parent / "print"
    extract(docx_path, out)
    print(f"Wrote images and {out / 'extraction-manifest.json'}")


if __name__ == "__main__":
    main()
