from pathlib import Path
import re
import sys

from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeClaimsResponse, ScoredClaimItem
from app.services.pdf_service import extract_text_from_pdf
from app.services.scoring_service import calculate_cps

PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from ai.claim_extraction.extractor import extract_claims
from ai.agents.regulatory_agent import check_regulatory_issues
from ai.agents.news_agent import check_news_issues

router = APIRouter(tags=["analysis"])


def _extract_company_name(text: str) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if lines:
        return lines[0]

    match = re.search(r"([A-Z][A-Za-z0-9&.,\-\s]{2,})", text)
    if match:
        return match.group(1).strip()

    return "Unknown Company"


@router.post("/analyze", response_model=AnalyzeClaimsResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeClaimsResponse:
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

    claims = extract_claims(extracted_text)
    company_name = _extract_company_name(extracted_text)
    regulatory_result = check_regulatory_issues(company_name)

    claims_output: list[ScoredClaimItem] = []
    for c in claims:
        scored = calculate_cps(c["claim"])
        news_result = check_news_issues(company_name, c["claim"])
        claims_output.append(
            ScoredClaimItem(
                **scored,
                regulatory_evidence=regulatory_result["status"],
                news_evidence=news_result["status"],
                news_confidence=news_result["confidence"],
                evidence=regulatory_result["status"],
                source="Regulatory + News Agents",
            )
        )

    return AnalyzeClaimsResponse(claims=claims_output)
