from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    name: str
    role: str

class TokenData(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None

class DocumentOut(BaseModel):
    id: int
    filename: str
    summary: Optional[str] = None
    key_decisions: Optional[Any] = None
    action_items: Optional[Any] = None
    deadlines: Optional[Any] = None
    stakeholders: Optional[Any] = None
    created_at: datetime
    class Config:
        from_attributes = True

class MeetingOut(BaseModel):
    id: int
    title: str
    summary: Optional[str] = None
    key_decisions: Optional[Any] = None
    action_items: Optional[Any] = None
    next_steps: Optional[Any] = None
    created_at: datetime
    class Config:
        from_attributes = True

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    ward: str
    latitude: float
    longitude: float

class ComplaintOut(ComplaintCreate):
    id: int
    status: str
    priority: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: int
    title: str
    description: str
    severity: str
    suggested_action: Optional[str] = None
    resolved: bool
    created_at: datetime
    class Config:
        from_attributes = True

class ScheduleEventCreate(BaseModel):
    title: str
    event_type: str
    priority: str
    start_time: datetime
    end_time: datetime
    attendees: str
    linked_document_id: Optional[int] = None

class ScheduleEventOut(ScheduleEventCreate):
    id: int
    briefing: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class AuditLogOut(BaseModel):
    id: int
    user_name: str
    action: str
    module: str
    details: str
    ip_address: str
    created_at: datetime
    class Config:
        from_attributes = True
