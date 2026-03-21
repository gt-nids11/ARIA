from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
import os
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/", response_model=list[schemas.ScheduleEventOut])
def list_events(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.ScheduleEvent).all()

@router.post("/", response_model=schemas.ScheduleEventOut)
def create_event(data: schemas.ScheduleEventCreate, db: Session = Depends(database.get_db), req: Request = None, current_user: models.User = Depends(auth.get_current_user)):
    # Check simple overlap logic
    overlap = db.query(models.ScheduleEvent).filter(
        models.ScheduleEvent.start_time < data.end_time,
        models.ScheduleEvent.end_time > data.start_time
    ).count()

    if overlap > 0:
        raise HTTPException(status_code=409, detail="Warning: Event overlaps with an existing meeting")

    evt = models.ScheduleEvent(**data.dict(), created_by=current_user.id)
    db.add(evt)
    db.commit()
    db.refresh(evt)
    auth.log_api_action(db, current_user, "Create Schedule", "Schedule", f"Title: {data.title}", req)
    return evt

@router.get("/{evt_id}", response_model=schemas.ScheduleEventOut)
def get_event(evt_id: int, db: Session = Depends(database.get_db), req: Request = None, current_user: models.User = Depends(auth.get_current_user)):
    evt = db.query(models.ScheduleEvent).filter(models.ScheduleEvent.id == evt_id).first()
    if not evt: raise HTTPException(status_code=404)

    # Auto generate briefing if it doesn't exist
    if not evt.briefing:
        doc_text = "No linked document"
        if evt.linked_document_id:
            d = db.query(models.Document).filter(models.Document.id == evt.linked_document_id).first()
            if d: doc_text = f"Context: {d.summary}"
        
        prompt = f"Write a professional auto-briefing for the event '{evt.title}' attending by {evt.attendees}. Context: {doc_text}. Highlight potential talking points."
        res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
        evt.briefing = res.choices[0].message.content
        db.commit()
        db.refresh(evt)
        auth.log_api_action(db, current_user, "Auto-Briefing Gen", "Schedule", f"Event ID: {evt.id}", req)

    return evt
