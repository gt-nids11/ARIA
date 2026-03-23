from fastapi import APIRouter, Depends, Request, HTTPException
from .. import schemas, auth, database
import datetime, os
from bson import ObjectId
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/", response_model=list[schemas.ScheduleEventOut])
async def list_events(db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    evts = await db["schedule_events"].find().to_list(100)
    return database.fix_ids(evts)

@router.post("/", response_model=schemas.ScheduleEventOut)
async def create_event(data: schemas.ScheduleEventCreate, db = Depends(database.get_db), req: Request = None, current_user: dict = Depends(auth.get_current_user)):
    overlap = await db["schedule_events"].count_documents({
        "start_time": {"$lt": data.end_time},
        "end_time": {"$gt": data.start_time}
    })
    if overlap > 0: raise HTTPException(status_code=409, detail="Warning: Event overlaps")
    
    evt = data.dict()
    evt.update({"created_by": current_user.get("id", str(current_user.get("_id"))), "created_at": datetime.datetime.utcnow(), "briefing": None})
    res = await db["schedule_events"].insert_one(evt)
    evt["_id"] = res.inserted_id
    await auth.log_api_action(db, current_user, "Create Schedule", "Schedule", f"Title: {data.title}", req)
    return database.fix_id(evt)

@router.get("/{evt_id}", response_model=schemas.ScheduleEventOut)
async def get_event(evt_id: str, db = Depends(database.get_db), req: Request = None, current_user: dict = Depends(auth.get_current_user)):
    evt = await db["schedule_events"].find_one({"_id": ObjectId(evt_id)})
    if not evt: raise HTTPException(404)

    if not evt.get("briefing"):
        doc_text = "No linked document"
        if evt.get("linked_document_id"):
            try:
                d = await db["documents"].find_one({"_id": ObjectId(evt.get("linked_document_id"))})
                if d: doc_text = f"Context: {d.get('summary')}"
            except: pass
        prompt = f"Write a professional auto-briefing for '{evt.get('title')}' attending by {evt.get('attendees')}. Context: {doc_text}. Highlight talking points."
        try:
            res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
            evt["briefing"] = res.choices[0].message.content
            await db["schedule_events"].update_one({"_id": ObjectId(evt_id)}, {"$set": {"briefing": evt["briefing"]}})
            await auth.log_api_action(db, current_user, "Auto-Briefing Gen", "Schedule", f"Event ID: {evt_id}", req)
        except: pass

    return database.fix_id(evt)
