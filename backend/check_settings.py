from app.core.config import settings
import os

print(f"DATABASE_URL: {settings.DATABASE_URL}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"Exists aria.db: {os.path.exists('aria.db')}")
