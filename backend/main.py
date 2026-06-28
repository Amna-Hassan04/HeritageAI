import io
import json
import sys
import os
import uvicorn
import datetime
from pathlib import Path
from typing import Optional
import base64
import cv2
import torch
import urllib.request
import urllib.parse
import httpx
import asyncio
from io import BytesIO

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from PIL import Image

from restoration import handle_restoration_request
from curator.gemini_client import run_gemini
from curator.curator_logic import curate
from curator.prompts import CURATOR_PROMPT
from planner_router import router as planner_router # Fixed import

# ── 1. Create App and Assign Middleware First ─────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Starting FastAPI server...")

# ── 2. Setup Directories and Globals ──────────────────────────────────────────
BASE_DIR = Path(__file__).parent.parent
AR_ROOT  = BASE_DIR / "frontend" / "AR"

INDEX_DIR      = AR_ROOT / "index"
FRONTEND       = AR_ROOT
IMAGES_DIR     = AR_ROOT / "dataset" / "images_flat"
JSON_PATH      = AR_ROOT / "dataset" / "artifacts.json"
FEEDBACK_LOG   = AR_ROOT / "dataset" / "feedback.jsonl"

ILLUSTRATE_CACHE = AR_ROOT / "dataset" / "illustrate_cache"
ILLUSTRATE_CACHE.mkdir(parents=True, exist_ok=True)

VISUALIZE_CACHE = AR_ROOT / "dataset" / "visualize_cache"
VISUALIZE_CACHE.mkdir(parents=True, exist_ok=True)

# ── 3. Initialize AI Models (Gemini & MiDaS) ──────────────────────────────────
GEMINI_ENABLED = False
gemini_model   = None
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model   = genai.GenerativeModel("gemini-2.0-flash")
        GEMINI_ENABLED = True
        print("✅ Gemini enabled")
    except Exception as e:
        print(f"⚠️  Gemini setup failed: {e}")

MIDAS_LOADED = False
midas_model = None
midas_transform = None

def load_midas():
    global MIDAS_LOADED, midas_model, midas_transform
    if MIDAS_LOADED:
        return
    try:
        print("Loading MiDaS depth model...")
        midas_model = torch.hub.load("intel-isl/MiDaS", "MiDaS_small", trust_repo=True)
        midas_model.eval()
        midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms", trust_repo=True)
        midas_transform = midas_transforms.small_transform
        MIDAS_LOADED = True
        print("✅ MiDaS loaded")
    except Exception as e:
        print(f"❌ MiDaS failed to load: {e}")

try:
    from match import ArtifactMatcher
    ar_matcher = ArtifactMatcher(index_dir=str(INDEX_DIR))
    print("✅ AR Matcher loaded")
except Exception as e:
    print(f"❌ AR Matcher failed: {e}")
    ar_matcher = None

# ── 4. Helper Functions ───────────────────────────────────────────────────────
def resolve_master_artifact(artifact_id: str, json_path: Path):
    if not artifact_id or not json_path.exists():
        return None
    artifacts = json.loads(json_path.read_text(encoding="utf-8"))
    clean_id = str(artifact_id).split(".")[0].strip().upper()
    id_parts = clean_id.split("_")
    base_master_id = f"{id_parts[0]}_{id_parts[1]}_{id_parts[2]}" if len(id_parts) >= 3 else clean_id
    return next((a for a in artifacts if str(a.get("id")).strip().upper() == base_master_id), None)

ARTIFACT_CHECK_PROMPT = (
    "Look at this image carefully. "
    "Is the main subject a museum artifact, ancient sculpture, "
    "historical object, pottery, coin, relic, or archaeological find? "
    "Reply with ONLY one word: YES or NO."
)

def gemini_is_artifact(image_bytes: bytes) -> Optional[bool]:
    if not GEMINI_ENABLED or gemini_model is None:
        return None
    try:
        response = gemini_model.generate_content([
            ARTIFACT_CHECK_PROMPT,
            {"mime_type": "image/jpeg", "data": image_bytes},
        ])
        answer = (getattr(response, "text", "") or "").strip().upper()
        if "YES" in answer: return True
        if "NO"  in answer: return False
        return None
    except Exception as e:
        print(f"⚠️  Gemini artifact check failed: {e}")
        return None

