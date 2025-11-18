# LLM configuration
MODEL_CONFIGS = {
    "gemini-2.0-flash-exp": {
        "provider": "google",
        "temperature": 0.7,
    },
    "gemini-2.0-flash-lite": {
        "provider": "google",
        "temperature": 0.7,
    },
    "Qwen/Qwen2.5-72B-Instruct": {
        "provider": "huggingface",
        "temperature": 0.7,
    },
    # Image generation model for illustrations
    "gemini-2.5-flash-image": {
        "provider": "google-image",
        "temperature": 0.0,
    },
}
