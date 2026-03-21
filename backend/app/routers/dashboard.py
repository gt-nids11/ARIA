from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.alert import Alert
from app.models.schedule import ScheduleEvent
from app.models.document import Document
from app.models.complaint import Complaint
from app.services.openai_service import generate_morning_brief
from datetime import datetime

router = APIRouter()

@router.get("/brief")
def get_brief(db: Session = Depends(get_db)):
    high_alerts = db.query(Alert).filter(Alert.severity == "high", Alert.resolved == False).limit(3).all()
    today = datetime.utcnow().date()
    evs = db.query(ScheduleEvent).filter(db.func.date(ScheduleEvent.start_time) == today).all()
    open_c = db.query(Complaint).filter(Complaint.status == "open").count()
    
    alerts_data = [{"title": a.title, "severity": a.severity} for a in high_alerts]
    evs_data = [{"title": e.title, "start_time": e.start_time.strftime("%H:%M")} for e in evs]
    
    b = generate_morning_brief(alerts_data, evs_data, open_c)
    return {"brief": b}

@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    a = db.query(Alert).filter(Alert.resolved == False).count()
    today = datetime.utcnow().date()
    e = db.query(ScheduleEvent).filter(db.func.date(ScheduleEvent.start_time) == today).count()
    c = db.query(Complaint).filter(Complaint.status == "open").count()
    d = db.query(Document).count()
    return {"pending_alerts": a, "todays_meetings": e, "open_complaints": c, "drafts_saved": d}
