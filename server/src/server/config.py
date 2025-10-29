from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Project"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI Project Template"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "autotest"

    # Security
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    class Config:
        env_file = "server/.env"
        case_sensitive = True


settings = Settings()
