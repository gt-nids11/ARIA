from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    OPENAI_API_KEY: str
    FRONTEND_URL: str = "https://aria-two-mu.vercel.app"

    class Config:
        env_file = ".env"

settings = Settings()
