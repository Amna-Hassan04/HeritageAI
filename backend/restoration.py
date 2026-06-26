"""
restoration.py — minimal, non-destructive artifact photo enhancement.
Goal: make the photo slightly cleaner and crisper without changing
the look. Less is more for already decent museum photos.
"""

import io
import os
import cv2
import json
import numpy as np
from pathlib import Path
from fastapi import HTTPException
from fastapi.responses import StreamingResponse


def restore_artifact_image(image_path: Path) -> io.BytesIO:
    img = cv2.imread(str(image_path))
    if img is None:
        raise ValueError(f"Cannot read image: {image_path}")

    # ── Step 1: Very gentle denoising (low h value = preserve texture) ───────
    img = cv2.fastNlMeansDenoisingColored(
        img, None,
        h=5, hColor=5,
        templateWindowSize=7,
        searchWindowSize=15
    )

    # ── Step 2: CLAHE only on L channel — local contrast, very subtle ────────
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8, 8))
    l = clahe.apply(l)
    img = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)

    # ── Step 3: Mild sharpening kernel ───────────────────────────────────────
    kernel = np.array([
        [ 0, -0.3,  0],
        [-0.3,  2.2, -0.3],
        [ 0, -0.3,  0]
    ])
    img = cv2.filter2D(img, -1, kernel)
    img = np.clip(img, 0, 255).astype(np.uint8)

    # ── Step 4: Resize to max 1200px longest edge for output ─────────────────
    h, w = img.shape[:2]
    longest = max(h, w)
    if longest > 1200:
        scale = 1200 / longest
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_LANCZOS4)

    is_success, buffer = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    if not is_success:
        raise ValueError("Failed to encode image")

    return io.BytesIO(buffer)


def handle_restoration_request(artifact_id: str, json_path: Path, images_dir: Path):
    if not artifact_id or not json_path.exists():
        raise HTTPException(status_code=400, detail="Invalid artifact selection")

    artifacts = json.loads(json_path.read_text(encoding="utf-8"))

    clean_id = str(artifact_id).split(".")[0].strip().upper()
    id_parts = clean_id.split("_")
    base_master_id = (
        f"{id_parts[0]}_{id_parts[1]}_{id_parts[2]}"
        if len(id_parts) >= 3 else clean_id
    )

    matched = next(
        (a for a in artifacts if str(a.get("id")).strip().upper() == base_master_id),
        None
    )

    if not matched:
        raise HTTPException(status_code=404, detail="Artifact not found")

    images_list = matched.get("images", [])
    image_field = matched.get("image")
    filename = None

    if images_list:
        filename = os.path.basename(images_list[0])
    elif image_field:
        filename = os.path.basename(image_field)

    if not filename:
        raise HTTPException(status_code=404, detail="No image found for artifact")

    target_path = images_dir / filename
    if not target_path.exists():
        raise HTTPException(status_code=404, detail=f"Image file missing: {filename}")

    try:
        stream = restore_artifact_image(target_path)
        return StreamingResponse(stream, media_type="image/jpeg")
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Restoration failed: {str(err)}")