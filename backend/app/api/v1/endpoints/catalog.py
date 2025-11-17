"""
Public catalog endpoints.
"""
import logging
from typing import List, Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas import StoryTemplatePublic
from app.services import get_db_service, DatabaseService
from app.models import StoryStatus

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/catalog", tags=["catalog"])


@router.get("", response_model=List[StoryTemplatePublic])
async def list_catalog_stories(
    db: Annotated[DatabaseService, Depends(get_db_service)],
    skip: int = 0,
    limit: int = 100,
):
    """
    List all approved stories in the public catalog.
    
    This is the main browsing endpoint for customers.
    """
    logger.info("Fetching public catalog")
    
    templates = db.list_story_templates(
        status=StoryStatus.APPROVED.value,
        skip=skip,
        limit=limit
    )
    
    return [StoryTemplatePublic.model_validate(t) for t in templates]


@router.get("/{story_id}", response_model=StoryTemplatePublic)
async def get_catalog_story(
    story_id: str,
    db: Annotated[DatabaseService, Depends(get_db_service)],
):
    """
    Get details of a single story from the catalog.
    
    Only returns approved stories.
    """
    template = db.get_story_template(story_id)
    
    if not template or template.status != StoryStatus.APPROVED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found in catalog"
        )
    
    return StoryTemplatePublic.model_validate(template)
