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
async def upload_meeting(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    ALLOWED_AUDIO = {'.mp3', '.wav', '.m4a', '.mp4', '.ogg'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_AUDIO:
        raise HTTPException(400, "Only audio files are allowed")

    MAX_AUDIO_SIZE = 25 * 1024 * 1024
    contents = await file.read()
    if len(contents) > MAX_AUDIO_SIZE:
        raise HTTPException(400, "File size must be under 25MB")
    await file.seek(0)
    
    import re
    safe_filename = re.sub(r'[^a-zA-Z0-9._-]', '_', file.filename)
    file_path = f"uploads/{safe_filename}"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
        
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
        created_by=int(current_user.get("sub", 0))
    )
    
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    audit = AuditLog(user_id=int(current_user.get("sub", 0)), user_name=current_user.get("name", "Unknown"), action="UPLOAD_MEETING", module="Meetings", details=f"Uploaded meeting {safe_filename}")
    db.add(audit)
    db.commit()
    
    return meeting

@router.get("")
def list_meetings(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(Meeting).order_by(Meeting.created_at.desc()).all()

@router.get("/{id}")
def get_meeting(id: int, db: Session = Depends(get_db)):
    m = db.query(Meeting).filter(Meeting.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Not found")
    return m
