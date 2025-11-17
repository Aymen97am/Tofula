"""V1 API router initialization."""

from fastapi import APIRouter

from app.api.v1.endpoints import studio, catalog, stories

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(studio.router)
api_router.include_router(catalog.router)
api_router.include_router(stories.router)
