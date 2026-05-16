from pydantic import BaseModel
from typing import List, Dict


class Product(BaseModel):
    title: str
    description: str
    tags: List[str]
    category: str
    price: int


class AnalyzeResponse(BaseModel):

    product: Dict

    deterministicScores: Dict

    issues: List[str]

    recommendations: List[str]


class AnalyzeRequest(BaseModel):
    query: str