"""
Database service for managing story templates and instances.
"""
from typing import List, Optional
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
import uuid

from app.core.config import get_settings
from app.models import Base, StoryTemplate, UserStoryInstance, StoryStatus
from app.schemas import (
    StoryTemplateCreate,
    StoryTemplateUpdate,
    PersonalizeStoryRequest,
)


class DatabaseService:
    """Service for database operations."""
    
    def __init__(self):
        settings = get_settings()
        self.engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
        )
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)
    
    def get_session(self) -> Session:
        """Get a database session."""
        return self.SessionLocal()
    
    # Story Template operations
    
    def create_story_template(
        self, template_data: StoryTemplateCreate
    ) -> StoryTemplate:
        """Create a new story template."""
        with self.get_session() as session:
            template = StoryTemplate(
                id=str(uuid.uuid4()),
                title=template_data.title,
                description=template_data.description,
                cover_image_url=template_data.cover_image_url,
                themes=template_data.themes,
                age_range=template_data.age_range,
                culture=template_data.culture,
                moral=template_data.moral,
                pages=[page.model_dump() for page in template_data.pages],
                status=StoryStatus.DRAFT.value,
            )
            session.add(template)
            session.commit()
            session.refresh(template)
            return template
    
    def get_story_template(self, template_id: str) -> Optional[StoryTemplate]:
        """Get a story template by ID."""
        with self.get_session() as session:
            stmt = select(StoryTemplate).where(StoryTemplate.id == template_id)
            return session.scalar(stmt)
    
    def list_story_templates(
        self, status: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> List[StoryTemplate]:
        """List story templates with optional status filter."""
        with self.get_session() as session:
            stmt = select(StoryTemplate)
            if status:
                stmt = stmt.where(StoryTemplate.status == status)
            stmt = stmt.offset(skip).limit(limit).order_by(StoryTemplate.created_at.desc())
            return list(session.scalars(stmt).all())
    
    def update_story_template(
        self, template_id: str, update_data: StoryTemplateUpdate
    ) -> Optional[StoryTemplate]:
        """Update a story template."""
        with self.get_session() as session:
            stmt = select(StoryTemplate).where(StoryTemplate.id == template_id)
            template = session.scalar(stmt)
            if not template:
                return None
            
            update_dict = update_data.model_dump(exclude_unset=True)
            if "pages" in update_dict:
                update_dict["pages"] = [
                    page.model_dump() if hasattr(page, "model_dump") else page
                    for page in update_dict["pages"]
                ]
            
            for key, value in update_dict.items():
                setattr(template, key, value)
            
            session.commit()
            session.refresh(template)
            return template
    
    def approve_story_template(self, template_id: str) -> Optional[StoryTemplate]:
        """Approve a story template."""
        with self.get_session() as session:
            stmt = select(StoryTemplate).where(StoryTemplate.id == template_id)
            template = session.scalar(stmt)
            if not template:
                return None
            
            template.status = StoryStatus.APPROVED.value
            session.commit()
            session.refresh(template)
            return template
    
    def delete_story_template(self, template_id: str) -> bool:
        """Delete a story template."""
        with self.get_session() as session:
            stmt = select(StoryTemplate).where(StoryTemplate.id == template_id)
            template = session.scalar(stmt)
            if not template:
                return False
            
            session.delete(template)
            session.commit()
            return True
    
    # User Story Instance operations
    
    def create_user_story_instance(
        self,
        user_id: str,
        template_id: str,
        request: PersonalizeStoryRequest,
        personalized_pages: dict,
        illustration_urls: dict = None,
        pdf_url: str = None,
        audio_url: str = None,
    ) -> UserStoryInstance:
        """Create a new personalized story instance."""
        with self.get_session() as session:
            instance = UserStoryInstance(
                id=str(uuid.uuid4()),
                user_id=user_id,
                template_id=template_id,
                child_name=request.child_name,
                age=request.age,
                reading_level=request.reading_level,
                tone=request.tone,
                language=request.language,
                appearance=request.appearance.model_dump(),
                personalized_pages=personalized_pages,
                illustration_urls=illustration_urls or {},
                pdf_url=pdf_url,
                audio_url=audio_url,
            )
            session.add(instance)
            session.commit()
            session.refresh(instance)
            return instance
    
    def get_user_story_instance(
        self, instance_id: str, user_id: str
    ) -> Optional[UserStoryInstance]:
        """Get a user's story instance by ID."""
        with self.get_session() as session:
            stmt = select(UserStoryInstance).where(
                UserStoryInstance.id == instance_id,
                UserStoryInstance.user_id == user_id,
            )
            return session.scalar(stmt)
    
    def list_user_story_instances(
        self, user_id: str, skip: int = 0, limit: int = 100
    ) -> List[UserStoryInstance]:
        """List all story instances for a user."""
        with self.get_session() as session:
            stmt = (
                select(UserStoryInstance)
                .where(UserStoryInstance.user_id == user_id)
                .offset(skip)
                .limit(limit)
                .order_by(UserStoryInstance.created_at.desc())
            )
            return list(session.scalars(stmt).all())


# Global database service instance
_db_service: Optional[DatabaseService] = None


def get_db_service() -> DatabaseService:
    """Get the global database service instance."""
    global _db_service
    if _db_service is None:
        _db_service = DatabaseService()
    return _db_service
