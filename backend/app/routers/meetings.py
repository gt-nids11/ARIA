from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.meeting import Meeting
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.audit import AuditLog
from app.services.whisper_service import transcribe_audio
from app.services.openai_service import summarize_meeting
import os

router = APIRouter()
UPLOAD_DIR = "uploads"

@router.post("/upload")
def upload_meeting(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
        
    transcript = transcribe_audio(file_path)
    analysis = summarize_meeting(transcript)
    
    meeting = Meeting(
        title=file.filename,
        audio_path=file_path,
        transcript=transcript,
        summary=analysis.get("summary", ""),
        key_decisions=analysis.get("key_decisions", ""),
        action_items=analysis.get("action_items", ""),
        unresolved_issues=analysis.get("unresolved_issues", ""),
        next_steps=analysis.get("next_steps", ""),
        created_by=current_user.id
    )
    
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    audit = AuditLog(user_id=current_user.id, user_name=current_user.name, action="UPLOAD_MEETING", module="Meetings", details=f"Uploaded meeting {file.filename}")
    db.add(audit)
    db.commit()
    
    return meeting

@router.get("")
def list_meetings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Meeting).order_by(Meeting.created_at.desc()).all()

@router.get("/{id}")
def get_meeting(id: int, db: Session = Depends(get_db)):
    m = db.query(Meeting).filter(Meeting.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Not found")
    return m
