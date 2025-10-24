from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path

WORK_DIR = Path(__file__).parent / "projects"
WORK_DIR.mkdir(exist_ok=True)


class Settings(BaseSettings):
    """
    Provides structured access to API keys, database config, and other agent-level settings.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    GROQ_API_KEY: str = Field(..., description="Groq API Key")
    CHECKPOINT: str = Field(..., description="Checkpointer")
    DEBUG: bool = Field(False, description="Run in debug mode")
    AGENT_NAME: str = Field("AutoTest", description="Name of the AI Agent")
    MODEL: str = Field("llama-3.1-8b-instant", description="Default LLM model to use")


settings = Settings()
