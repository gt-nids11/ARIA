from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.alert import Alert
from app.core.dependencies import get_current_user, require_leader_or_admin
from app.models.user import User
from app.models.audit import AuditLog
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class AlertCreate(BaseModel):
    title: str
    description: str
    severity: str
    suggested_action: str

@router.get("")
def list_alerts(severity: Optional[str] = None, resolved: Optional[bool] = None, db: Session = Depends(get_db)):
    q = db.query(Alert)
    if severity: q = q.filter(Alert.severity == severity)
    if resolved is not None: q = q.filter(Alert.resolved == resolved)
    return q.order_by(Alert.resolved.asc(), Alert.created_at.desc()).all()

@router.post("")
def create_a(req: AlertCreate, db: Session = Depends(get_db), current_user: dict = Depends(require_clearance(3))):
    a = Alert(title=req.title, description=req.description, severity=req.severity, suggested_action=req.suggested_action)
    db.add(a)
    db.commit()
    db.refresh(a)
    
    audit = AuditLog(user_id=int(current_user.get("sub", 0)), user_name=current_user.get("name", "Unknown"), action="CREATE_ALERT", module="Alerts", details=a.title)
    db.add(audit)
    db.commit()
    return a

@router.patch("/{id}/resolve")
def resolve(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    a = db.query(Alert).filter(Alert.id == id).first()
    a.resolved = True
    db.commit()
    db.refresh(a)
    
    audit = AuditLog(user_id=int(current_user.get("sub", 0)), user_name=current_user.get("name", "Unknown"), action="RESOLVE_ALERT", module="Alerts", details=str(id))
    db.add(audit)
    db.commit()
    return a

@router.get("/count")
def count(db: Session = Depends(get_db)):
    tot = db.query(Alert).count()
    high = db.query(Alert).filter(Alert.severity == "high").count()
    med = db.query(Alert).filter(Alert.severity == "medium").count()
    low = db.query(Alert).filter(Alert.severity == "low").count()
    unres = db.query(Alert).filter(Alert.resolved == False).count()
    return {"total": tot, "high": high, "medium": med, "low": low, "unresolved": unres}
