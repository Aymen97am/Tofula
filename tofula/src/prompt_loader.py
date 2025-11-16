import os
from pathlib import Path


def _prompts_base_dir() -> Path:
    # src/ -> tofula/
    return Path(__file__).resolve().parents[1] / "prompts"


def load_prompt(role: str, name: str) -> str:
    """
    Load a prompt template from disk.

    Prompts are stored under:
      prompts/system/<name>.txt
      prompts/user/<name>.txt
    """
    if role not in {"system", "user"}:
        raise ValueError("role must be 'system' or 'user'")

    base = _prompts_base_dir()
    path = base / role / f"{name}.txt"

    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path}")

    return path.read_text(encoding="utf-8")


