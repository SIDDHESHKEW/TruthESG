from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.scoring_service import analyze_pdf

router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    pdf_path = Path(request.file_path)
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="File path does not exist")

    return analyze_pdf(file_path=request.file_path)
