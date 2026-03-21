from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from app.database import Base
from datetime import datetime

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    severity = Column(String)
    suggested_action = Column(Text)
    resolved = Column(Boolean, default=False)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
