from pathlib import Path

import fitz
from fastapi import UploadFile

from app.utils.file_handler import save_uploaded_file


async def store_pdf(file: UploadFile, uploads_dir: Path) -> Path:
    return await save_uploaded_file(file=file, destination_dir=uploads_dir)


def extract_text_from_pdf(file_path: str) -> str:
    # Validate input path early so callers get a clear error message.
    pdf_path = Path(file_path)
    if not pdf_path.exists() or not pdf_path.is_file():
        raise FileNotFoundError(f"PDF file not found: {file_path}")

    try:
        # Open the PDF and concatenate text from all pages in reading order.
        with fitz.open(pdf_path) as doc:
            if doc.page_count == 0:
                raise ValueError("The PDF is empty")

            page_texts: list[str] = []
            for page in doc:
                page_texts.append(page.get_text("text"))

        clean_text = "\n".join(page_texts).strip()
        if not clean_text:
            raise ValueError("No extractable text found in the PDF")

        return clean_text
    except FileNotFoundError:
        raise
    except ValueError:
        raise
    except Exception as exc:
        raise RuntimeError(f"Failed to extract text from PDF: {exc}") from exc
