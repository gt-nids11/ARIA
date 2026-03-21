from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.audit import AuditLog
from app.services.openai_service import draft_speech

router = APIRouter()

class SpeechReq(BaseModel):
    event_type: str
    audience: str
    topic: str
    key_points: str
    tone: str

@router.post("/draft")
def draft(req: SpeechReq, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft_txt = draft_speech(req.event_type, req.audience, req.topic, req.key_points, req.tone)
    
    audit = AuditLog(user_id=current_user.id, user_name=current_user.name, action="GENERATE_SPEECH", module="Speeches", details=req.topic)
    db.add(audit)
    db.commit()
    
    return {"draft": draft_txt}
