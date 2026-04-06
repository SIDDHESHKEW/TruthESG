NEGATIVE_KEYWORDS = ["pollution", "violation", "fine", "penalty", "NGT", "illegal"]


def check_regulatory_issues(company_name: str) -> dict:
    if "carbon" in company_name.lower():
        return {
            "status": "Potential environmental violations detected",
        }

    return {
        "status": "No major violations found",
    }
