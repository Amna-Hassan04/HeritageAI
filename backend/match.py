import json
import sys
from pathlib import Path
from typing import List, Dict, Optional, Tuple

import numpy as np
import open_clip
import torch
from PIL import Image

# Configuration
MODEL_NAME = "ViT-B-32" # Changed to B-32: Much lighter than L-14, fits in 512MB RAM
PRETRAINED = "laion2b_s34b_b79k"
CONFIDENCE_THRESHOLD = 0.50

class ArtifactMatcher:
    def __init__(self, index_dir="index", device: str = None):
        print("🚀 INITIALIZING ARTIFACT MATCHER (Lazy Loading)")
        self.index_dir = Path(index_dir)

        # Determine device
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
        else:
            self.device = device

        # Load metadata only (Keep the model and embeddings out of memory until needed)
        self.labels: List[str] = json.loads((self.index_dir / "labels.json").read_text())
        self.meta = json.loads((self.index_dir / "meta.json").read_text())

        # Prepare lookup dictionary
        self._by_label: Dict[str, List[int]] = {}
        for i, lab in enumerate(self.labels):
            self._by_label.setdefault(lab, []).append(i)

        # Model placeholders
        self._model = None
        self._preprocess = None
        self._embeddings = None

    def _load_resources(self):
        """Lazy load heavy resources only when a match is requested."""
        if self._model is None:
            print("📦 Loading CLIP Model and Embeddings into RAM...")
            # Use the lighter ViT-B-32 model
            self._model, _, self._preprocess = open_clip.create_model_and_transforms(
                MODEL_NAME, pretrained=PRETRAINED
            )
            self._model = self._model.to(self.device).eval()
            self._embeddings = np.load(self.index_dir / "embeddings.npy")
            print("✅ Resources Loaded")

    def _get_regions(self, img: Image.Image) -> List[Image.Image]:
        w, h = img.size
        regions = [img]
        # Only perform necessary crops
        crop_size = int(min(w, h) * 0.75)
        regions.append(img.crop(((w-crop_size)//2, (h-crop_size)//2, (w+crop_size)//2, (h+crop_size)//2)))
        return regions

    @torch.no_grad()
    def _embed(self, img: Image.Image) -> np.ndarray:
        tensor = self._preprocess(img.convert("RGB")).unsqueeze(0).to(self.device)
        feat = self._model.encode_image(tensor)
        feat = feat / feat.norm(dim=-1, keepdim=True)
        return feat.cpu().numpy().astype(np.float32)[0]

    def match(self, img: Image.Image, top_k: int = 3) -> Dict:
        # Load resources just-in-time
        self._load_resources()

        regions = self._get_regions(img)
        # Compute mean embedding of regions
        q = np.mean([self._embed(r) for r in regions], axis=0)

        # Compute similarity
        sims = self._embeddings @ q

        per_artifact = []
        for lab, idxs in self._by_label.items():
            best = float(sims[idxs].max())
            per_artifact.append((lab, best))

        per_artifact.sort(key=lambda x: x[1], reverse=True)
        top = per_artifact[:top_k]
        best_id, best_sim = top[0]

        return {
            "match": {
                "artifact_id": best_id,
                "confidence": round(best_sim, 4),
            },
            "candidates": [
                {"artifact_id": aid, "confidence": round(s, 4)}
                for aid, s in top
            ],
            "recognized": True,
            "message": None,
        }

    def __del__(self):
        """Cleanup memory on shutdown."""
        if self._model is not None:
            del self._model
            del self._embeddings
            if self.device == "cuda":
                torch.cuda.empty_cache()

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