def normalize_uploaded_image(pil_img: Image.Image, target_w=1280, target_h=720) -> Image.Image:
    w, h = pil_img.size
    target_aspect = target_w / target_h
    current_aspect = w / h

    if current_aspect > target_aspect:
        new_width = int(h * target_aspect)
        left = (w - new_width) // 2
        right = left + new_width
        top = 0
        bottom = h
    else:
        new_height = int(w / target_aspect)
        top = (h - new_height) // 2
        bottom = top + new_height
        left = 0
        right = w

    cropped_img = pil_img.crop((left, top, right, bottom))
    return cropped_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

class FeedbackPayload(BaseModel):
    predicted_id: str
    correct_id:   Optional[str] = None
    confidence:   float
    confirmed:    bool

# ── 5. Static Mounts ──────────────────────────────────────────────────────────
if IMAGES_DIR.exists():
    app.mount("/ar/images", StaticFiles(directory=str(IMAGES_DIR)), name="ar-images")

if FRONTEND.exists():
    app.mount("/ar/static", StaticFiles(directory=str(FRONTEND)), name="ar-static")

# ── 6. Routes ─────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok", "service": "AI Museum Curator API"}

@app.post("/curate")
async def curate_image(image: UploadFile = File(...)):
    print("🔥 BACKEND RECEIVED:", image.filename)
    image_bytes = await image.read()

    raw_output = run_gemini(image_bytes, CURATOR_PROMPT)
    result = curate(image_bytes, raw_output)

    try:
        if hasattr(result, 'model_dump'):
            result_dict = result.model_dump()
        elif hasattr(result, 'dict'):
            result_dict = result.dict()
        else:
            result_dict = result
        return result_dict
    except Exception as e:
        print("❌ Error converting result:", e)
        raise

@app.get("/ar")
def ar_frontend():
    index = FRONTEND / "demo.html"
    if index.exists():
        return FileResponse(str(index))
    return {"message": "AR frontend not found. Place demo.html in AR/frontend/"}

@app.post("/ar/restore")
async def ar_restore(payload: dict):
    return handle_restoration_request(
        artifact_id=payload.get("artifact_id"),
        json_path=JSON_PATH,
        images_dir=IMAGES_DIR
    )

@app.get("/ar/health")
def ar_health():
    return {
        "status":         "ok",
        "matcher_loaded": ar_matcher is not None,
        "gemini_enabled": GEMINI_ENABLED,
        "timestamp":      datetime.datetime.utcnow().isoformat(),
    }

@app.get("/ar/artifacts")
def ar_artifacts():
    if not JSON_PATH.exists():
        raise HTTPException(status_code=404, detail="artifacts.json not found")
    return json.loads(JSON_PATH.read_text(encoding="utf-8"))

