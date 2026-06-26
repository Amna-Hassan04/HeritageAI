"""
api/server.py — Taxila Museum Artifact Matcher API
"""
import io, json, logging, datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from PIL import Image

import sys
ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from match import ArtifactMatcher

JSON_PATH    = ROOT / "dataset" / "artifacts.json"
FEEDBACK_LOG = ROOT / "dataset" / "feedback.jsonl"
FRONTEND_DIR = ROOT / "frontend"
IMAGES_DIR   = ROOT / "dataset" / "images_flat"
INDEX_DIR    = ROOT / "index"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load matcher once at startup — takes ~3s to load model
logger.info("Loading ArtifactMatcher…")
matcher = ArtifactMatcher(index_dir=str(INDEX_DIR))
logger.info("Matcher ready.")

app = FastAPI(title="Taxila Museum", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve artifact images at /images/<filename>
if IMAGES_DIR.exists():
    app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

# Serve frontend
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

@app.get("/")
def root():
    index = FRONTEND_DIR / "demo.html"
    if index.exists():
        return FileResponse(str(index))
    return {"message": "API is running. Frontend not found."}

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}

@app.get("/artifacts")
def get_artifacts():
    if not JSON_PATH.exists():
        raise HTTPException(status_code=404, detail="artifacts.json not found")
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.post("/match")
async def match_artifact(file: UploadFile = File(...), top_k: int = 3):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()
    try:
        img    = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        result = matcher.match(img, top_k=top_k)
    except Exception as e:
        logger.exception("Match failed")
        raise HTTPException(status_code=500, detail=str(e))

    logger.info(f"Match result: {result}")
    return result

class FeedbackPayload(BaseModel):
    predicted_id: str
    correct_id:   Optional[str] = None
    confidence:   float
    confirmed:    bool

@app.post("/feedback")
def log_feedback(payload: FeedbackPayload):
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