"""
Pydantic schemas for story templates.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class StoryTemplatePage(BaseModel):
    """A single page in a story template."""
    
    page_number: int = Field(description="Page number (1-indexed)")
    template_text: str = Field(
        description="Text with placeholders like {child_name}, {age}, etc."
    )
    base_prompt: str = Field(
        description="Base illustration prompt (without character appearance)"
    )


class StoryTemplateBase(BaseModel):
    """Base fields for story template."""
    
    title: str = Field(max_length=200)
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    themes: str = Field(max_length=200)
    age_range: str = Field(max_length=50, description="e.g., '3-5', '6-8'")
    culture: Optional[str] = Field(None, max_length=100)
    moral: Optional[str] = None
    pages: List[StoryTemplatePage]


class StoryTemplateCreate(StoryTemplateBase):
    """Schema for creating a story template."""
    pass


class StoryTemplateUpdate(BaseModel):
    """Schema for updating a story template."""
    
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    themes: Optional[str] = Field(None, max_length=200)
    age_range: Optional[str] = Field(None, max_length=50)
    culture: Optional[str] = Field(None, max_length=100)
    moral: Optional[str] = None
    pages: Optional[List[StoryTemplatePage]] = None
    status: Optional[str] = None


class StoryTemplatePublic(StoryTemplateBase):
    """Public schema for story template."""
    
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    extra_metadata: dict = Field(default_factory=dict)
    
    model_config = {"from_attributes": True}


class StoryGenerationRequest(BaseModel):
    """Request to generate a new story in Studio."""
    
    themes: str = Field(description="Story themes, comma-separated")
    child_name: str = Field(default="Alex", description="Placeholder child name")
    age: int = Field(ge=2, le=12, default=5)
    reading_level: str = Field(default="beginner")
    length: int = Field(ge=5, le=20, default=10, description="Number of pages")
    tone: str = Field(default="warm")
    style: str = Field(default="modern")
    culture: Optional[str] = None
    moral: Optional[str] = None


class StoryGenerationResponse(BaseModel):
    """Response after generating a story."""
    
    title: str
    outline: dict
    draft: str
    story_final: str
    illustrations: Optional[dict] = None
    extra_metadata: dict
