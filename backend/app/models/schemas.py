from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class UploadPDFResponse(BaseModel):
    file_path: str


class AnalyzeRequest(BaseModel):
    file_path: str


class AnalyzeResponse(BaseModel):
    claims: list[str]
    score: float
    risk: str


class ScoredClaimItem(BaseModel):
    claim: str
    cps_score: float
    risk: str
    regulatory_evidence: str
    news_evidence: str
    news_confidence: float
    evidence: str | None = None
    source: str | None = None


class FinalClaimItem(BaseModel):
    claim: str
    final_score: float
    final_risk: str
    reason: str


class AnalyzeClaimsResponse(BaseModel):
    claims: list[FinalClaimItem]
