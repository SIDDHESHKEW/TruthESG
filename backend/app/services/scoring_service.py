import re

STRONG_ACTION_WORDS = ["reduced", "implemented", "transitioned"]
WEAK_VAGUE_WORDS = ["ensured", "improved", "supported"]
FUTURE_TARGET_WORDS = ["will", "achieve", "target", "plan"]
NUMBER_RE = re.compile(r"\d+")

POSITIVE_ACTION_WORDS = ["reduced", "decreased", "achieved", "implemented"]
POSITIVE_VERIFICATION_WORDS = ["audited", "certified", "verified"]
NEGATIVE_INTENT_WORDS = ["aim", "target", "plan", "commit"]
NEGATIVE_MARKETING_WORDS = ["leading", "best", "sustainable", "eco-friendly"]
BY_YEAR_RE = re.compile(r"\bby\s*2030\b")


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def _contains_term(text: str, term: str) -> bool:
    return re.search(rf"\b{re.escape(term)}\b", text) is not None


def _contains_any_term(text: str, terms: list[str]) -> bool:
    return any(_contains_term(text, term) for term in terms)


def _risk_label(score: float) -> str:
    if score < 0.3:
        return "Low Risk"
    if score <= 0.7:
        return "Questionable"
    return "High Risk"


def calculate_cps(claim: str) -> dict:
    lower_claim = claim.lower()
    score = 0.5

    number_count = len(NUMBER_RE.findall(lower_claim))
    if number_count >= 2:
        score -= 0.15
    elif number_count == 1:
        score -= 0.1

    if any(word in lower_claim for word in STRONG_ACTION_WORDS):
        score -= 0.1

    if any(word in lower_claim for word in WEAK_VAGUE_WORDS):
        score += 0.2

    if any(word in lower_claim for word in FUTURE_TARGET_WORDS):
        score += 0.3

    score = _clamp(score, 0.0, 1.0)
    score = round(score, 2)

    return {
        "claim": claim,
        "cps_score": score,
        "risk": _risk_label(score),
    }


def score_claim(claim: str) -> dict:
    lower_claim = claim.lower()
    score = 0.5

    # Positive signals
    if "%" in claim:
        score += 0.1
    if NUMBER_RE.search(lower_claim):
        score += 0.1
    if _contains_any_term(lower_claim, POSITIVE_ACTION_WORDS):
        score += 0.1
    if _contains_any_term(lower_claim, POSITIVE_VERIFICATION_WORDS):
        score += 0.15

    # Negative signals
    if _contains_any_term(lower_claim, NEGATIVE_INTENT_WORDS):
        score -= 0.15
    if _contains_any_term(lower_claim, NEGATIVE_MARKETING_WORDS):
        score -= 0.1
    if _contains_term(lower_claim, "will") or BY_YEAR_RE.search(lower_claim):
        score -= 0.1

    score = round(_clamp(score, 0.0, 1.0), 2)

    if score >= 0.75:
        risk = "Verified"
        reason = "Strong measurable claim with specific data"
    elif score >= 0.45:
        risk = "Questionable"
        reason = "Moderate claim, lacks strong verification signals"
    else:
        risk = "High Risk"
        reason = "Vague or future-oriented claim without evidence"

    return {
        "final_score": score,
        "final_risk": risk,
        "reason": reason,
    }
