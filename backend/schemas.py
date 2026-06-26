from pydantic import BaseModel
from typing import List

class Interpretation(BaseModel):
    title: str
    description: str
    era: str
    material: str
    confidence: float

class CuratorResponse(BaseModel):
    interpretations: List[Interpretation]
