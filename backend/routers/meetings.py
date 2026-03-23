from fastapi import APIRouter, Depends, UploadFile, File, Request, HTTPException
from .. import schemas, auth, database
import os, json, datetime
from bson import ObjectId
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/upload", response_model=schemas.MeetingOut)
async def upload_meeting(file: UploadFile = File(...), db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user), req: Request = None):
    ext = file.filename.split('.')[-1].lower()
    if ext not in ["mp3", "wav", "m4a", "webm"]: raise HTTPException(400)
    os.makedirs("uploads/", exist_ok=True)
    audio_path = os.path.join("uploads/", file.filename)
    with open(audio_path, "wb") as buffer: buffer.write(await file.read())

    try:
        with open(audio_path, "rb") as af:
            tx = client.audio.transcriptions.create(model="whisper-1", file=af)
        transcript_text = tx.text
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "Extract JSON: 'summary', 'key_decisions', 'action_items', 'unresolved_issues', 'next_steps' (lists)."},
                {"role": "user", "content": transcript_text[:8000]}
            ]
        )
        res_json = json.loads(response.choices[0].message.content)
    except Exception:
        transcript_text = ""
        res_json = {}

    mtg = {
        "title": file.filename,
        "audio_path": audio_path,
        "transcript": transcript_text,
        "summary": res_json.get("summary", ""),
        "key_decisions": res_json.get("key_decisions", []),
        "action_items": res_json.get("action_items", []),
        "next_steps": res_json.get("next_steps", []) + res_json.get("unresolved_issues", []),
        "created_by": current_user.get("id", str(current_user.get("_id"))),
        "created_at": datetime.datetime.utcnow()
    }
    res = await db["meetings"].insert_one(mtg)
    mtg["_id"] = res.inserted_id
    await auth.log_api_action(db, current_user, "Upload Meeting", "Meetings", f"Audio: {file.filename}", req)
    return database.fix_id(mtg)

@router.get("/", response_model=list[schemas.MeetingOut])
async def get_all_meetings(db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    mtgs = await db["meetings"].find().to_list(100)
    return database.fix_ids(mtgs)

@router.get("/{mtg_id}", response_model=schemas.MeetingOut)
async def get_meeting(mtg_id: str, db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    mtg = await db["meetings"].find_one({"_id": ObjectId(mtg_id)})
    if not mtg: raise HTTPException(404)
    return database.fix_id(mtg)
