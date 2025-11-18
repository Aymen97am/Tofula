"""
Studio API endpoints for admin story management.
"""
import logging
from typing import List, Optional, Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_admin_user, verify_studio_password
from app.schemas import (
    StoryTemplateCreate,
    StoryTemplateUpdate,
    StoryTemplatePublic,
    StoryGenerationRequest,
    StoryTemplatePage,
)
from app.services import (
    get_db_service,
    get_tofula_service,
    DatabaseService,
    TofuulaService,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/studio", tags=["studio"])


@router.post("/stories/generate", response_model=StoryTemplatePublic)
async def generate_story(
    request: StoryGenerationRequest,
    admin_id: Annotated[str, Depends(get_admin_user)],
    tofula: Annotated[TofuulaService, Depends(get_tofula_service)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
    _: Annotated[bool, Depends(verify_studio_password)] = True,
):
    """
    Generate a new story using the Tofula pipeline and save it as a draft template.
    
    This uses the complete Tofula pipeline with:
    - Gemini 2.0 Flash for story generation
    - Story outline, draft, polish, and moderation
    - Illustration prompt generation
    - Image generation with Gemini 2.5 Flash Image
    
    The generated story is automatically saved as a draft template
    that can be reviewed, edited, and approved.
    """
    logger.info(f"Admin {admin_id} generating story: {request.themes}")
    
    try:
        # Step 1: Generate story using full Tofula pipeline
        story_output = tofula.generate_full_story_for_studio(request)
        logger.info(f"Story generated successfully: {story_output.title}")
        
        # Step 2: Convert StoryOutput to template pages
        pages = tofula.convert_story_output_to_template_pages(story_output)
        logger.info(f"Converted to {len(pages)} template pages")
        
        # Step 3: Save as a draft template in database
        template_data = StoryTemplateCreate(
            title=story_output.title,
            description=story_output.metadata.get('theme', ''),
            themes=request.themes,
            age_range=f"{request.age}-{request.age+2}",
            culture=request.culture or "universal",
            moral=request.moral,
            pages=pages,
        )
        
        db_template = db.create_story_template(template_data)
        logger.info(f"Story saved as draft template: {db_template['id']}")
        
        return StoryTemplatePublic.model_validate(db_template)
        
    except Exception as e:
        logger.error(f"Error generating story: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate story: {str(e)}"
        )


@router.post("/stories", response_model=StoryTemplatePublic, status_code=status.HTTP_201_CREATED)
async def create_story_template(
    template: StoryTemplateCreate,
    admin_id: Annotated[str, Depends(get_admin_user)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
):
    """
    Save a story as a template in the database.
    
    This creates a new template that can be personalized by users.
    """
    logger.info(f"Admin {admin_id} creating story template: {template.title}")
    
    try:
        db_template = db.create_story_template(template)
        return StoryTemplatePublic.model_validate(db_template)
    except Exception as e:
        logger.error(f"Error creating story template: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create story template: {str(e)}"
        )


@router.get("/stories", response_model=List[StoryTemplatePublic])
async def list_story_templates(
    admin_id: Annotated[str, Depends(get_admin_user)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    """
    List all story templates (including drafts).
    
    Admins can see all templates regardless of status.
    """
    logger.info(f"Admin {admin_id} listing story templates")
    
    templates = db.list_story_templates(status=status_filter, skip=skip, limit=limit)
    return [StoryTemplatePublic.model_validate(t) for t in templates]


@router.get("/stories/{template_id}", response_model=StoryTemplatePublic)
async def get_story_template(
    template_id: str,
    admin_id: Annotated[str, Depends(get_admin_user)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
):
    """Get a single story template by ID."""
    template = db.get_story_template(template_id)
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story template not found"
        )
    
    return StoryTemplatePublic.model_validate(template)


@router.patch("/stories/{template_id}", response_model=StoryTemplatePublic)
async def update_story_template(
    template_id: str,
    update: StoryTemplateUpdate,
    admin_id: Annotated[str, Depends(get_admin_user)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
):
    """
    Update a story template.
    
    Allows editing text, prompts, metadata, etc.
    """
    logger.info(f"Admin {admin_id} updating story template {template_id}")
    
    template = db.update_story_template(template_id, update)
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story template not found"
        )
    
    return StoryTemplatePublic.model_validate(template)


@router.post("/stories/{template_id}/approve", response_model=StoryTemplatePublic)
async def approve_story_template(
    template_id: str,
    admin_id: Annotated[str, Depends(get_admin_user)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
):
    """
    Approve a story template for public use.
    
    Once approved, the template becomes visible in the public catalog.
    """
    logger.info(f"Admin {admin_id} approving story template {template_id}")
    
    template = db.approve_story_template(template_id)
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story template not found"
        )
    
    return StoryTemplatePublic.model_validate(template)


@router.delete("/stories/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story_template(
    template_id: str,
    admin_id: Annotated[str, Depends(get_admin_user)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
):
    """Delete a story template."""
    logger.info(f"Admin {admin_id} deleting story template {template_id}")
    
    success = db.delete_story_template(template_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story template not found"
        )
    
    return None
