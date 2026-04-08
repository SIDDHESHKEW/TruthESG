from pathlib import Path
import re
from io import StringIO

import fitz
from fastapi import UploadFile

from app.utils.file_handler import save_uploaded_file

SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")
CLAIM_KEYWORDS = ("reduced", "increased", "achieved", "improved", "decreased")


async def store_pdf(file: UploadFile, uploads_dir: Path) -> Path:
    return await save_uploaded_file(file=file, destination_dir=uploads_dir)


def extract_text_from_pdf(file_path: str) -> str:
    pdf_path = Path(file_path)
    if not pdf_path.exists() or not pdf_path.is_file():
        raise FileNotFoundError(f"PDF file not found: {file_path}")

    try:
        with fitz.open(pdf_path) as doc:
            if doc.page_count == 0:
                raise ValueError("The PDF is empty")

            text_buffer = StringIO()
            for page in doc:
                page_text = page.get_text("text")
                if page_text:
                    text_buffer.write(page_text)
                    text_buffer.write("\n")

        clean_text = text_buffer.getvalue().strip()
        if not clean_text:
            raise ValueError("No extractable text found in the PDF")

        return clean_text
    except FileNotFoundError:
        raise
    except ValueError:
        raise
    except Exception as exc:
        raise RuntimeError(f"Failed to extract text from PDF: {exc}") from exc


def split_text(text: str, chunk_size: int = 2000) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0")

    normalized_text = text.strip()
    if not normalized_text:
        return []

    chunks: list[str] = []
    text_length = len(normalized_text)
    start = 0

    while start < text_length:
        end = min(start + chunk_size, text_length)

        if end < text_length:
            sentence_boundary = normalized_text.rfind("\n", start, end)
            if sentence_boundary == -1:
                sentence_boundary = normalized_text.rfind(". ", start, end)
            if sentence_boundary == -1:
                sentence_boundary = normalized_text.rfind("? ", start, end)
            if sentence_boundary == -1:
                sentence_boundary = normalized_text.rfind("! ", start, end)
            if sentence_boundary > start:
                end = sentence_boundary + 1

        chunk = normalized_text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end

    return chunks


def extract_claims_from_chunk(chunk: str) -> list[str]:
    claims: list[str] = []
    seen_claims: set[str] = set()

    for sentence in SENTENCE_SPLIT_RE.split(chunk):
        cleaned_sentence = " ".join(sentence.split()).strip()
        if not cleaned_sentence:
            continue

        lower_sentence = cleaned_sentence.lower()
        has_percentage = "%" in cleaned_sentence
        has_keyword = any(keyword in lower_sentence for keyword in CLAIM_KEYWORDS)

        if not has_percentage and not has_keyword:
            continue

        if lower_sentence in seen_claims:
            continue

        seen_claims.add(lower_sentence)
        claims.append(cleaned_sentence)

    return claims


def process_pdf(file_path: str) -> list[str]:
    full_text = extract_text_from_pdf(file_path)
    chunks = split_text(full_text)

    all_claims: list[str] = []
    seen_claims: set[str] = set()

    for chunk in chunks:
        for claim in extract_claims_from_chunk(chunk):
            normalized_claim = claim.lower()
            if normalized_claim in seen_claims:
                continue

            seen_claims.add(normalized_claim)
            all_claims.append(claim)

    return all_claims
