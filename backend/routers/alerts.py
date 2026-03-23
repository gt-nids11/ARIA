from fastapi import APIRouter, Depends, Request, HTTPException
from .. import schemas, auth, database
import datetime
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=list[schemas.AlertOut])
async def get_alerts(db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    alerts = await db["alerts"].find().sort("severity", 1).to_list(100)
    return database.fix_ids(alerts)

@router.post("/", response_model=schemas.AlertOut)
async def create_alert(alert: schemas.AlertOut, db = Depends(database.get_db), req: Request = None, current_user: dict = Depends(auth.get_current_user)):
    a = {
        "title": alert.title,
        "description": alert.description,
        "severity": alert.severity,
        "suggested_action": alert.suggested_action,
        "resolved": False,
        "created_at": datetime.datetime.utcnow()
    }
    res = await db["alerts"].insert_one(a)
    a["_id"] = res.inserted_id
    await auth.log_api_action(db, current_user, "Add Alert", "Alerts", f"Title: {alert.title}", req)
    return database.fix_id(a)

@router.patch("/{alert_id}/resolve")
async def resolve_alert(alert_id: str, db = Depends(database.get_db), req: Request = None, current_user: dict = Depends(auth.get_current_user)):
    res = await db["alerts"].update_one({"_id": ObjectId(alert_id)}, {"$set": {"resolved": True}})
    if res.matched_count == 0: raise HTTPException(status_code=404, detail="Not Found")
    await auth.log_api_action(db, current_user, "Resolve Alert", "Alerts", f"ID: {alert_id}", req)
    return {"message": "resolved"}
