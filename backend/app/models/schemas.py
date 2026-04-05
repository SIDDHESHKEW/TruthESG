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
