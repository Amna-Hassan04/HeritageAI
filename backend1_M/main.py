from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from curator.gemini_client import run_gemini
from curator.curator_logic import curate
from curator.prompts import CURATOR_PROMPT
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your Vercel URL later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app = FastAPI()

# 🔥 TEMPORARY: Allow all origins (change later for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your Vercel domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok", "service": "AI Museum Curator API"}

@app.post("/curate")
async def curate_image(image: UploadFile = File(...)):
    print("🔥 BACKEND RECEIVED:", image.filename)

    image_bytes = await image.read()

    raw_output = run_gemini(image_bytes, CURATOR_PROMPT)

    if raw_output is None:
        return {"error": "Gemini API failed or is not configured"}

    result = curate(image_bytes, raw_output)

    # Convert Pydantic safely
    if hasattr(result, "model_dump"):
        return result.model_dump()
    elif hasattr(result, "dict"):
        return result.dict()
    else:
        return result