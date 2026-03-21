from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .. import models, auth, database
import os
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class SpeechRequest(BaseModel):
    event_type: str
    audience: str
    topic: str
    key_points: str
    tone: str

@router.post("/draft")
def draft_speech(data: SpeechRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user), req: Request = None):
    prompt = f"""
    Create a {data.tone} speech for a {data.event_type} addressing {data.audience}.
    Topic: {data.topic}
    Key Points to cover:
    {data.key_points}
    """
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert government speechwriter. Write with formal tone (unless specified otherwise), strong opening hook, 3 clear key points, and a powerful closing."},
            {"role": "user", "content": prompt}
        ]
    )
    draft_text = response.choices[0].message.content

    auth.log_api_action(db, current_user, "Generate Speech Draft", "Speeches", f"Topic: {data.topic}", req)
    return {"draft": draft_text}
