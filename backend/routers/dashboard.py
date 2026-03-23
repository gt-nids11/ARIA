from fastapi import APIRouter, Depends
from .. import auth, database
import datetime, os
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/brief")
async def get_morning_brief(db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    alerts = await db["alerts"].find({"severity": "high", "resolved": False}).to_list(20)
    comps_open = await db["complaints"].count_documents({"status": "open"})
    events = await db["schedule_events"].find({"start_time": {"$gte": today}}).to_list(20)

    alert_summary = ", ".join([a.get('title') for a in alerts]) if alerts else "None"
    evt_summary = f"{len(events)} events today."

    gpt_prompt = f"Write a single concise paragraph 'Morning Brief' for a government official based on this data. High alerts: {alert_summary}. Open Complaints: {comps_open}. Schedule: {evt_summary}."
    try:
        res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": gpt_prompt}])
        return {"brief": res.choices[0].message.content}
    except Exception:
        return {"brief": "Could not generate brief. Check OpenAI API key."}

@router.get("/stats")
async def get_stats(db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    return {
        "pending_alerts": await db["alerts"].count_documents({"resolved": False}),
        "today_meetings": await db["schedule_events"].count_documents({"start_time": {"$gte": today}}),
        "open_complaints": await db["complaints"].count_documents({"status": "open"}),
        "drafts_saved": await db["documents"].count_documents({})
    }
