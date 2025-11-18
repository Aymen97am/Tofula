import os
import logging

from backend.tofula_pipeline.src.structures import StoryOutput


def _wrap_text(
    text: str,
    canvas_obj,
    max_width: float,
    font_name: str = "Helvetica",
    font_size: int = 12,
) -> list[str]:
    """
    Simple word-wrapping helper for ReportLab canvas text.

    Returns a list of lines that fit within max_width.
    """
    words = text.split()
    if not words:
        return [""]

    lines: list[str] = []
    current_line = words[0]

    for word in words[1:]:
        candidate = current_line + " " + word
        if canvas_obj.stringWidth(candidate, font_name, font_size) <= max_width:
            current_line = candidate
        else:
            lines.append(current_line)
            current_line = word

    lines.append(current_line)
    return lines


def save_story_to_pdf(story: StoryOutput, pdf_path: str) -> None:
    """
    Save the story as a PDF, visualizing each page's storyline with its illustration.

    - Cover page with title and basic metadata.
    - One PDF page per story beat:
        - Page number and summary text.
        - If an illustration image exists on disk, it is embedded.
        - Otherwise, the illustration prompt text is shown.
    """

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.units import inch
        from reportlab.pdfgen import canvas
    except ImportError as exc:
        raise ImportError(
            "reportlab is required for PDF export. Install it with "
            "`pip install reportlab`."
        ) from exc

    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    margin = 0.75 * inch

    # Cover page
    c.setFont("Helvetica-Bold", 22)
    y = height - margin - 0.5 * inch
    c.drawString(margin, y, story.title)

    c.setFont("Helvetica", 12)
    y -= 0.5 * inch
    meta_lines = []
    if "theme" in story.metadata:
        meta_lines.append(f"Theme: {story.metadata['theme']}")
    if "tone" in story.metadata:
        meta_lines.append(f"Tone: {story.metadata['tone']}")
    if "reading_level" in story.metadata:
        meta_lines.append(f"Reading level: {story.metadata['reading_level']}")
    if "length" in story.metadata:
        meta_lines.append(f"Pages (target): {story.metadata['length']}")

    for line in meta_lines:
        c.drawString(margin, y, line)
        y -= 0.25 * inch

    c.showPage()

    # Page-by-page content
    for beat in story.outline.beats:
        c.setFont("Helvetica-Bold", 16)
        y = height - margin
        c.drawString(margin, y, f"Page {beat.page}")

        # Storyline / summary (wrapped to page width)
        y -= 0.4 * inch
        font_name = "Helvetica"
        font_size = 12
        c.setFont(font_name, font_size)
        max_text_width = width - 2 * margin
        wrapped_lines = _wrap_text(
            beat.summary,
            canvas_obj=c,
            max_width=max_text_width,
            font_name=font_name,
            font_size=font_size,
        )
        text_obj = c.beginText(margin, y)
        for line in wrapped_lines:
            text_obj.textLine(line)
        c.drawText(text_obj)

        # Illustration: try to embed image if file exists, otherwise show prompt
        img_path = None
        if story.illustrations and beat.page in story.illustrations:
            uri = story.illustrations[beat.page]
            if isinstance(uri, str):
                # Support "image://..." URIs or plain paths
                if uri.startswith("image://"):
                    candidate = uri[len("image://") :]
                else:
                    candidate = uri
                if os.path.exists(candidate):
                    img_path = candidate

        # Reserve some space at bottom for image / prompt
        available_height_for_image = height * 0.8
        image_bottom = margin

        if img_path:
            img_width = width - 2 * margin
            img_height = available_height_for_image
            try:
                c.drawImage(
                    img_path,
                    margin,
                    image_bottom,
                    width=img_width,
                    height=img_height,
                    preserveAspectRatio=True,
                    anchor="sw",
                )
            except Exception as img_err:
                # Fallback to prompt text if image fails
                logging.warning(
                    "Failed to draw image for page %s (%s): %s",
                    beat.page,
                    img_path,
                    img_err,
                )
                img_path = None

        if not img_path:
            # Log the problem and draw a big red flag placeholder instead of the image
            logging.warning(
                "Could not find illustration image on disk for page %s. "
                "Rendering a red missing-image flag in the PDF instead.",
                beat.page,
            )

            # Draw red rectangle in the image area
            c.setFillColorRGB(1, 0, 0)  # red
            c.rect(
                margin,
                image_bottom,
                width - 2 * margin,
                available_height_for_image,
                fill=1,
                stroke=0,
            )

            # Draw warning text on top of the rectangle
            c.setFillColorRGB(1, 1, 1)  # white text
            c.setFont("Helvetica-Bold", 18)
            text_y = image_bottom + available_height_for_image / 2
            c.drawCentredString(
                width / 2,
                text_y,
                "ILLUSTRATION MISSING",
            )

            # Reset fill color back to black for subsequent content
            c.setFillColorRGB(0, 0, 0)

        c.showPage()

    c.save()
