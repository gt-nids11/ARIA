from fastapi import APIRouter, Depends, Query, Request, HTTPException
from .. import schemas, auth, database
from typing import Optional
import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=schemas.ComplaintOut)
async def create_complaint(data: schemas.ComplaintCreate, db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user), req: Request = None):
    prio = "medium"
    if "water" in data.title.lower() or "power" in data.title.lower(): prio = "high"
    comp = data.dict()
    comp.update({"priority": prio, "filed_by": current_user.get("email"), "status": "open", "created_at": datetime.datetime.utcnow()})
    res = await db["complaints"].insert_one(comp)
    comp["_id"] = res.inserted_id
    await auth.log_api_action(db, current_user, "Add Complaint", "Complaints", f"Ward: {data.ward}", req)
    return database.fix_id(comp)

@router.get("/", response_model=list[schemas.ComplaintOut])
async def get_complaints(ward: Optional[str] = None, status: Optional[str] = None, category: Optional[str] = None, db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    query = {}
    if ward: query["ward"] = ward
    if status: query["status"] = status
    if category: query["category"] = category
    comps = await db["complaints"].find(query).to_list(100)
    return database.fix_ids(comps)

@router.get("/heatmap")
async def get_heatmap(db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    comps = await db["complaints"].find({"status": "open"}).to_list(500)
    return [{"id": str(c["_id"]), "lat": c["latitude"], "lng": c["longitude"], "priority": c["priority"], "ward": c["ward"]} for c in comps]

@router.patch("/{comp_id}")
async def update_complaint_status(comp_id: str, status: str, db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    res = await db["complaints"].update_one({"_id": ObjectId(comp_id)}, {"$set": {"status": status}})
    if res.matched_count == 0: raise HTTPException(status_code=404)
    return {"message": "updated"}
