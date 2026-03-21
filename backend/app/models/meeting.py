from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from app.database import Base
from datetime import datetime

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    audio_path = Column(String)
    transcript = Column(Text)
    summary = Column(Text)
    key_decisions = Column(Text)
    action_items = Column(Text)
    unresolved_issues = Column(Text)
    next_steps = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
