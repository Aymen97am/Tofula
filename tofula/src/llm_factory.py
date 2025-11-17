import logging
import os
from typing import Callable, Optional, Tuple, Any

from google import genai
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

from tofula.src.config import MODEL_CONFIGS
from tofula.src.prompt_loader import load_prompt

logger = logging.getLogger(__name__)


def get_chat_llm(model: str, temperature: float):
    """
    Factory for chat LLMs used by the story pipeline.

    Decides which provider to use based on MODEL_CONFIGS and returns
    an initialized LangChain chat model.
    """
    if model not in MODEL_CONFIGS:
        raise ValueError(
            f"Model {model} not supported. "
            f"Available models: {list(MODEL_CONFIGS.keys())}"
        )

    provider = MODEL_CONFIGS[model]["provider"]
    logger.info("Setting up %s model: %s", provider, model)

    if provider == "google":
        return ChatGoogleGenerativeAI(
            model=model,
            temperature=temperature,
            google_api_key=os.getenv("GOOGLE_API_KEY"),
        )
    elif provider == "huggingface":
        llm = HuggingFaceEndpoint(
            repo_id=model,
            temperature=temperature,
            huggingfacehub_api_token=os.getenv("HF_TOKEN"),
        )
        return ChatHuggingFace(llm=llm)

    raise ValueError(f"Unknown provider for chat model: {provider}")


def get_image_client(model: str) -> Tuple[genai.Client, str]:
    """
    Factory for image generation.

    Returns a (genai.Client, model_name) tuple validated against MODEL_CONFIGS.
    """
    if model not in MODEL_CONFIGS:
        raise ValueError(
            f"Model {model} not supported. "
            f"Available models: {list(MODEL_CONFIGS.keys())}"
        )

    provider = MODEL_CONFIGS[model]["provider"]
    if provider != "google-image":
        raise ValueError(
            f"Model {model} is not configured as an image model (provider={provider})."
        )

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is required for image generation.")

    logger.info("Setting up Google image model: %s", model)
    client = genai.Client(api_key=api_key)
    return client, model


def build_chain(
    *,
    system_prompt_name: str,
    user_prompt_name: str,
    llm: Any,
    pre_fn: Optional[Callable[[dict], dict]] = None,
    parser: Optional[Any] = None,
):
    """
    Generic helper to build a LangChain chat chain:

    [optional RunnableLambda(pre_fn)] -> ChatPromptTemplate -> llm -> [optional parser]
    """
    system_prompt = load_prompt("system", system_prompt_name)
    user_prompt = load_prompt("user", user_prompt_name)

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("user", user_prompt),
        ]
    )

    chain = prompt | llm
    if parser is not None:
        chain = chain | parser
    if pre_fn is not None:
        chain = RunnableLambda(pre_fn) | chain

    return chain
