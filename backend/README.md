# TruthESG Backend (FastAPI)

Production-ready modular FastAPI backend for the TruthESG project.

## Structure

- `app/main.py` - FastAPI app entrypoint
- `app/routes/` - API route modules
- `app/services/` - business/service layer
- `app/models/` - request/response schemas
- `app/utils/` - utility helpers
- `app/config/` - app settings and environment config
- `uploads/` - uploaded PDF files

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run server

From the `backend` folder:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API endpoints

- `GET /health`
- `POST /upload-pdf`
- `POST /analyze`
