from pydantic import BaseModel

from typing import List, Dict, Any


class Product(BaseModel):

    title: str

    description: str

    tags: List[str]

    category: str

    price: float


class AnalyzeRequest(BaseModel):

    product: Dict[str, Any]

    scores: Dict[str, Any]

    issues: List[str]

    recommendations: List[str]


class AnalyzeResponse(BaseModel):

    summary: str

    visibilityPrediction: Dict[str, str]

    optimizedTitle: str

    optimizedDescription: str

    semanticGaps: List[str]

    improvementPriority: str