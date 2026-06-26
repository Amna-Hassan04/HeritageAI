"""
evaluate.py
-----------
Holds out one ORIGINAL image per artifact (picked from the flat images folder
via artifacts.json), embeds it, and checks whether the matcher returns the
correct artifact id.

Run AFTER build_index.py.

Usage:
    python scripts/evaluate.py
"""

import argparse
import random
import sys
import statistics
from pathlib import Path

from PIL import Image
from tqdm import tqdm

# Import matcher and loader
sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "api"))
from frontend.AR.scripts.match import ArtifactMatcher          # noqa: E402
from loader import load_artifacts          # noqa: E402


def resolve_image_path(images_dir: Path, fname: str):
    fname = fname.strip()
    p = images_dir / fname
    if p.exists():
        return p
    lc = fname.lower()
    for cand in images_dir.iterdir():
        if cand.name.lower() == lc:
            return cand
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", default="artifacts.json")
    ap.add_argument("--images", default="dataset/images",
                    help="Flat folder of original images")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    random.seed(args.seed)
    matcher = ArtifactMatcher()
    artifacts = load_artifacts(Path(args.json))
    images_dir = Path(args.images)

    top1, top3, total = 0, 0, 0
    confidences = []
    failures = []

    for aid, art in tqdm(artifacts.items(), desc="Evaluating"):
        # Pick one image at random for this artifact
        candidate_files = [f for f in art["images"]
                           if resolve_image_path(images_dir, f) is not None]
        if not candidate_files:
            continue
        query_name = random.choice(candidate_files)
        query_path = resolve_image_path(images_dir, query_name)

        img = Image.open(query_path)
        result = matcher.match(img, top_k=3, threshold=0.0)

        cand_ids = [c["artifact_id"] for c in result["candidates"]]
        total += 1
        if cand_ids[0] == aid:
            top1 += 1
        if aid in cand_ids:
            top3 += 1
        else:
            failures.append({
                "true": aid,
                "predicted": cand_ids,
                "confidences": [c["confidence"] for c in result["candidates"]],
                "query": str(query_path.name),
            })
        confidences.append(result["candidates"][0]["confidence"])

    print("\n──────── RESULTS ────────")
    print(f"Top-1 accuracy: {top1}/{total} = {100*top1/total:.1f}%")
    print(f"Top-3 accuracy: {top3}/{total} = {100*top3/total:.1f}%")
    if confidences:
        print(f"Mean top-1 confidence: {statistics.mean(confidences):.3f}")
        print(f"Min  top-1 confidence: {min(confidences):.3f}")
        print(f"Max  top-1 confidence: {max(confidences):.3f}")
    if failures:
        print(f"\n{len(failures)} failures (true id not in top-3):")
        for f in failures[:15]:
            print(f"  - true={f['true']:12s} pred={f['predicted']} "
                  f"conf={[round(c,2) for c in f['confidences']]} query={f['query']}")
    print("\nTip: set CONFIDENCE_THRESHOLD in match.py just BELOW")
    print("     your min true-match confidence (e.g. min × 0.95).")


if __name__ == "__main__":
    main()
