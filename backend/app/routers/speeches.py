from fastapi import APIRouter, Depends
from pydantic import BaseModel, validator

router = APIRouter()

class SpeechRequest(BaseModel):
    event_type: str
    audience: str
    topic: str
    key_points: str
    tone: str

    @validator('topic')
    def topic_length(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('Topic too short')
        if len(v) > 500:
            raise ValueError('Topic too long')
        return v.strip()

    @validator('tone')
    def validate_tone(cls, v):
        if v not in ['formal', 'neutral', 'inspiring']:
            raise ValueError('Tone must be formal, neutral, or inspiring')
        return v

@router.post("/draft")
def draft(req: SpeechRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    draft_txt = draft_speech(req.event_type, req.audience, req.topic, req.key_points, req.tone)
    
    audit = AuditLog(user_id=int(current_user.get("sub", 0)), user_name=current_user.get("name", "Unknown"), action="GENERATE_SPEECH", module="Speeches", details=req.topic)
    db.add(audit)
    db.commit()
    
    return {"draft": draft_txt}
