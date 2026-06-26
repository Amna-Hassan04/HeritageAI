# curator/curator_logic.py
import json
from schemas import CuratorResponse

def curate(image_bytes, raw_text):
    if not raw_text:
        print("⚠️ curate called with empty raw_text")
        return CuratorResponse(interpretations=[])

    try:
        data = json.loads(raw_text)
        print("✅ Parsed JSON from Gemini:", data)
        return CuratorResponse(**data)
    except Exception as e:
        print("❌ Error parsing Gemini JSON:", e)
        print("Raw text was:", raw_text)
        return CuratorResponse(interpretations=[])
# from schemas import CuratorResponse, Interpretation

# def mocked_curator_response():
#     return CuratorResponse(
#         interpretations=[
#             Interpretation(
#                 title="Artifact Interpretation (Mocked)",
#                 description=(
#                     "This response is generated using a simulated curator model "
#                     "due to external API quota limitations."
#                 ),
#                 era="Estimated Historical Period",
#                 material="Estimated Material",
#                 confidence=0.85
#             ),
#             Interpretation(
#                 title="Alternate Interpretation (Mocked)",
#                 description=(
#                     "Another plausible analysis of the artifact based on typical museum curation standards."
#                 ),
#                 era="Ancient Era",
#                 material="Stone or Metal",
#                 confidence=0.10
#             ),
#             Interpretation(
#                 title="Third Interpretation (Mocked)",
#                 description=(
#                     "A possible alternative hypothesis for educational purposes."
#                 ),
#                 era="Unknown",
#                 material="Unknown",
#                 confidence=0.05
#             )
#         ]
#     )
