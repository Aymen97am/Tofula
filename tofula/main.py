"""
Entry point for the Tofula story generation pipeline.

This module wires together:
  - configuration and environment
  - the StoryGenerationPipeline
  - PDF export
and runs a single demo story generation.
"""

import os
import logging
from datetime import datetime
from argparse import ArgumentParser
from dotenv import load_dotenv

from tofula.src.pdf_export import save_story_to_pdf
from tofula.src.pipeline import StoryGenerationPipeline


# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def _parse_args():
    parser = ArgumentParser(description="Generate a personalized children's story.")
    parser.add_argument(
        "--themes",
        default="loyalty, sacrifice, endurance",
        help="Comma-separated list of themes for the story.",
    )
    parser.add_argument(
        "--child-name",
        default="Bilal",
        help="Name of the child (main character).",
    )
    parser.add_argument(
        "--age",
        type=int,
        default=10,
        help="Age of the child.",
    )
    parser.add_argument(
        "--reading-level",
        default="elementary",
        help="Target reading level (e.g. 'kindergarten', 'elementary').",
    )
    parser.add_argument(
        "--length",
        type=int,
        default=8,
        help="Target story length in pages.",
    )
    parser.add_argument(
        "--tone",
        default="courageous and uplifting",
        help="Tone of the story.",
    )
    parser.add_argument(
        "--style",
        default="watercolor, bright colors, Middle Eastern patterns, soft watercolor",
        help="Art style description for illustrations.",
    )
    return parser.parse_args()


def main():
    """CLI entry point for testing the story generation pipeline."""
    # Load environment variables once at startup
    load_dotenv()

    args = _parse_args()
    logger.info("Starting story generation test...")

    # Initialize pipeline
    pipeline = StoryGenerationPipeline(
        story_model="gemini-2.0-flash-exp",
        moderation_model="gemini-2.0-flash-lite",
        polish_model="gemini-2.0-flash-exp",
        image_model="gemini-2.5-flash-image",
    )

    test_input = {
        "themes": args.themes,
        "child_name": args.child_name,
        "age": args.age,
        "reading_level": args.reading_level,
        "length": args.length,
        "tone": args.tone,
        "style": args.style,
        "generate_tts": False,
    }

    logger.info(f"Test input: {test_input}")

    # Generate story
    story = pipeline.generate_story(**test_input)

    # Optional: save to PDF to visualize pages with illustrations
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    pdf_dir = os.path.join(".", "generated")
    os.makedirs(pdf_dir, exist_ok=True)
    pdf_path = os.path.join(pdf_dir, f"story_{timestamp}.pdf")
    logger.info(f"Saving story and illustrations to PDF: {pdf_path}")

    try:
        save_story_to_pdf(story, pdf_path)
        logger.info("✓ PDF saved successfully")
    except ImportError as e:
        logger.warning(str(e))

    # Display results
    print("\n" + "=" * 60)
    print("STORY GENERATION RESULTS")
    print("=" * 60)
    print(f"\nTitle: {story.title}")
    print(f"\nOutline beats: {len(story.outline.beats)} pages")
    print(f"\nDraft length: {len(story.draft)} characters")
    print(f"\nFinal story length: {len(story.story_final)} characters")
    print(
        f"\nIllustrations: {len(story.illustrations) if story.illustrations else 0} pages"
    )
    print(f"\nVocabulary targets: {', '.join(story.outline.vocabulary_targets)}")
    print("\n" + "=" * 60)
    print("FINAL STORY")
    print("=" * 60)
    print(story.story_final)
    print("\n" + "=" * 60)

    logger.info("✓ Test completed successfully!")


if __name__ == "__main__":
    main()
