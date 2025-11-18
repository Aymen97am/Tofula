"""
Pydantic models for story generation pipeline data structures.
"""

from typing import Dict, List, Optional, Literal
from pydantic import BaseModel, Field


class StoryBeat(BaseModel):
    """A single story beat/page."""

    page: int = Field(description="Page number")
    summary: str = Field(description="Summary of what happens on this page")


class StoryTemplate(BaseModel):
    """Story template with theme and structure."""

    theme: str = Field(description="The main theme of the story")
    template_id: str = Field(description="Unique identifier for this template")
    beats: List[str] = Field(description="List of story beats/plot points")


class StoryOutline(BaseModel):
    """Structured outline for a children's story."""

    title: str = Field(description="Story title")
    beats: List[StoryBeat] = Field(description="List of story beats with page numbers")
    vocabulary_targets: List[str] = Field(
        description="Target vocabulary words for the reading level",
        default_factory=list,
    )


class IllustrationPrompt(BaseModel):
    """Illustration prompt for a specific page."""

    page: int = Field(description="Page number")
    prompt: str = Field(description="Text-to-image prompt for this page")


class IllustrationPrompts(BaseModel):
    """Collection of illustration prompts."""

    prompts: List[IllustrationPrompt] = Field(
        description="List of illustration prompts"
    )


class ModerationResult(BaseModel):
    """Result of content moderation check."""

    is_safe: bool = Field(description="Whether the content is safe for children")
    reason: Optional[str] = Field(
        description="Reason if content is not safe", default=None
    )


class StoryOutput(BaseModel):
    """Final assembled story output."""

    title: str
    outline: StoryOutline
    draft: str
    story_final: str
    illustrations: Optional[Dict[int, str]] = None
    audio: Optional[str] = None
    metadata: dict = Field(default_factory=dict)
