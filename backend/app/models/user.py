from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EDITOR = "editor"
    VIEWER = "viewer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.VIEWER)
    clearance_level = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
