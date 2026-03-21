from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
from .. import models, auth, database
import datetime, os
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/brief")
def get_morning_brief(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Gather data
    today = datetime.datetime.now().date()
    alerts = db.query(models.Alert).filter(models.Alert.severity == "high", models.Alert.resolved == False).all()
    comps_open = db.query(models.Complaint).filter(models.Complaint.status == "open").count()
    events = db.query(models.ScheduleEvent).filter(models.ScheduleEvent.start_time >= today).all()

    alert_summary = ", ".join([a.title for a in alerts]) if alerts else "None"
    evt_summary = f"{len([e for e in events if e.start_time.date() == today])} events today."

    gpt_prompt = f"Write a single concise paragraph 'Morning Brief' for a government official based on this data. High alerts: {alert_summary}. Open Complaints: {comps_open}. Schedule: {evt_summary}."

    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": gpt_prompt}])

    return {"brief": res.choices[0].message.content}

@router.get("/stats")
def get_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return {
        "pending_alerts": db.query(models.Alert).filter(models.Alert.resolved == False).count(),
        "today_meetings": db.query(models.ScheduleEvent).filter(models.ScheduleEvent.start_time >= datetime.datetime.now().date()).count(),
        "open_complaints": db.query(models.Complaint).filter(models.Complaint.status == "open").count(),
        "drafts_saved": db.query(models.Document).count()
    }
