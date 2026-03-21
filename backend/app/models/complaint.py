from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from app.database import Base
from datetime import datetime

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    ward = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="open")
    priority = Column(String)
    filed_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
