from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from app.database import Base
from datetime import datetime

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    raw_text = Column(Text)
    summary = Column(Text)
    key_decisions = Column(Text)
    action_items = Column(Text)
    deadlines = Column(Text)
    stakeholders = Column(Text)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
