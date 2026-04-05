from app.models.schemas import AnalyzeResponse


def analyze_pdf(file_path: str) -> AnalyzeResponse:
    # Placeholder implementation. This will call AI modules from the /ai folder later.
    return AnalyzeResponse(
        claims=["Sample claim"],
        score=0.3,
        risk="Questionable",
    )
