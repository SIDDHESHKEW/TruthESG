from pathlib import Path
import random

from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeClaimsResponse, AnalyzeRequest, FinalClaimItem
from app.services.pdf_service import process_pdf

router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeClaimsResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeClaimsResponse:
    pdf_path = Path(request.file_path)
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="File path does not exist")

    try:
        claims = process_pdf(file_path=request.file_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    claims_output: list[FinalClaimItem] = []
    for claim in claims:
        claims_output.append(
            FinalClaimItem(
                claim=claim,
                final_score=round(random.uniform(0.4, 0.6), 2),
                final_risk="Questionable",
                reason="Initial analysis - no external verification yet",
            )
        )

    return AnalyzeClaimsResponse(claims=claims_output)
