from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schedule import ScheduleEvent
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.audit import AuditLog
from app.services.openai_service import generate_meeting_briefing
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

class SchedCreate(BaseModel):
    title: str
    event_type: str
    priority: str
    start_time: datetime
    end_time: datetime
    attendees: str

@router.post("")
def create_ev(req: SchedCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conflict = db.query(ScheduleEvent).filter(ScheduleEvent.start_time < req.end_time, ScheduleEvent.end_time > req.start_time).first()
    if conflict:
        return {"conflict": True, "conflicting_event": {"id": conflict.id, "title": conflict.title}}
        
    ev = ScheduleEvent(**req.dict(), created_by=current_user.id)
    db.add(ev)
    db.commit()
    db.refresh(ev)
    
    audit = AuditLog(user_id=current_user.id, user_name=current_user.name, action="CREATE_SCHEDULE", module="Schedule", details=ev.title)
    db.add(audit)
    db.commit()
    return ev

@router.get("")
def list_ev(date: Optional[str] = None, db: Session = Depends(get_db)):
    return db.query(ScheduleEvent).order_by(ScheduleEvent.start_time.asc()).all()

@router.get("/{id}")
def get_ev(id: int, db: Session = Depends(get_db)):
    return db.query(ScheduleEvent).filter(ScheduleEvent.id == id).first()

@router.get("/{id}/briefing")
def get_briefing(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ev = db.query(ScheduleEvent).filter(ScheduleEvent.id == id).first()
    if ev.briefing:
        return {"briefing": ev.briefing}
        
    b = generate_meeting_briefing(ev.title, ev.event_type, ev.attendees)
    ev.briefing = b
    db.commit()
    
    audit = AuditLog(user_id=current_user.id, user_name=current_user.name, action="GENERATE_BRIEFING", module="Schedule", details=str(id))
    db.add(audit)
    db.commit()
    return {"briefing": b}

@router.patch("/{id}")
def update_ev(id: int, req: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ev = db.query(ScheduleEvent).filter(ScheduleEvent.id == id).first()
    for k, v in req.items():
        setattr(ev, k, v)
    db.commit()
    db.refresh(ev)
    return ev

@router.delete("/{id}")
def del_ev(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ev = db.query(ScheduleEvent).filter(ScheduleEvent.id == id).first()
    db.delete(ev)
    db.commit()
    return {"message": "Deleted"}
