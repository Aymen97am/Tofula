"""
Pydantic schemas for personalized stories.
"""
from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field


class ChildAppearance(BaseModel):
    """Child's physical appearance for personalization."""
    
    skin_tone: str = Field(description="e.g., 'light', 'medium', 'dark', 'tan'")
    hair_color: str = Field(description="e.g., 'black', 'brown', 'blonde', 'red'")
    hair_style: str = Field(description="e.g., 'short', 'long', 'curly', 'straight'")
    eye_color: str = Field(description="e.g., 'brown', 'blue', 'green', 'hazel'")
    clothing: str = Field(
        description="e.g., 'red shirt and jeans', 'yellow dress'"
    )


class PersonalizeStoryRequest(BaseModel):
    """Request to personalize a story template."""
    
    story_id: str = Field(description="ID of the story template")
    child_name: str = Field(min_length=1, max_length=50)
    age: int = Field(ge=2, le=12)
    reading_level: str = Field(default="beginner")
    tone: str = Field(default="warm")
    appearance: ChildAppearance
    language: Optional[str] = Field(None, max_length=10)
    generate_images: bool = Field(
        default=True, description="Whether to generate illustrations"
    )
    generate_audio: bool = Field(
        default=False, description="Whether to generate audio narration"
    )


class PersonalizedPage(BaseModel):
    """A single personalized page."""
    
    page_number: int
    text: str
    illustration_url: Optional[str] = None


class PersonalizeStoryResponse(BaseModel):
    """Response after personalizing a story."""
    
    instance_id: str
    template_id: str
    title: str
    pages: list[PersonalizedPage]
    pdf_url: Optional[str] = None
    audio_url: Optional[str] = None
    created_at: datetime


class UserStoryInstancePublic(BaseModel):
    """Public schema for user story instance."""
    
    id: str
    created_at: datetime
    template_id: str
    child_name: str
    age: int
    reading_level: str
    tone: str
    language: Optional[str] = None
    appearance: dict
    personalized_pages: dict
    illustration_urls: dict
    pdf_url: Optional[str] = None
    audio_url: Optional[str] = None
    is_favorite: bool
    
    # Template info (joined)
    template_title: Optional[str] = None
    template_cover_url: Optional[str] = None
    
    model_config = {"from_attributes": True}
