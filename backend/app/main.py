from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.routes.analysis import router as analysis_router
from app.routes.health import router as health_router
from app.routes.upload import router as upload_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    app.include_router(health_router, prefix=settings.api_prefix)
    app.include_router(upload_router, prefix=settings.api_prefix)
    app.include_router(analysis_router, prefix=settings.api_prefix)

    return app


app = create_app()
