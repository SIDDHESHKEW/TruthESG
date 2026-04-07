from pathlib import Path
import re
import sys

from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeClaimsResponse, FinalClaimItem
from app.services.pdf_service import extract_text_from_pdf
from app.services.scoring_service import calculate_cps

PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from ai.claim_extraction.extractor import extract_claims
from ai.agents.regulatory_agent import check_regulatory_issues
from ai.agents.news_agent import check_news_issues
from ai.agents.judge_agent import evaluate_claim

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

    claims_output: list[FinalClaimItem] = []
    for c in claims:
        scored = calculate_cps(c["claim"])
        news_result = check_news_issues(company_name, c["claim"])

        full_claim_data = {
            "claim": c["claim"],
            "cps_score": scored["cps_score"],
            "risk": scored["risk"],
            "regulatory_evidence": regulatory_result["status"],
            "news_evidence": news_result["status"],
            "news_confidence": news_result["confidence"],
        }
        judge_result = evaluate_claim(full_claim_data)

        claims_output.append(
            FinalClaimItem(
                claim=judge_result["claim"],
                final_score=judge_result["final_score"],
                final_risk=judge_result["final_risk"],
                reason=judge_result["reason"],
            )
        )

    return AnalyzeClaimsResponse(claims=claims_output)
