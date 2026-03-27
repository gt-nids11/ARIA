from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.complaint import Complaint
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.audit import AuditLog
from pydantic import BaseModel, validator
from typing import Optional

router = APIRouter()

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    ward: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: str = "medium"
    filed_by: str

    @validator('title')
    def title_length(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('Title too short')
        if len(v) > 200:
            raise ValueError('Title too long')
        return v.strip()

    @validator('description')
    def description_length(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Description too short')
        if len(v) > 2000:
            raise ValueError('Description too long')
        return v.strip()

    @validator('latitude')
    def validate_latitude(cls, v):
        if v is not None and not (-90 <= v <= 90):
            raise ValueError('Latitude must be between -90 and 90')
        return v

    @validator('longitude')
    def validate_longitude(cls, v):
        if v is not None and not (-180 <= v <= 180):
            raise ValueError('Longitude must be between -180 and 180')
        return v

    @validator('priority')
    def validate_priority(cls, v):
        if v not in ['high', 'medium', 'low']:
            raise ValueError('Priority must be high, medium, or low')
        return v

class ComplaintUpdate(BaseModel):
    status: str

@router.post("")
def create_comp(req: ComplaintCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    comp = Complaint(
        title=req.title, description=req.description, category=req.category,
        ward=req.ward, latitude=req.latitude, longitude=req.longitude,
        priority=req.priority, filed_by=req.filed_by
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)
    
    audit = AuditLog(user_id=int(current_user.get("sub", 0)), user_name=current_user.get("name", "Unknown"), action="CREATE_COMPLAINT", module="Complaints", details=comp.title)
    db.add(audit)
    db.commit()
    return comp

@router.get("")
def list_comps(ward: Optional[str] = None, status: Optional[str] = None, category: Optional[str] = None, priority: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Complaint)
    if ward: q = q.filter(Complaint.ward == ward)
    if status: q = q.filter(Complaint.status == status)
    if category: q = q.filter(Complaint.category == category)
    if priority: q = q.filter(Complaint.priority == priority)
    return q.all()

@router.get("/heatmap")
def heatmap(db: Session = Depends(get_db)):
    comps = db.query(Complaint).filter(Complaint.status == "open").all()
    return [{"lat": c.latitude, "lng": c.longitude, "ward": c.ward, "category": c.category, "priority": c.priority, "title": c.title, "days_open": (c.created_at.date().toordinal() - c.created_at.date().toordinal())} for c in comps]

@router.patch("/{id}")
def update_comp(id: int, req: ComplaintUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    comp = db.query(Complaint).filter(Complaint.id == id).first()
    comp.status = req.status
    db.commit()
    db.refresh(comp)
    
    audit = AuditLog(user_id=int(current_user.get("sub", 0)), user_name=current_user.get("name", "Unknown"), action="UPDATE_COMPLAINT", module="Complaints", details=f"Status to {req.status}")
    db.add(audit)
    db.commit()
    return comp

@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    total = db.query(Complaint).count()
    open_c = db.query(Complaint).filter(Complaint.status == "open").count()
    in_prog = db.query(Complaint).filter(Complaint.status == "in_progress").count()
    res = db.query(Complaint).filter(Complaint.status == "resolved").count()
    
    wards = db.query(Complaint.ward, db.func.count(Complaint.id)).group_by(Complaint.ward).all()
    cats = db.query(Complaint.category, db.func.count(Complaint.id)).group_by(Complaint.category).all()
    
    return {
        "total": total, "open": open_c, "in_progress": in_prog, "resolved": res,
        "by_ward": {w: c for w, c in wards},
        "by_category": {cat: c for cat, c in cats}
    }
