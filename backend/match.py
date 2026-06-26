"""
match.py (backend)
Region-Selective + Always Return Best Match
"""

import json
import sys
from pathlib import Path
from typing import List, Dict

import numpy as np
import open_clip
import torch
from PIL import Image

MODEL_NAME = "ViT-L-14"
PRETRAINED = "laion2b_s32b_b82k"

# Lowered significantly — "do it anyway" mode
CONFIDENCE_THRESHOLD = 0.50


class ArtifactMatcher:
    def __init__(self, index_dir="index", device: str = None):
        print("🚀 RUNNING FINAL REGION-SELECTIVE MATCHER")
        self.index_dir = Path(index_dir)

        if device is None:
            if torch.cuda.is_available():
                device = "cuda"
            elif torch.backends.mps.is_available():
                device = "mps"
            else:
                device = "cpu"
        self.device = device

        self.model, _, self.preprocess = open_clip.create_model_and_transforms(
            MODEL_NAME, pretrained=PRETRAINED
        )
        self.model = self.model.to(device).eval()

        self.embeddings = np.load(self.index_dir / "embeddings.npy")
        self.labels: List[str] = json.loads((self.index_dir / "labels.json").read_text())
        self.meta = json.loads((self.index_dir / "meta.json").read_text())

        assert self.embeddings.shape[0] == len(self.labels)

        self._by_label: Dict[str, np.ndarray] = {}
        for i, lab in enumerate(self.labels):
            self._by_label.setdefault(lab, []).append(i)
        self._by_label = {k: np.array(v) for k, v in self._by_label.items()}

    def _get_regions(self, img: Image.Image) -> List[Image.Image]:
        w, h = img.size
        regions = []
        regions.append(img)  # full image

        crop_size = int(min(w, h) * 0.75)
        left = (w - crop_size) // 2
        top = (h - crop_size) // 2
        regions.append(img.crop((left, top, left + crop_size, top + crop_size)))

        regions.append(img.crop((0, 0, w, int(h * 0.65))))   # upper
        regions.append(img.crop((0, int(h * 0.35), w, h)))   # lower
        return regions

    @torch.no_grad()
    def _embed(self, img: Image.Image) -> np.ndarray:
        tensor = self.preprocess(img.convert("RGB")).unsqueeze(0).to(self.device)
        feat = self.model.encode_image(tensor)
        feat = feat / feat.norm(dim=-1, keepdim=True)
        return feat.cpu().numpy().astype(np.float32)[0]

    def _region_selective_embed(self, img: Image.Image) -> np.ndarray:
        regions = self._get_regions(img)
        embeddings = [self._embed(r) for r in regions]
        return np.mean(embeddings, axis=0)

    def match(self, img: Image.Image, top_k: int = 3,
              threshold: float = CONFIDENCE_THRESHOLD) -> Dict:

        q = self._region_selective_embed(img)
        sims = self.embeddings @ q

        per_artifact = []
        for lab, idxs in self._by_label.items():
            best = float(sims[idxs].max())
            per_artifact.append((lab, best))

        per_artifact.sort(key=lambda x: x[1], reverse=True)
        top = per_artifact[:top_k]

        best_id, best_sim = top[0]

        # === "DO IT ANYWAY" MODE ===
        # Always return the best match (even if below threshold)
        return {
            "match": {
                "artifact_id": best_id,
                "confidence": round(best_sim, 4),
            },
            "candidates": [
                {"artifact_id": aid, "confidence": round(s, 4)}
                for aid, s in top
            ],
            "threshold": threshold,
            "recognized": True,                    # Always true now
            "message": None,
        }


def _cli():
    if len(sys.argv) < 2:
        print("Usage: python match.py <image_path>")
        sys.exit(1)
    matcher = ArtifactMatcher()
    img = Image.open(sys.argv[1])
    result = matcher.match(img)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    _cli()