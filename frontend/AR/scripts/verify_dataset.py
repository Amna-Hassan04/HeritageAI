"""
verify_dataset.py
-----------------
Sanity-check BEFORE training. Works with FLAT image layout:

    dataset/images/TAX_L_001.jpeg
    dataset/images/TAX_L_005_front.jpeg
    dataset/images/TAX_L_005_left.jpeg
    ...

The JSON tells us which file belongs to which artifact.

Catches:
  - JSON references an image filename that doesn't exist on disk
  - Image file present on disk but not listed in ANY artifact's JSON entry
  - Artifact with zero images
  - Common case mismatches (.JPEG vs .jpeg, stray whitespace)
  - Artifacts with <2 images (CLIP matching will be weak)

Usage:
    python scripts/verify_dataset.py
"""

import argparse
import sys
from pathlib import Path

# Allow importing api/loader.py
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "api"))
from loader import load_artifacts  # noqa: E402

IMG_EXTS = {".jpg", ".jpeg", ".png"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", default="artifacts.json")
    ap.add_argument("--images", default="data/images",
                    help="Flat folder containing every artifact image")
    ap.add_argument("--min-images", type=int, default=2)
    args = ap.parse_args()

    artifacts = load_artifacts(Path(args.json))
    images_dir = Path(args.images)

    if not images_dir.exists():
        print(f"❌ Images folder does not exist: {images_dir}")
        return 1

    disk_files = {p.name for p in images_dir.iterdir()
                  if p.is_file() and p.suffix.lower() in IMG_EXTS}
    disk_files_lower = {f.lower(): f for f in disk_files}

    # All filenames referenced by any artifact
    referenced = set()
    for a in artifacts.values():
        for f in a["images"]:
            referenced.add(f.strip())

    errors, warnings, ok = [], [], 0

    # 1) Per-artifact checks
    for aid, art in artifacts.items():
        imgs = [f.strip() for f in art["images"]]
        if not imgs:
            errors.append(f"{aid}: no images listed in JSON")
            continue
        if len(imgs) < args.min_images:
            warnings.append(
                f"{aid}: only {len(imgs)} image(s) in JSON "
                f"(recommended ≥ {args.min_images})"
            )

        found_all = True
        for fname in imgs:
            if fname in disk_files:
                continue
            # try case-insensitive
            if fname.lower() in disk_files_lower:
                actual = disk_files_lower[fname.lower()]
                warnings.append(
                    f"{aid}: JSON says '{fname}' — disk has '{actual}' (case mismatch)"
                )
                continue
            errors.append(f"{aid}: '{fname}' not found in {images_dir}/")
            found_all = False
        if found_all and len(imgs) >= args.min_images:
            ok += 1

    # 2) Orphan files on disk (not referenced by any JSON entry)
    referenced_lower = {f.lower() for f in referenced}
    orphans = [f for f in disk_files if f.lower() not in referenced_lower]

    # ---- Report ----
    print(f"\n────── DATASET VERIFICATION ──────")
    print(f"Artifacts in JSON:           {len(artifacts)}")
    print(f"Unique image files on disk:  {len(disk_files)}")
    print(f"Images referenced by JSON:   {len(referenced)}")
    print(f"Fully OK artifacts:          {ok}")
    print(f"Errors:   {len(errors)}")
    print(f"Warnings: {len(warnings)}")
    if orphans:
        print(f"Orphan files (not in JSON):  {len(orphans)}")

    if errors:
        print("\n❌ ERRORS (must fix before training):")
        for e in errors[:50]:
            print(f"   - {e}")
        if len(errors) > 50:
            print(f"   … and {len(errors) - 50} more")

    if warnings:
        print("\n⚠  WARNINGS (review):")
        for w in warnings[:50]:
            print(f"   - {w}")
        if len(warnings) > 50:
            print(f"   … and {len(warnings) - 50} more")

    if orphans:
        print("\nℹ  Orphan files on disk (won't be used for matching):")
        for o in orphans[:20]:
            print(f"   - {o}")
        if len(orphans) > 20:
            print(f"   … and {len(orphans) - 20} more")

    if not errors and not warnings:
        print("\n✓ Dataset is clean. Proceed with augment.py")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
