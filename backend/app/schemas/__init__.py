"""Schemas package initialization."""

from app.schemas.story_templates import (
    StoryTemplatePage,
    StoryTemplateBase,
    StoryTemplateCreate,
    StoryTemplateUpdate,
    StoryTemplatePublic,
    StoryGenerationRequest,
    StoryGenerationResponse,
)

from app.schemas.personalized_story import (
    ChildAppearance,
    PersonalizeStoryRequest,
    PersonalizedPage,
    PersonalizeStoryResponse,
    UserStoryInstancePublic,
)

__all__ = [
    # Story templates
    "StoryTemplatePage",
    "StoryTemplateBase",
    "StoryTemplateCreate",
    "StoryTemplateUpdate",
    "StoryTemplatePublic",
    "StoryGenerationRequest",
    "StoryGenerationResponse",
    # Personalized stories
    "ChildAppearance",
    "PersonalizeStoryRequest",
    "PersonalizedPage",
    "PersonalizeStoryResponse",
    "UserStoryInstancePublic",
]
