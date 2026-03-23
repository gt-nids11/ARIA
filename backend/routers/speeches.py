from fastapi import APIRouter, Depends, Query, Request
from .. import auth, database
from bson import ObjectId
import datetime
import os
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/generate")
async def generate_speech(topic: str = Query(...), length_minutes: int = Query(5), tone: str = Query("formal"), db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user), req: Request = None):
    prompt = f"Write a {tone} speech for a government official about {topic}. It should take about {length_minutes} minutes to deliver."
    try:
        res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
        content = res.choices[0].message.content
    except Exception:
        content = "Error generating speech."
    
    doc = {
        "title": f"Draft Speech: {topic}",
        "content": content,
        "created_by": current_user.get("id", str(current_user.get("_id"))),
        "created_at": datetime.datetime.utcnow()
    }
    await db["drafts"].insert_one(doc)
    await auth.log_api_action(db, current_user, "Generate Speech", "Speeches", f"Topic: {topic}", req)
    return {"content": content}
