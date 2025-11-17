"""
Database models for Tofula.
"""
from datetime import datetime
from typing import Optional, List
from enum import Enum

from sqlalchemy import JSON, String, Integer, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


class StoryStatus(str, Enum):
    """Status of a story template."""
    DRAFT = "draft"
    APPROVED = "approved"
    ARCHIVED = "archived"


class StoryTemplate(Base):
    """Story template created in Studio."""
    
    __tablename__ = "story_templates"
    
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    
    # Metadata
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Story properties
    themes: Mapped[str] = mapped_column(String(200))
    age_range: Mapped[str] = mapped_column(String(50))  # e.g., "3-5", "6-8"
    culture: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    moral: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Status
    status: Mapped[str] = mapped_column(String(20), default=StoryStatus.DRAFT.value)
    
    # Content (JSON)
    pages: Mapped[dict] = mapped_column(JSON)  # List of page objects
    extra_metadata: Mapped[dict] = mapped_column(JSON, default=dict)
    
    # Relationships
    instances: Mapped[List["UserStoryInstance"]] = relationship(
        back_populates="template", cascade="all, delete-orphan"
    )


class UserStoryInstance(Base):
    """Personalized story instance for a user."""
    
    __tablename__ = "user_story_instances"
    
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # User and template
    user_id: Mapped[str] = mapped_column(String(100), index=True)
    template_id: Mapped[str] = mapped_column(
        String(50), ForeignKey("story_templates.id"), index=True
    )
    
    # Personalization
    child_name: Mapped[str] = mapped_column(String(100))
    age: Mapped[int] = mapped_column(Integer)
    reading_level: Mapped[str] = mapped_column(String(50))
    tone: Mapped[str] = mapped_column(String(50))
    language: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    
    # Appearance (JSON)
    appearance: Mapped[dict] = mapped_column(JSON)
    
    # Generated content
    personalized_pages: Mapped[dict] = mapped_column(JSON)  # Text with placeholders replaced
    illustration_urls: Mapped[dict] = mapped_column(JSON, default=dict)  # page_num -> url
    pdf_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    audio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Metadata
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    extra_metadata: Mapped[dict] = mapped_column(JSON, default=dict)
    
    # Relationships
    template: Mapped["StoryTemplate"] = relationship(back_populates="instances")