@app.post("/ar/match")
async def ar_match(file: UploadFile = File(...), top_k: int = 3):
    if ar_matcher is None:
        raise HTTPException(status_code=503, detail="AR matcher not loaded")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()
    raw_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = normalize_uploaded_image(raw_img, target_w=1280, target_h=720)

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    normalized_bytes = buffer.getvalue()

    gemini_result = gemini_is_artifact(normalized_bytes)
    used_fallback = False

    if gemini_result is False:
        return {
            "recognized":  False,
            "gate":        "gemini",
            "message":     "This doesn't appear to be a museum artifact. Please point the camera at an exhibit.",
            "candidates":  [],
            "meta":        {},
        }

    if gemini_result is None:
        used_fallback = True

    try:
        result = ar_matcher.match(img, top_k=top_k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    best_confidence = 0.0
    if result.get("candidates"):
        best_confidence = result["candidates"][0]["confidence"]

    if used_fallback and best_confidence < 0.50:
        return {
            "recognized": False,
            "gate": "clip_threshold",
            "message": "Could not confidently identify this as a museum artifact.",
            "candidates": result.get("candidates", []),
            "meta": {},
        }

    artifact_id = None
    if result.get("match"):
        artifact_id = result["match"]["artifact_id"]
    elif result.get("candidates"):
        artifact_id = result["candidates"][0]["artifact_id"]

    meta = {}
    if artifact_id and JSON_PATH.exists():
        try:
            artifacts = json.loads(JSON_PATH.read_text(encoding="utf-8"))
            clean_matched_id = str(artifact_id).split(".")[0].strip().upper()

            id_parts = clean_matched_id.split("_")
            if len(id_parts) >= 3:
                base_master_id = f"{id_parts[0]}_{id_parts[1]}_{id_parts[2]}"
            else:
                base_master_id = clean_matched_id

            matched_item = next(
                (a for a in artifacts if str(a.get("id")).strip().upper() == base_master_id),
                None
            )

            if matched_item:
                meta = {
                    "title": matched_item.get("title", "Unknown Artifact"),
                    "section": matched_item.get("section", ""),
                    "story": matched_item.get("story", "No description available."),
                    "titleUr": matched_item.get("titleUr"),
                    "sectionUr": matched_item.get("sectionUr"),
                    "storyUr": matched_item.get("storyUr"),
                    "image": os.path.basename(matched_item.get("image")) if matched_item.get("image") else (os.path.basename(matched_item.get("images")[0]) if matched_item.get("images") else None),
                    "extra": matched_item.get("extra", {
                        "material": matched_item.get("material"),
                        "origin": matched_item.get("origin"),
                        "date": matched_item.get("date"),
                        "religion": matched_item.get("religion"),
                        "materialUr": matched_item.get("materialUr"),
                        "originUr": matched_item.get("originUr"),
                        "dateUr": matched_item.get("dateUr"),
                        "religionUr": matched_item.get("religionUr"),
                    })
                }
        except Exception as json_err:
            print(f"❌ Metadata cross-referencing failed: {json_err}")

    return {
        "recognized":    result.get("recognized", True),
        "gate":          "gemini" if not used_fallback else "clip_threshold",
        "used_fallback": used_fallback,
        "match":         result.get("match"),
        "candidates":    result.get("candidates", []),
        "meta":          meta,
        "message":       result.get("message"),
    }

@app.post("/ar/depth")
async def ar_depth(payload: dict):
    artifact_id = payload.get("artifact_id")
    if not artifact_id:
        raise HTTPException(status_code=400, detail="artifact_id is required")

    matched = resolve_master_artifact(artifact_id, JSON_PATH)
    if not matched:
        raise HTTPException(status_code=404, detail="Artifact not found")

    master_id = str(matched.get("id"))
    depth_cache = AR_ROOT / "dataset" / "depth_cache"
    depth_cache.mkdir(parents=True, exist_ok=True)
    cache_file = depth_cache / f"{master_id}.png"

    if cache_file.exists():
        b64 = base64.b64encode(cache_file.read_bytes()).decode()
        return {"depth_base64": b64, "cached": True}

    images_list = matched.get("images", [])
    image_field = matched.get("image")
    filename = None
    if images_list:
        filename = os.path.basename(images_list[0])
    elif image_field:
        filename = os.path.basename(image_field)

    if not filename:
        raise HTTPException(status_code=404, detail="No image found for artifact")

    img_path = IMAGES_DIR / filename
    if not img_path.exists():
        raise HTTPException(status_code=404, detail=f"Image file not found: {filename}")

    load_midas()
    if not MIDAS_LOADED:
        raise HTTPException(status_code=503, detail="Depth model not available")

    try:
        import cv2
        img = cv2.imread(str(img_path))
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        input_batch = midas_transform(img_rgb)

        with torch.no_grad():
            prediction = midas_model(input_batch)
            prediction = torch.nn.functional.interpolate(
                prediction.unsqueeze(1),
                size=img_rgb.shape[:2],
                mode="bicubic",
                align_corners=False,
            ).squeeze()

        depth_map = prediction.cpu().numpy()
        depth_norm = cv2.normalize(depth_map, None, 0, 255, cv2.NORM_MINMAX)
        depth_uint8 = depth_norm.astype("uint8")

        _, buf = cv2.imencode(".png", depth_uint8)
        cache_file.write_bytes(buf.tobytes())
        b64 = base64.b64encode(buf.tobytes()).decode()
        return {"depth_base64": b64, "cached": False}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ar/visualize")
async def ar_visualize(payload: dict):
    artifact_id = payload.get("artifact_id")
    if not artifact_id:
        raise HTTPException(status_code=400, detail="artifact_id is required")

    if not GEMINI_ENABLED:
        raise HTTPException(status_code=503, detail="Gemini not available")

    matched = resolve_master_artifact(artifact_id, JSON_PATH)
    if not matched:
        raise HTTPException(status_code=404, detail="Artifact not found")

    master_id = str(matched.get("id"))
    cache_file = VISUALIZE_CACHE / f"{master_id}.png"

    if cache_file.exists():
        b64 = base64.b64encode(cache_file.read_bytes()).decode()
        return {"image_base64": b64, "cached": True}

    extra = matched.get("extra", {})
    prompt = (
        f"Create a museum-quality digital illustration showing how this "
        f"ancient artifact likely looked when it was newly made, fully "
        f"intact and undamaged. Artifact: {matched.get('title')}. "
        f"Material: {extra.get('material', 'stone')}. "
        f"Religion/context: {extra.get('religion', '')}. "
        f"Period: {extra.get('date', '')}. "
        f"Style: realistic historical reconstruction, clean studio lighting, "
        f"neutral background, no modern elements, no text or watermarks."
    )

    try:
        encoded_prompt = urllib.parse.quote(prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=768&height=768&nologo=true&model=flux"

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(image_url)
            response.raise_for_status()
            image_bytes = response.content

        if not image_bytes:
            raise HTTPException(status_code=500, detail="No image returned")

        cache_file.write_bytes(image_bytes)
        b64 = base64.b64encode(image_bytes).decode()
        return {"image_base64": b64, "cached": False}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

@app.post("/ar/illustrate")
async def ar_illustrate(payload: dict):
    artifact_id = str(payload.get("artifact_id", "unknown")).strip()
    title       = payload.get("title", "Gandharan Buddha statue")
    material    = payload.get("material", "grey schist")
    religion    = payload.get("religion", "Buddhism")
    date        = payload.get("date", "")

    if not artifact_id or artifact_id == "unknown":
        raise HTTPException(status_code=400, detail="artifact_id is required")

    front_file = ILLUSTRATE_CACHE / f"{artifact_id}_front.jpg"
    back_file  = ILLUSTRATE_CACHE / f"{artifact_id}_back.jpg"

    if front_file.exists() and back_file.exists():
        return {
            "front_base64": base64.b64encode(front_file.read_bytes()).decode(),
            "back_base64":  base64.b64encode(back_file.read_bytes()).decode(),
            "cached": True,
        }

    visual_desc = (
        f"{title}. Standing Gandharan Buddha statue in grey schist stone. "
        f"Right hand raised in abhaya mudra (gesture of fearlessness), "
        f"left hand holding the edge of the robe. "
        f"Flowing monastic robes with detailed drapery folds. "
        f"Circular halo behind the head. "
        f"Naturalistic facial features, elongated earlobes, serene expression. "
        f"Full body visible from head to base. "
    )

    base_constraints = (
        "highly accurate archaeological museum illustration, "
        "precise reconstruction of this exact statue, "
        "faithful to original pose, hand gestures, robe folds and halo, "
        "stone texture visible, neutral grey background, "
        "no lotus throne, no seated pose, no modern elements, "
        "no text, no watermarks, documentary style"
    )

    front_prompt = (
        f"Front view of {visual_desc} "
        f"Material: {material}. Period: {date}. Religion: {religion}. "
        f"{base_constraints}"
    )

    back_prompt = (
        f"Back view of {visual_desc} "
        f"Material: {material}. Period: {date}. Religion: {religion}. "
        f"Rear view showing the back of the statue and robes. {base_constraints}"
    )

    def build_url(prompt: str, seed: int) -> str:
        encoded = urllib.parse.quote(prompt)
        return f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&model=flux&seed={seed}"

    headers = {"User-Agent": "MuseumAR/1.0"}

    async def fetch_image(url: str) -> bytes:
        async with httpx.AsyncClient(timeout=90.0) as client:
            res = await client.get(url, headers=headers)
            res.raise_for_status()
            return res.content

    try:
        front_bytes = await fetch_image(build_url(front_prompt, 42))
        await asyncio.sleep(2.0)
        back_bytes = await fetch_image(build_url(back_prompt, 99))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Image generation failed")

    front_file.write_bytes(front_bytes)
    back_file.write_bytes(back_files := back_bytes)

    return {
        "front_base64": base64.b64encode(front_bytes).decode(),
        "back_base64":  base64.b64encode(back_bytes).decode(),
        "cached": False,
    }

@app.post("/ar/feedback")
def ar_feedback(payload: FeedbackPayload):
    FEEDBACK_LOG.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "timestamp":    datetime.datetime.utcnow().isoformat(),
        "predicted_id": payload.predicted_id,
        "correct_id":   payload.correct_id,
        "confidence":   payload.confidence,
        "confirmed":    payload.confirmed,
    }
    with open(FEEDBACK_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    return {"status": "logged"}

# ── 7. Router Setup ──────────────────────────────────────────────────────────
try:
    # FIX: Adding prefix="/api" ensures /api/planner is routed to your planner_router
    app.include_router(planner_router, prefix="/api")
    print("✅ planner_router successfully loaded with /api prefix")
except Exception as e:
    print(f"❌ planner_router failed to load. The exact error is: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)