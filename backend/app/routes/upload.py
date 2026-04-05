from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config.settings import settings
from app.models.schemas import UploadPDFResponse
from app.services.pdf_service import store_pdf

router = APIRouter(tags=["upload"])


@router.post("/upload-pdf", response_model=UploadPDFResponse)
async def upload_pdf(file: UploadFile = File(...)) -> UploadPDFResponse:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    saved_path = await store_pdf(file=file, uploads_dir=settings.uploads_dir)
    return UploadPDFResponse(file_path=str(saved_path))
