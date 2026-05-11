from pydantic import BaseModel
from typing import List, Dict

class AnalyzeRequest(BaseModel):
    query: str

class AnalyzeResponse(BaseModel):
    scores: Dict
    issues: List
    recommendations: List