from fastapi import APIRouter

from app.models.schemas import AnalyzeRequest
from app.agents.audit_agent import run_audit

router = APIRouter()


@router.post("/analyze")
def analyze(data: AnalyzeRequest):

    result = run_audit(data.query)

    return result