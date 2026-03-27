from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    MONGODB_URL: str = "mongodb://localhost:27017"
    SECRET_KEY: str = "supersecret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    OPENAI_API_KEY: str | None = None
    MONGODB_DB_NAME: str = "aria_db"
    FRONTEND_URL: str = "https://aria-two-mu.vercel.app"

    class Config:
        env_file = ".env"

settings = Settings()
