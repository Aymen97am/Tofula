import logging
import os
from typing import Dict

from google.genai import types as genai_types
from google.genai.types import GenerateContentConfig, Modality
from langchain_core.output_parsers import PydanticOutputParser, StrOutputParser

from backend.tofula_pipeline.src.llm_factory import get_chat_llm, get_image_client, build_chain
from backend.tofula_pipeline.src.structures import (
    IllustrationPrompts,
    ModerationResult,
    StoryOutline,
    StoryOutput,
    StoryTemplate,
)

logger = logging.getLogger(__name__)


class StoryGenerationPipeline:
    """
    LangChain pipeline for generating children's stories with:
    1. Template selection
    2. Outline generation
    3. Draft writing
    4. Polish/rewrite
    5. Content moderation
    6. Illustration prompt generation
    """

    def __init__(
        self,
        story_model: str = "gemini-2.0-flash-exp",
        moderation_model: str = "gemini-2.0-flash-lite",
        polish_model: str = "gemini-2.0-flash-exp",
        image_model: str = "gemini-2.5-flash-image",
    ):
        """Initialize the pipeline with specified models."""
        self.story_llm = get_chat_llm(story_model, temperature=0.7)
        self.moderation_llm = get_chat_llm(moderation_model, temperature=0.0)
        self.polish_llm = get_chat_llm(polish_model, temperature=0.4)
        self.image_model = image_model

        # Initialize parsers
        self.template_parser = PydanticOutputParser(pydantic_object=StoryTemplate)
        self.outline_parser = PydanticOutputParser(pydantic_object=StoryOutline)
        self.illustration_parser = PydanticOutputParser(
            pydantic_object=IllustrationPrompts
        )
        self.moderation_parser = PydanticOutputParser(pydantic_object=ModerationResult)

        # Build pipeline chains
        self.template_chain = self._create_template_chain()
        self.outline_chain = self._create_outline_chain()
        self.draft_chain = self._create_draft_chain()
        self.polish_chain = self._create_polish_chain()
        self.moderation_chain = self._create_moderation_chain()
        self.illustration_chain = self._create_illustration_chain()

    # --- Chain builders -------------------------------------------------

    def _create_template_chain(self):
        """Chain to generate story template from themes."""
        return build_chain(
            system_prompt_name="template",
            user_prompt_name="template",
            llm=self.story_llm,
            pre_fn=lambda x: {
                **x,
                "format_instructions": self.template_parser.get_format_instructions(),
            },
            parser=self.template_parser,
        )

    def _create_outline_chain(self):
        """Chain to create structured outline from template."""
        return build_chain(
            system_prompt_name="outline",
            user_prompt_name="outline",
            llm=self.story_llm,
            pre_fn=lambda x: {
                **x,
                "theme": x["template"].theme,
                "beats": ", ".join(x["template"].beats),
                "format_instructions": self.outline_parser.get_format_instructions(),
            },
            parser=self.outline_parser,
        )

    def _create_draft_chain(self):
        """Chain to expand outline into full prose."""
        return build_chain(
            system_prompt_name="draft",
            user_prompt_name="draft",
            llm=self.story_llm,
            pre_fn=lambda x: {
                **x,
                "title": x["outline"].title,
                "beats": "\n".join(
                    [f"Page {b.page}: {b.summary}" for b in x["outline"].beats]
                ),
            },
            parser=StrOutputParser(),
        )

    def _create_polish_chain(self):
        """Chain to polish and adjust story to reading level."""
        return build_chain(
            system_prompt_name="polish",
            user_prompt_name="polish",
            llm=self.polish_llm,
            parser=StrOutputParser(),
        )

    def _create_moderation_chain(self):
        """Chain to check content safety."""
        return build_chain(
            system_prompt_name="moderation",
            user_prompt_name="moderation",
            llm=self.moderation_llm,
            pre_fn=lambda x: {
                "story": x["polished"],
                "format_instructions": self.moderation_parser.get_format_instructions(),
            },
            parser=self.moderation_parser,
        )

    def _create_illustration_chain(self):
        """Chain to generate illustration prompts."""
        return build_chain(
            system_prompt_name="illustration",
            user_prompt_name="illustration",
            llm=self.story_llm,
            pre_fn=lambda x: {
                "story": x["polished"],
                "style": x["style"],
                "num_pages": len(x["outline"].beats),
                "format_instructions": self.illustration_parser.get_format_instructions(),
            },
            parser=self.illustration_parser,
        )

    # --- Illustration images --------------------------------------------

    def _generate_illustration_images(
        self,
        illustration_prompts: IllustrationPrompts,
        story_summary: str,
        output_dir: str = "temp",
    ) -> Dict[int, str]:
        """
        Generate illustration images from prompts using Gemini image model.

        Returns a mapping of page -> image URI (e.g. 'image://temp/page_1.png').
        """

        client, model_name = get_image_client(self.image_model)
        os.makedirs(output_dir, exist_ok=True)

        images: Dict[int, str] = {}
        # Keep track of the last few generated images so we can feed them back
        # into subsequent image generation calls for visual consistency.
        recent_image_paths = []

        for prompt in illustration_prompts.prompts:
            # Build a richer prompt that includes:
            # - High-level story summary
            # - Explicit instructions to keep characters visually consistent
            prompt_lines = [
                "High-level story summary:",
                story_summary,
                "",
                "Current page illustration instructions:",
                prompt.prompt,
                "",
                (
                    "Make sure all recurring characters, especially the main child, "
                    "look visually consistent with the previous illustrations: "
                    "same face, hairstyle, skin tone, body shape, and clothing style. "
                    "Do NOT change the main character's identity or appearance."
                ),
            ]

            full_prompt = "\n".join(prompt_lines)

            # Build multimodal contents: last two images (if any) + text prompt
            contents = []
            for prev_path in recent_image_paths[-2:]:
                try:
                    with open(prev_path, "rb") as img_f:
                        contents.append(
                            genai_types.Part.from_bytes(
                                data=img_f.read(), mime_type="image/png"
                            )
                        )
                except Exception as e:
                    logger.warning(
                        "Failed to load previous illustration %s for consistency: %s",
                        prev_path,
                        str(e),
                    )

            contents.append(full_prompt)

            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=GenerateContentConfig(
                        response_modalities=[Modality.IMAGE],
                    ),
                )
            except Exception as e:
                logger.warning(
                    "Image generation failed for page %s: %s", prompt.page, str(e)
                )
                continue

            image_bytes = None
            # Extract first inline image, if any
            try:
                if response.candidates:
                    for candidate in response.candidates:
                        if candidate.content and candidate.content.parts:
                            for part in candidate.content.parts:
                                inline = getattr(part, "inline_data", None)
                                if inline and getattr(inline, "data", None):
                                    image_bytes = inline.data
                                    break
                        if image_bytes:
                            break
            except Exception as e:
                logger.warning(
                    "Failed to parse image bytes for page %s: %s", prompt.page, str(e)
                )

            if not image_bytes:
                logger.warning(
                    "No image bytes returned for page %s from Gemini image model",
                    prompt.page,
                )
                continue

            filename = f"page_{prompt.page}.png"
            file_path = os.path.join(output_dir, filename)
            try:
                with open(file_path, "wb") as f:
                    f.write(image_bytes)
                images[prompt.page] = f"image://{file_path}"
                logger.info(
                    "Saved illustration for page %s to %s", prompt.page, file_path
                )
                # Remember this page's image path for future consistency
                recent_image_paths.append(file_path)
            except Exception as e:
                logger.warning(
                    "Failed to save image for page %s to %s: %s",
                    prompt.page,
                    file_path,
                    str(e),
                )

        return images

    # --- Public API -----------------------------------------------------

    def generate_story(
        self,
        themes: str,
        child_name: str,
        age: int,
        reading_level: str,
        length: int,
        tone: str,
        style: str,
        generate_tts: bool = False,
    ) -> StoryOutput:
        """
        Generate a complete children's story.

        Args:
            themes: Story themes to choose from
            child_name: Name of the child (main character)
            age: Child's age
            reading_level: Target reading level
            length: Story length in pages
            tone: Story tone (e.g., 'adventurous', 'calm')
            style: Illustration art style
            generate_tts: Whether to generate audio narration

        Returns:
            StoryOutput with complete story and assets
        """
        try:
            # Step 1: Generate template
            logger.info("Step 1: Generating story template...")
            template = self.template_chain.invoke({"themes": themes, "age": age})
            logger.info("Template selected: %s", template.theme)

            # Step 2: Create outline
            logger.info("Step 2: Creating story outline...")
            outline = self.outline_chain.invoke(
                {
                    "template": template,
                    "child_name": child_name,
                    "reading_level": reading_level,
                    "length": length,
                    "tone": tone,
                }
            )
            logger.info("Outline created: %s", outline.title)

            # Step 3: Write draft
            logger.info("Step 3: Writing draft...")
            draft = self.draft_chain.invoke(
                {
                    "outline": outline,
                    "child_name": child_name,
                    "length": length,
                    "reading_level": reading_level,
                }
            )

            # Step 4: Polish story
            logger.info("Step 4: Polishing story...")
            polished = self.polish_chain.invoke(
                {
                    "draft": draft,
                    "reading_level": reading_level,
                    "tone": tone,
                }
            )

            # Step 5: Moderation check
            logger.info("Step 5: Running content moderation...")
            moderation_result = self.moderation_chain.invoke({"polished": polished})

            if not moderation_result.is_safe:
                raise ValueError(f"Story failed moderation: {moderation_result.reason}")
            logger.info("✓ Story passed moderation")

            # Step 6: Generate illustration prompts
            logger.info("Step 6: Generating illustration prompts...")
            illustration_prompts = self.illustration_chain.invoke(
                {
                    "polished": polished,
                    "style": style,
                    "outline": outline,
                }
            )
            # Store prompts as simple mapping for downstream consumers (e.g., PDF)
            illustration_prompt_map = {
                p.page: p.prompt for p in illustration_prompts.prompts
            }

            # High-level story summary used to help keep illustrations consistent
            story_summary = "; ".join(beat.summary for beat in outline.beats)

            logger.info("Step 6b: Generating illustration images with Gemini...")
            illustrations = self._generate_illustration_images(
                illustration_prompts,
                story_summary=story_summary,
                output_dir="temp",
            )

            # Step 7: Optional TTS
            audio = None
            if generate_tts:
                logger.info("Step 7: Generating audio narration...")
                audio = "tts://audio/story_narration.mp3"

            # Assemble output
            output = StoryOutput(
                title=outline.title,
                outline=outline,
                draft=draft,
                story_final=polished,
                illustrations=illustrations,
                audio=audio,
                metadata={
                    "reading_level": reading_level,
                    "tone": tone,
                    "theme": template.theme,
                    "length": length,
                    "illustration_prompts": illustration_prompt_map,
                },
            )

            logger.info("✓ Story generation complete!")
            return output

        except Exception as e:
            logger.error("Error in story generation: %s", str(e))
            raise
