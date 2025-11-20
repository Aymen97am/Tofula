"""
Tofula service for wrapping the existing story generation pipeline.
"""

import os
import tempfile
import logging
from typing import Dict, Optional

from tofula_pipeline.src.pipeline import StoryGenerationPipeline
from tofula_pipeline.src.pdf_export import save_story_to_pdf
from tofula_pipeline.src.structures import StoryOutput

from app.core.config import get_settings
from app.schemas import (
    StoryGenerationRequest,
    PersonalizeStoryRequest,
    StoryTemplatePage,
)
from app.models import StoryTemplate

logger = logging.getLogger(__name__)


class TofuulaService:
    """Service for generating stories using the Tofula pipeline."""

    def __init__(self):
        settings = get_settings()
        self.pipeline = StoryGenerationPipeline(
            story_model=settings.STORY_MODEL,
            moderation_model=settings.MODERATION_MODEL,
            polish_model=settings.POLISH_MODEL,
            image_model=settings.IMAGE_MODEL,
        )

    def generate_full_story_for_studio(
        self, request: StoryGenerationRequest
    ) -> StoryOutput:
        """
        Generate a complete story for Studio using the existing pipeline.

        This creates a new story from scratch that can then be curated
        and saved as a template.
        """
        logger.info(f"Generating story for Studio: {request.themes}")

        story_output = self.pipeline.generate_story(
            themes=request.themes,
            child_name=request.child_name,
            age=request.age,
            reading_level=request.reading_level,
            length=request.length,
            tone=request.tone,
            style=request.style,
            generate_tts=False,  # Studio doesn't need TTS
        )

        # Add custom extra metadata
        if hasattr(story_output, "metadata") and story_output.metadata:
            story_output.metadata.update(
                {
                    "culture": request.culture,
                    "moral": request.moral,
                }
            )

        return story_output

    def convert_story_output_to_template_pages(
        self, story_output: StoryOutput
    ) -> list[StoryTemplatePage]:
        """
        Convert a StoryOutput into template pages with placeholders.

        This takes the generated story and converts it into a reusable template
        by extracting pages from the outline beats and matching them with
        illustration prompts.
        """
        pages = []

        # Use the outline beats which represent the story pages
        if story_output.outline and hasattr(story_output.outline, "beats"):
            for beat in story_output.outline.beats:
                page_num = beat.page

                # Use the beat summary as the template text
                # Replace the specific child name with a placeholder
                template_text = beat.summary

                # Get illustration prompt from metadata if available
                base_prompt = ""
                if (
                    story_output.metadata
                    and "illustration_prompts" in story_output.metadata
                ):
                    prompts = story_output.metadata["illustration_prompts"]
                    if page_num in prompts:
                        base_prompt = prompts[page_num]

                pages.append(
                    StoryTemplatePage(
                        page_number=page_num,
                        template_text=template_text,
                        base_prompt=base_prompt,
                    )
                )
        else:
            # Fallback: split the final story into pages
            story_lines = story_output.story_final.split("\n\n")

            for i, line in enumerate(story_lines, start=1):
                if not line.strip():
                    continue

                # Get illustration prompt if available
                base_prompt = ""
                if story_output.illustrations and i in story_output.illustrations:
                    base_prompt = story_output.illustrations[i]

                pages.append(
                    StoryTemplatePage(
                        page_number=i,
                        template_text=line.strip(),
                        base_prompt=base_prompt,
                    )
                )

        return pages

    def generate_personalized_story_from_template(
        self,
        template: StoryTemplate,
        request: PersonalizeStoryRequest,
    ) -> Dict:
        """
        Generate a personalized story from a template.

        This replaces placeholders and adjusts illustration prompts based on
        the child's appearance.
        """
        logger.info(f"Personalizing story {template.id} for {request.child_name}")

        personalized_pages = []

        # Personalize each page
        for page_data in template.pages:
            page_num = page_data["page_number"]
            template_text = page_data["template_text"]
            base_prompt = page_data.get("base_prompt", "")

            # Replace placeholders
            personalized_text = self._replace_placeholders(
                template_text,
                child_name=request.child_name,
                age=request.age,
            )

            # Adjust illustration prompt with appearance
            personalized_prompt = self._personalize_prompt(
                base_prompt, request.appearance
            )

            personalized_pages.append(
                {
                    "page_number": page_num,
                    "text": personalized_text,
                    "prompt": personalized_prompt,
                }
            )

        return {
            "pages": personalized_pages,
            "title": template.title,
        }

    def generate_illustrations_for_pages(self, pages: list[dict]) -> Dict[int, bytes]:
        """
        Generate illustrations for personalized pages.

        Returns a dict mapping page_number to image bytes.
        """
        illustrations = {}

        # Use the image client from the pipeline
        image_client = (
            self.pipeline.image_client
            if hasattr(self.pipeline, "image_client")
            else None
        )

        if not image_client:
            # Fall back to creating a new client
            from tofula_pipeline.src.llm_factory import get_image_client

            settings = get_settings()
            image_client = get_image_client(settings.IMAGE_MODEL)

        for page in pages:
            page_num = page["page_number"]
            prompt = page.get("prompt", "")

            if not prompt:
                continue

            try:
                logger.info(f"Generating illustration for page {page_num}")

                # Generate image (this depends on the image client implementation)
                # This is a placeholder - adjust based on actual image client API
                image_data = self._generate_image(image_client, prompt)

                if image_data:
                    illustrations[page_num] = image_data
            except Exception as e:
                logger.error(
                    f"Failed to generate illustration for page {page_num}: {e}"
                )

        return illustrations

    def create_pdf_from_pages(
        self, title: str, pages: list[dict], illustration_urls: Dict[int, str] = None
    ) -> str:
        """
        Create a PDF from personalized pages.

        Returns the path to the generated PDF.
        """
        # Create a StoryOutput-like object for the PDF export
        # This is simplified - you may need to adapt based on actual requirements

        story_text = "\n\n".join([page["text"] for page in pages])

        # Create a temporary StoryOutput
        from tofula_pipeline.src.structures import StoryOutline, StoryBeat

        outline = StoryOutline(
            title=title,
            beats=[
                StoryBeat(page=page["page_number"], summary=page["text"][:100])
                for page in pages
            ],
            vocabulary_targets=[],
        )

        story_output = StoryOutput(
            title=title,
            outline=outline,
            draft=story_text,
            story_final=story_text,
            illustrations=None,  # TODO: Add illustration URLs if needed
            metadata={},
        )

        # Generate PDF in temp directory
        with tempfile.TemporaryDirectory() as tmpdir:
            pdf_path = os.path.join(tmpdir, f"{title.replace(' ', '_')}.pdf")
            save_story_to_pdf(story_output, pdf_path)

            # Read the PDF data
            with open(pdf_path, "rb") as f:
                pdf_data = f.read()

            # Save to a new temp file that won't be deleted
            final_pdf_path = tempfile.mktemp(suffix=".pdf")
            with open(final_pdf_path, "wb") as f:
                f.write(pdf_data)

            return final_pdf_path

    def _replace_placeholders(self, text: str, child_name: str, age: int) -> str:
        """Replace placeholders in template text."""
        replacements = {
            "{child_name}": child_name,
            "{age}": str(age),
        }

        for placeholder, value in replacements.items():
            text = text.replace(placeholder, value)

        return text

    def _personalize_prompt(self, base_prompt: str, appearance) -> str:
        """Personalize an illustration prompt with child's appearance."""
        if not base_prompt:
            return ""

        # Add appearance description
        appearance_desc = (
            f"A child with {appearance.skin_tone} skin, "
            f"{appearance.hair_color} {appearance.hair_style} hair, "
            f"{appearance.eye_color} eyes, "
            f"wearing {appearance.clothing}. "
        )

        # Prepend or append appearance to base prompt
        personalized = f"{appearance_desc}{base_prompt}"

        return personalized

    def _generate_image(self, image_client, prompt: str) -> Optional[bytes]:
        """Generate an image from a prompt."""
        try:
            # This is a placeholder implementation
            # Adjust based on the actual image client API

            # For now, return None (no image generation)
            # In production, this should call the actual image generation API
            logger.warning("Image generation not fully implemented")
            return None
        except Exception as e:
            logger.error(f"Error generating image: {e}")
            return None


# Global service instance
_tofula_service: Optional[TofuulaService] = None


def get_tofula_service() -> TofuulaService:
    """Get the global Tofula service instance."""
    global _tofula_service
    if _tofula_service is None:
        _tofula_service = TofuulaService()
    return _tofula_service
