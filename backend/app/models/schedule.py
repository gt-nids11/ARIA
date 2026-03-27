from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from app.database import Base
from datetime import datetime

class ScheduleEvent(Base):
    __tablename__ = "schedule_events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    event_type = Column(String)
    priority = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    attendees = Column(Text)
    location = Column(String)
    linked_document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    briefing = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
