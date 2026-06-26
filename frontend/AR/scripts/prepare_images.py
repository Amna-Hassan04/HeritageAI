"""
prepare_images.py
=================
Copies one representative image per artifact from
  dataset/images/<artifact_id>/
into
  dataset/images_flat/<artifact_id_filename>

This flat folder is served by FastAPI at  /images/<filename>
so the frontend can display artifact thumbnails.

Run once after adding new artifacts:
  python scripts/prepare_images.py
"""

import shutil
from pathlib import Path

ROOT     = Path(__file__).parent.parent
SRC_DIR  = ROOT / "dataset" / "images"
DST_DIR  = ROOT / "dataset" / "images_flat"
DST_DIR.mkdir(parents=True, exist_ok=True)

copied = 0
for art_dir in sorted(SRC_DIR.iterdir()):
    if not art_dir.is_dir():
        continue
    files = sorted([
        p for p in art_dir.iterdir()
        if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")
    ])
    if not files:
        print(f"  [skip] {art_dir.name} — no images")
        continue

    # Use the first image as the representative thumbnail
    src = files[0]
    dst = DST_DIR / src.name
    shutil.copy2(src, dst)
    print(f"  ✓  {art_dir.name} → {src.name}")
    copied += 1

print(f"\n✅  {copied} images copied to {DST_DIR}")
print("These are served at /images/<filename> by the API server.")