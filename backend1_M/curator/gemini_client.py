import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("🔧 GEMINI_API_KEY present:", bool(GEMINI_API_KEY))

GEMINI_ENABLED = False

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        GEMINI_ENABLED = True
    except Exception as e:
        print("❌ Error configuring Gemini:", e)

print("🚦 GEMINI_ENABLED:", GEMINI_ENABLED)


def run_gemini(image_bytes, prompt: str):
    if not GEMINI_ENABLED:
        print("⚠️ Gemini not enabled")
        return None

    try:
        response = model.generate_content(
            [
                prompt,
                {"mime_type": "image/jpeg", "data": image_bytes},
            ]
        )

        return getattr(response, "text", None)

    except Exception as e:
        print("❌ Gemini error:", e)
        return None