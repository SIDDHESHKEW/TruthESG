from pathlib import Path
import sys

from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeTextPreviewResponse, ClaimItem
from app.services.pdf_service import extract_text_from_pdf

PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from ai.claim_extraction.extractor import extract_claims

router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeTextPreviewResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeTextPreviewResponse:
    pdf_path = Path(request.file_path)
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="File path does not exist")

    try:
        extracted_text = extract_text_from_pdf(file_path=request.file_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    claims = [ClaimItem(**item) for item in extract_claims(extracted_text)]
    return AnalyzeTextPreviewResponse(text_preview=extracted_text[:1000], claims=claims)
