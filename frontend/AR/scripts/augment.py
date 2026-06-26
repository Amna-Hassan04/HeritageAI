"""
augment.py
----------
Reads artifacts.json to figure out which flat-folder images belong to which
artifact, then expands 2–5 source images per artifact into ~20–50 augmented
variants that simulate real phone-camera conditions.

Source layout (flat):
    dataset/images/TAX_L_001.jpeg
    dataset/images/TAX_L_005_front.jpeg
    dataset/images/TAX_L_005_left.jpeg
    ...

Output (organized by artifact id, used by build_index.py):
    dataset/augmented/TAX_L_001/<src_stem>_aug00.jpg
    dataset/augmented/TAX_L_005/TAX_L_005_front_aug00.jpg
    dataset/augmented/TAX_L_005/TAX_L_005_left_aug00.jpg
    ...

Augmentations mimic phone-camera realism:
  - ±15° rotation (no flips — artifacts have canonical orientation)
  - Perspective warp (user standing off-angle)
  - Brightness/contrast (museum lighting varies)
  - Mild motion blur (handheld camera)
  - Small zoom crop (user not perfectly framing)
"""

import argparse
import shutil
import sys
from pathlib import Path

import albumentations as A
import cv2
from tqdm import tqdm

# Import the smart JSON loader
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "api"))
from loader import load_artifacts  # noqa: E402

AUG = A.Compose([
    A.Rotate(limit=15, border_mode=cv2.BORDER_REPLICATE, p=0.9),
    A.Perspective(scale=(0.02, 0.06), p=0.6),
    A.RandomBrightnessContrast(brightness_limit=0.25, contrast_limit=0.2, p=0.8),
    A.HueSaturationValue(hue_shift_limit=5, sat_shift_limit=15, val_shift_limit=10, p=0.5),
    A.MotionBlur(blur_limit=5, p=0.3),
    A.GaussNoise(p=0.3),
    A.RandomResizedCrop(size=(512, 512), scale=(0.75, 1.0), ratio=(0.9, 1.1), p=1.0),

])


def resolve_image_path(images_dir: Path, fname: str) -> Path | None:
    """Find the actual file on disk, tolerating whitespace + case differences."""
    fname = fname.strip()
    p = images_dir / fname
    if p.exists():
        return p
    # case-insensitive fallback
    lc = fname.lower()
    for cand in images_dir.iterdir():
        if cand.name.lower() == lc:
            return cand
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", default="dataset/artifacts.json")
    ap.add_argument("--images", default="dataset/images",
                    help="Flat folder containing all artifact images")
    ap.add_argument("--out", default="dataset/augmented",
                    help="Where augmented images get written, grouped by id")
    ap.add_argument("--per-image", type=int, default=10,
                    help="Augmented variants per source image (default: 10)")
    ap.add_argument("--keep-original", action="store_true",
                    help="Also copy the original into the output folder")
    ap.add_argument("--clean", action="store_true",
                    help="Wipe output dir before writing")
    args = ap.parse_args()

    artifacts = load_artifacts(Path(args.json))
    images_dir = Path(args.images)
    out_root = Path(args.out)

    if args.clean and out_root.exists():
        shutil.rmtree(out_root)
    out_root.mkdir(parents=True, exist_ok=True)

    total_src, total_out, missing = 0, 0, 0

    for aid, art in tqdm(artifacts.items(), desc="Artifacts"):
        out_dir = out_root / aid
        out_dir.mkdir(parents=True, exist_ok=True)

        for fname in art["images"]:
            src = resolve_image_path(images_dir, fname)
            if src is None:
                missing += 1
                print(f"  ! {aid}: missing image {fname!r}")
                continue

            img = cv2.imread(str(src))
            if img is None:
                missing += 1
                print(f"  ! could not read {src}")
                continue
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            total_src += 1
            stem = Path(fname).stem.strip()

            if args.keep_original:
                cv2.imwrite(
                    str(out_dir / f"{stem}_orig.jpg"),
                    cv2.cvtColor(img, cv2.COLOR_RGB2BGR),
                )
                total_out += 1

            for j in range(args.per_image):
                aug = AUG(image=img)["image"]
                cv2.imwrite(
                    str(out_dir / f"{stem}_aug{j:02d}.jpg"),
                    cv2.cvtColor(aug, cv2.COLOR_RGB2BGR),
                )
                total_out += 1

    print(f"\n✓ Done.")
    print(f"   Source images used:  {total_src}")
    print(f"   Missing references:  {missing}")
    print(f"   Augmented images:    {total_out}")
    print(f"   Output:              {out_root}")


if __name__ == "__main__":
    main()
