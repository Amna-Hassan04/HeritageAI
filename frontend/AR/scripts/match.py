"""
match.py
--------
Standalone matcher used by both the CLI test and the FastAPI server.
Loads the index once, then `match(image)` returns the top-K artifacts
with confidence scores and an "unknown" fallback.

CLI usage:
    python scripts/match.py path/to/query.jpg
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

# Tune on your validation set. Cosine sims for CLIP image-image typically
# land in 0.55–0.95 for true matches. Below this we say "unknown".
CONFIDENCE_THRESHOLD = 0.75


class ArtifactMatcher:
    def __init__(self, index_dir="index", device: str = None):
        self.index_dir = Path(index_dir)

        if device is None:
            if torch.cuda.is_available():
                device = "cuda"
            elif torch.backends.mps.is_available():
                device = "mps"
            else:
                device = "cpu"
        self.device = device

        # Load model
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(
            MODEL_NAME, pretrained=PRETRAINED
        )
        self.model = self.model.to(device).eval()

        # Load index
        self.embeddings = np.load(self.index_dir / "embeddings.npy")  # (N, D)
        self.labels: List[str] = json.loads((self.index_dir / "labels.json").read_text())
        self.meta = json.loads((self.index_dir / "meta.json").read_text())
        assert self.embeddings.shape[0] == len(self.labels)

        # Pre-index: for each artifact, which rows belong to it
        self._by_label: Dict[str, np.ndarray] = {}
        for i, lab in enumerate(self.labels):
            self._by_label.setdefault(lab, []).append(i)
        self._by_label = {k: np.array(v) for k, v in self._by_label.items()}

    @torch.no_grad()
    def _embed(self, img: Image.Image) -> np.ndarray:
        tensor = self.preprocess(img.convert("RGB")).unsqueeze(0).to(self.device)
        feat = self.model.encode_image(tensor)
        feat = feat / feat.norm(dim=-1, keepdim=True)
        return feat.cpu().numpy().astype(np.float32)[0]

    def match(self, img: Image.Image, top_k: int = 3,
              threshold: float = CONFIDENCE_THRESHOLD) -> Dict:
        q = self._embed(img)                            # (D,)
        sims = self.embeddings @ q                      # (N,)  cosine since L2-normed

        # Best similarity per artifact (MAX, not mean — handles multi-view)
        per_artifact = []
        for lab, idxs in self._by_label.items():
            best = float(sims[idxs].max())
            per_artifact.append((lab, best))
        per_artifact.sort(key=lambda x: x[1], reverse=True)

        top = per_artifact[:top_k]
        best_id, best_sim = top[0]
        is_match = best_sim >= threshold

        return {
            "match": {
                "artifact_id": best_id,
                "confidence": round(best_sim, 4),
            } if is_match else None,
            "candidates": [
                {"artifact_id": aid, "confidence": round(s, 4)}
                for aid, s in top
            ],
            "threshold": threshold,
            "recognized": is_match,
            "message": None if is_match else
                       "No confident match. Try moving closer or improving lighting.",
        }


def _cli():
    if len(sys.argv) < 2:
        print("Usage: python scripts/match.py <image_path>")
        sys.exit(1)
    matcher = ArtifactMatcher()
    img = Image.open(sys.argv[1])
    result = matcher.match(img)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    _cli()
