from fastapi import APIRouter

from app.models.schemas import (
    AnalyzeRequest,
    AnalyzeResponse
)

from app.agents.audit_agent import (
    run_audit
)

router = APIRouter()


@router.post(
    "/analyze",
    response_model=AnalyzeResponse
)
def analyze(data: AnalyzeRequest):

    result = run_audit({
        "product":
            data.product,

        "scores":
            data.scores,

        "issues":
            data.issues,

        "recommendations":
            data.recommendations,
    })

    return result