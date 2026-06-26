"""
build_index.py
--------------
Embed every augmented image with OpenCLIP ViT-L/14 (LAION-2B weights)
and save a flat index for nearest-neighbor matching.

We store ALL embeddings per artifact (no centroid averaging) so that
multi-view artifacts and pose variations are properly represented.
At query time we take the MAX cosine similarity across an artifact's
embeddings — much more forgiving than a centroid.

Output:
    index/embeddings.npy        (N, D) float32
    index/labels.json           list of artifact_ids of length N
    index/meta.json             model name, dim, counts
"""

import argparse
import json
from pathlib import Path

import numpy as np
import open_clip
import torch
from PIL import Image
from tqdm import tqdm

IMG_EXTS = {".jpg", ".jpeg", ".png"}

# Better than ViT-B/32 for fine-grained artifact details, still CPU-friendly
MODEL_NAME = "ViT-L-14"
PRETRAINED = "laion2b_s32b_b82k"


def load_model(device: str):
    model, _, preprocess = open_clip.create_model_and_transforms(
        MODEL_NAME, pretrained=PRETRAINED
    )
    model = model.to(device).eval()
    return model, preprocess


@torch.no_grad()
def embed_image(model, preprocess, img_path: Path, device: str) -> np.ndarray:
    img = Image.open(img_path).convert("RGB")
    tensor = preprocess(img).unsqueeze(0).to(device)
    feat = model.encode_image(tensor)
    feat = feat / feat.norm(dim=-1, keepdim=True)  # L2 normalize for cosine sim
    return feat.cpu().numpy().astype(np.float32)[0]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--images", default="dataset/augmented",
                        help="Root containing <ARTIFACT_ID>/*.jpg")
    parser.add_argument("--out", default="index", help="Where to write the index")
    parser.add_argument("--device", default=None,
                        help="cpu | cuda | mps  (auto-detect if omitted)")
    args = parser.parse_args()

    if args.device is None:
        if torch.cuda.is_available():
            device = "cuda"
        elif torch.backends.mps.is_available():
            device = "mps"
        else:
            device = "cpu"
    else:
        device = args.device
    print(f"Using device: {device}")

    print(f"Loading {MODEL_NAME} ({PRETRAINED}) …")
    model, preprocess = load_model(device)

    src = Path(args.images)
    embeddings, labels, sources = [], [], []

    artifact_dirs = sorted([p for p in src.iterdir() if p.is_dir()])

    if artifact_dirs:
        # SUBFOLDER MODE: dataset/images/TAX_L_001/photo.jpg
        for adir in tqdm(artifact_dirs, desc="Embedding"):
            imgs = sorted([p for p in adir.iterdir() if p.suffix.lower() in IMG_EXTS])
            for ip in imgs:
                try:
                    emb = embed_image(model, preprocess, ip, device)
                except Exception as e:
                    print(f"  ! failed {ip}: {e}")
                    continue
                embeddings.append(emb)
                labels.append(adir.name)
                sources.append(str(ip))
    else:
        # FLAT MODE: dataset/images_flat/TAX_L_001.jpeg
        imgs = sorted([p for p in src.iterdir() if p.suffix.lower() in IMG_EXTS])
        if not imgs:
            raise SystemExit(f"No images found in {src}")
        print(f"Flat mode — found {len(imgs)} images")
        for ip in tqdm(imgs, desc="Embedding"):
            # Extract artifact ID by stripping _front/_left/_A/_B etc.
            import re
            art_id = re.sub(r'[_-](front|back|left|right|[A-Ca-c])$', '', ip.stem, flags=re.IGNORECASE)
            try:
                emb = embed_image(model, preprocess, ip, device)
            except Exception as e:
                print(f"  ! failed {ip}: {e}")
                continue
            embeddings.append(emb)
            labels.append(art_id)
            sources.append(str(ip))

    if not embeddings:
        raise SystemExit("No embeddings generated — check your image folder.")
    embeddings = np.stack(embeddings, axis=0)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    np.save(out / "embeddings.npy", embeddings)
    (out / "labels.json").write_text(json.dumps(labels))
    (out / "sources.json").write_text(json.dumps(sources))
    (out / "meta.json").write_text(json.dumps({
        "model": MODEL_NAME,
        "pretrained": PRETRAINED,
        "dim": int(embeddings.shape[1]),
        "num_embeddings": int(embeddings.shape[0]),
        "num_artifacts": len(set(labels)),
    }, indent=2))

    print(f"\n✓ Index built")
    print(f"   embeddings: {embeddings.shape}")
    print(f"   artifacts:  {len(set(labels))}")
    print(f"   saved to:   {out}/")


if __name__ == "__main__":
    main()
