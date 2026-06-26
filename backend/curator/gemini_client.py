# curator/gemini_client.py
import google.generativeai as genai
from config import GEMINI_API_KEY

GEMINI_ENABLED = False

print("🔧 GEMINI_API_KEY present:", bool(GEMINI_API_KEY))

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        GEMINI_ENABLED = True
    except Exception as e:
        print("❌ Error configuring Gemini:", e)
        GEMINI_ENABLED = False

print("🚦 GEMINI_ENABLED:", GEMINI_ENABLED)


def run_gemini(image_bytes, prompt: str):
    """Call Gemini with the prompt + image and return the text output, or None on error."""
    if not GEMINI_ENABLED:
        print("⚠️ run_gemini called but GEMINI_ENABLED is False")
        return None

    try:
        response = model.generate_content(
            [
                prompt,
                {"mime_type": "image/jpeg", "data": image_bytes},
            ]
        )
        print("📝 Gemini text:", getattr(response, "text", None))
        return getattr(response, "text", None)
    except Exception as e:
        print("❌ Gemini error:", e)
        return None

# import google.generativeai as genai
# from config import GEMINI_API_KEY

# genai.configure(api_key=GEMINI_API_KEY)

# model = genai.GenerativeModel("gemini-2.5-flash")

# def run_gemini(image_bytes, prompt):
#     response = model.generate_content(
#         [
#             prompt,
#             {
#                 "mime_type": "image/jpeg",
#                 "data": image_bytes
#             }
#         ]
#     )
#     return response.text
