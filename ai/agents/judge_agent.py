def evaluate_claim(claim_data: dict) -> dict:
    cps_score = claim_data["cps_score"]
    final_score = cps_score
    reasons = []

    regulatory_evidence = claim_data.get("regulatory_evidence", "")
    if "violation" in regulatory_evidence.lower():
        final_score += 0.3

    news_confidence = claim_data.get("news_confidence", 0.0)
    if news_confidence > 0.6:
        final_score += 0.3
    elif news_confidence < 0.3:
        final_score -= 0.1

    if cps_score < 0.3:
        reasons.append("Strong measurable claim")
    elif cps_score < 0.7:
        reasons.append("Moderate claim strength")
    else:
        reasons.append("Weak or vague claim")

    reg_text = regulatory_evidence.lower().strip()

    if "no major violations" in reg_text:
        reasons.append("no regulatory issues found")
    elif "violation" in reg_text or "penalty" in reg_text or "fine" in reg_text:
        reasons.append("regulatory concerns detected")
    else:
        reasons.append("no clear regulatory signals")

    if news_confidence > 0.6:
        reasons.append("negative news signals present")
    elif news_confidence < 0.3:
        reasons.append("no major negative news found")

    final_score = max(0, min(1, final_score))

    if final_score < 0.3:
        final_risk = "Low Risk"
    elif final_score < 0.7:
        final_risk = "Questionable"
    else:
        final_risk = "High Risk"

    reason = ", ".join(reasons)

    return {
        "claim": claim_data["claim"],
        "final_score": round(final_score, 2),
        "final_risk": final_risk,
        "reason": reason,
    }