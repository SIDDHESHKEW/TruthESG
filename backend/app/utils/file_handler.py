from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


async def save_uploaded_file(file: UploadFile, destination_dir: Path) -> Path:
    destination_dir.mkdir(parents=True, exist_ok=True)

    safe_name = file.filename or "uploaded.pdf"
    destination_path = destination_dir / f"{uuid4().hex}_{safe_name}"

    content = await file.read()
    destination_path.write_bytes(content)

    return destination_path
