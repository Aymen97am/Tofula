"""
Core configuration for the Tofula backend.
"""
import os
from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    PROJECT_NAME: str = "Tofula API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"  # development, staging, production
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]
    
    # Google Generative AI
    GOOGLE_API_KEY: str
    
    # Firebase / GCS
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_STORAGE_BUCKET: Optional[str] = None
    GCS_BUCKET_NAME: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "sqlite:///./tofula.db"
    
    # Auth
    FIREBASE_WEB_API_KEY: Optional[str] = None
    JWT_SECRET_KEY: Optional[str] = "dev-secret-key-change-in-production"
    
    # Studio Access
    STUDIO_PASSWORD: str = "Tofula@2025"
    
    # Storage
    STORAGE_TYPE: str = "local"  # local, gcs, or firebase
    LOCAL_STORAGE_PATH: str = "./storage"
    
    # Model Settings
    STORY_MODEL: str = "gemini-2.0-flash-exp"
    MODERATION_MODEL: str = "gemini-2.0-flash-lite"
    POLISH_MODEL: str = "gemini-2.0-flash-exp"
    IMAGE_MODEL: str = "gemini-2.5-flash-image"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
