from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeTextPreviewResponse
from app.services.pdf_service import extract_text_from_pdf

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

    return AnalyzeTextPreviewResponse(text_preview=extracted_text[:1000])
