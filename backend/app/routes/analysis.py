from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config.settings import settings
from app.models.schemas import AnalyzeClaimsResponse, FinalClaimItem
from app.services.pdf_service import process_pdf, store_pdf
from app.services.scoring_service import score_claim

router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeClaimsResponse)
async def analyze(file: UploadFile = File(...)) -> AnalyzeClaimsResponse:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        saved_path = await store_pdf(file=file, uploads_dir=settings.uploads_dir)
        claims = process_pdf(file_path=str(saved_path))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    claims_output: list[FinalClaimItem] = []
    for claim in claims:
        scored_claim = score_claim(claim)
        claims_output.append(
            FinalClaimItem(
                claim=claim,
                final_score=scored_claim["final_score"],
                final_risk=scored_claim["final_risk"],
                reason=scored_claim["reason"],
            )
        )

    return AnalyzeClaimsResponse(claims=claims_output)
