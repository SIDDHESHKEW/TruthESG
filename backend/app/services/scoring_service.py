import re

STRONG_ACTION_WORDS = ["reduced", "implemented", "transitioned"]
WEAK_VAGUE_WORDS = ["ensured", "improved", "supported"]
FUTURE_TARGET_WORDS = ["will", "achieve", "target", "plan"]
NUMBER_RE = re.compile(r"\d+")


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


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
