from fastapi import APIRouter, Depends, UploadFile, File, Request, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
import os, json
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/upload", response_model=schemas.MeetingOut)
async def upload_meeting(file: UploadFile = File(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user), req: Request = None):
    valid_ext = ["mp3", "wav", "m4a", "webm"]
    ext = file.filename.split(".")[-1].lower()
    if ext not in valid_ext:
        raise HTTPException(status_code=400, detail="Only MP3, WAV, M4A, WEBM audio allowed")

    upload_dir = "uploads/"
    os.makedirs(upload_dir, exist_ok=True)
    audio_path = os.path.join(upload_dir, file.filename)
    
    with open(audio_path, "wb") as buffer:
        buffer.write(await file.read())

    # Transcribe with Whisper
    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
    transcript_text = transcription.text

    # Summarize with GPT-4o
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a professional meeting minutes generator. Extract: 'summary' (short paragraph), 'key_decisions' (list), 'action_items' (list), 'unresolved_issues' (list), 'next_steps' (list). Return ONLY valid JSON."},
            {"role": "user", "content": transcript_text[:8000]}
        ]
    )
    res_json = json.loads(response.choices[0].message.content)

    new_mtg = models.Meeting(
        title=file.filename,
        audio_path=audio_path,
        transcript=transcript_text,
        summary=res_json.get("summary", ""),
        key_decisions=res_json.get("key_decisions", []),
        action_items=res_json.get("action_items", []),
        next_steps=res_json.get("next_steps", []) + res_json.get("unresolved_issues", []),
        created_by=current_user.id
    )
    db.add(new_mtg)
    db.commit()
    db.refresh(new_mtg)

    auth.log_api_action(db, current_user, "Upload Meeting", "Meetings", f"Audio: {file.filename}", req)
    return new_mtg

@router.get("/", response_model=list[schemas.MeetingOut])
def get_all_meetings(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Meeting).all()

@router.get("/{mtg_id}", response_model=schemas.MeetingOut)
def get_meeting(mtg_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Meeting).filter(models.Meeting.id == mtg_id).first()
