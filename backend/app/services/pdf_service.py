from pathlib import Path

from fastapi import UploadFile

from app.utils.file_handler import save_uploaded_file


async def store_pdf(file: UploadFile, uploads_dir: Path) -> Path:
    return await save_uploaded_file(file=file, destination_dir=uploads_dir)
