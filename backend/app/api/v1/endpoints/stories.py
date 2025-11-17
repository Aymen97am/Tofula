"""
Story personalization and user library endpoints.
"""
import logging
import uuid
from typing import List, Annotated

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks

from app.core.dependencies import get_current_user_id
from app.schemas import (
    PersonalizeStoryRequest,
    PersonalizeStoryResponse,
    PersonalizedPage,
    UserStoryInstancePublic,
)
from app.services import (
    get_db_service,
    get_tofula_service,
    get_storage_service,
    DatabaseService,
    TofuulaService,
    StorageService,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/stories", tags=["stories"])


@router.post("/personalize", response_model=PersonalizeStoryResponse)
async def personalize_story(
    request: PersonalizeStoryRequest,
    background_tasks: BackgroundTasks,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
    tofula: Annotated[TofuulaService, Depends(get_tofula_service)],
    storage: Annotated[StorageService, Depends(get_storage_service)],
):
    """
    Personalize a story template for a user.
    
    This creates a new story instance with:
    - Placeholders replaced with child's name, age, etc.
    - Illustration prompts adjusted for child's appearance
    - Optional image generation
    - PDF generation
    """
    logger.info(f"User {user_id} personalizing story {request.story_id} for {request.child_name}")
    
    # Get the template
    template = db.get_story_template(request.story_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story template not found"
        )
    
    try:
        # Personalize the story
        personalized_data = tofula.generate_personalized_story_from_template(
            template, request
        )
        
        personalized_pages = personalized_data["pages"]
        title = personalized_data["title"]
        
        # Generate illustrations if requested
        illustration_urls = {}
        if request.generate_images:
            # This could take a while, so we might want to do it in background
            # For now, we'll do it synchronously for simplicity
            try:
                illustrations_bytes = tofula.generate_illustrations_for_pages(personalized_pages)
                
                # Upload illustrations to storage
                for page_num, image_data in illustrations_bytes.items():
                    filename = f"{user_id}_{request.story_id}_{page_num}.png"
                    url = storage.save_image(image_data, filename)
                    illustration_urls[page_num] = url
            except Exception as e:
                logger.error(f"Error generating illustrations: {e}", exc_info=True)
                # Continue without illustrations
        
        # Generate PDF
        pdf_url = None
        try:
            pdf_path = tofula.create_pdf_from_pages(
                title, personalized_pages, illustration_urls
            )
            
            # Upload PDF to storage
            pdf_filename = f"{user_id}_{request.story_id}_{uuid.uuid4()}.pdf"
            pdf_url = storage.save_pdf(pdf_path, pdf_filename)
        except Exception as e:
            logger.error(f"Error generating PDF: {e}", exc_info=True)
            # Continue without PDF
        
        # Save the instance to database
        instance = db.create_user_story_instance(
            user_id=user_id,
            template_id=request.story_id,
            request=request,
            personalized_pages={"pages": personalized_pages},
            illustration_urls=illustration_urls,
            pdf_url=pdf_url,
        )
        
        # Build response
        pages_response = [
            PersonalizedPage(
                page_number=page["page_number"],
                text=page["text"],
                illustration_url=illustration_urls.get(page["page_number"]),
            )
            for page in personalized_pages
        ]
        
        return PersonalizeStoryResponse(
            instance_id=instance.id,
            template_id=template.id,
            title=title,
            pages=pages_response,
            pdf_url=pdf_url,
            audio_url=None,  # TODO: Implement audio generation
            created_at=instance.created_at,
        )
        
    except Exception as e:
        logger.error(f"Error personalizing story: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to personalize story: {str(e)}"
        )


@router.get("/library", response_model=List[UserStoryInstancePublic])
async def get_user_library(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
    skip: int = 0,
    limit: int = 100,
):
    """
    Get all personalized stories for the current user.
    
    Returns the user's story library.
    """
    logger.info(f"Fetching library for user {user_id}")
    
    instances = db.list_user_story_instances(user_id, skip=skip, limit=limit)
    
    # Enrich with template info
    result = []
    for instance in instances:
        template = db.get_story_template(instance.template_id)
        
        instance_dict = UserStoryInstancePublic.model_validate(instance).model_dump()
        if template:
            instance_dict["template_title"] = template.title
            instance_dict["template_cover_url"] = template.cover_image_url
        
        result.append(UserStoryInstancePublic(**instance_dict))
    
    return result


@router.get("/library/{instance_id}", response_model=UserStoryInstancePublic)
async def get_user_story_instance(
    instance_id: str,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[DatabaseService, Depends(get_db_service)],
):
    """Get a specific personalized story instance."""
    instance = db.get_user_story_instance(instance_id, user_id)
    
    if not instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story instance not found"
        )
    
    # Enrich with template info
    template = db.get_story_template(instance.template_id)
    instance_dict = UserStoryInstancePublic.model_validate(instance).model_dump()
    if template:
        instance_dict["template_title"] = template.title
        instance_dict["template_cover_url"] = template.cover_image_url
    
    return UserStoryInstancePublic(**instance_dict)
