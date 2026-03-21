from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
from typing import Optional

router = APIRouter()

@router.post("/", response_model=schemas.ComplaintOut)
def create_complaint(data: schemas.ComplaintCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user), req: Request = None):
    # determine priority based on category/title naive check
    prio = "medium"
    if "water" in data.title.lower() or "power" in data.title.lower(): prio = "high"
    
    comp = models.Complaint(
        title=data.title, description=data.description, category=data.category,
        ward=data.ward, latitude=data.latitude, longitude=data.longitude,
        priority=prio, filed_by=current_user.email
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)
    auth.log_api_action(db, current_user, "Add Complaint", "Complaints", f"Ward: {data.ward}", req)
    return comp

@router.get("/", response_model=list[schemas.ComplaintOut])
def get_complaints(ward: Optional[str] = None, status: Optional[str] = None, category: Optional[str] = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    q = db.query(models.Complaint)
    if ward: q = q.filter(models.Complaint.ward == ward)
    if status: q = q.filter(models.Complaint.status == status)
    if category: q = q.filter(models.Complaint.category == category)
    return q.all()

@router.get("/heatmap")
def get_heatmap(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Returns clusters/markers for map
    comps = db.query(models.Complaint).filter(models.Complaint.status == "open").all()
    # Simple formatting: list of lat,lng,priority
    return [{"id": c.id, "lat": c.latitude, "lng": c.longitude, "priority": c.priority, "ward": c.ward} for c in comps]

@router.patch("/{comp_id}")
def update_complaint_status(comp_id: int, status: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    comp = db.query(models.Complaint).filter(models.Complaint.id == comp_id).first()
    if not comp: raise HTTPException(status_code=404)
    comp.status = status
    db.commit()
    return {"message": "updated"}
