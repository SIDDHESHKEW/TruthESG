NEGATIVE_KEYWORDS = ["pollution", "spill", "protest", "violation", "fine", "damage"]
SUSPICIOUS_CLAIM_KEYWORDS = ["carbon", "emission", "water", "energy"]


def check_news_issues(company_name: str, claim: str) -> dict:
    normalized_company = company_name.lower()
    normalized_claim = claim.lower()

    if "carbon" in normalized_company:
        return {
            "status": "Negative news found: possible environmental violations reported",
            "confidence": 0.8,
        }

    if any(keyword in normalized_claim for keyword in SUSPICIOUS_CLAIM_KEYWORDS):
        return {
            "status": "No major negative news found",
            "confidence": 0.2,
        }

    return {
        "status": "No significant news signals detected",
        "confidence": 0.1,
    }