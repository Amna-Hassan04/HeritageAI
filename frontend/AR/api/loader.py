"""
api/loader.py
-------------
Loads artifacts.json and TRANSPARENTLY handles two formats:

  Format A (your original):       multiple records share the same id,
                                  each with a single `image` field.
  Format B (after fix_json.py):   one record per id with an `images` list.

Either way, this returns a dict keyed by id, with `images: [...]` always
populated. No need to edit your JSON file.
"""

import json
from collections import OrderedDict
from pathlib import Path
from typing import Dict, List


def _normalize_images(rec: dict) -> List[str]:
    img = rec.get("images") or rec.get("image")
    if isinstance(img, str):
        return [img]
    if isinstance(img, list):
        return list(img)
    return []


def load_artifacts(path: Path) -> Dict[str, dict]:
    """
    Returns: {artifact_id: {id, title, section, images:[...], story, extra}}
    Duplicate ids in the source are merged: images concatenated, longest
    title/story preferred.
    """
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise ValueError(f"{path} must be a JSON list")

    out: "OrderedDict[str, dict]" = OrderedDict()

    for rec in raw:
        aid = rec["id"]
        imgs = _normalize_images(rec)

        if aid not in out:
            out[aid] = {
                "id": aid,
                "title": (rec.get("title") or "").strip(),
                "section": rec.get("section", ""),
                "images": imgs,
                "story": (rec.get("story") or "").strip(),
                "extra": rec.get("extra", {}),
            }
        else:
            cur = out[aid]
            for im in imgs:
                if im not in cur["images"]:
                    cur["images"].append(im)
            # Keep the longer/richer text if duplicates differ
            if len(rec.get("story", "")) > len(cur["story"]):
                cur["story"] = rec["story"].strip()
            if len(rec.get("title", "")) > len(cur["title"]):
                cur["title"] = rec["title"].strip()
            # Fill in any missing extra fields
            for k, v in (rec.get("extra") or {}).items():
                cur["extra"].setdefault(k, v)

    return out
