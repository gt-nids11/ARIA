from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("/", response_model=list[schemas.AuditLogOut])
def get_audit_logs(
    user_name: Optional[str] = None, 
    start_date: Optional[str] = None, 
    end_date: Optional[str] = None, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.role_required(["admin"]))
):
    q = db.query(models.AuditLog)
    if user_name:
        q = q.filter(models.AuditLog.user_name.ilike(f"%{user_name}%"))
    if start_date:
        sd = datetime.strptime(start_date, "%Y-%m-%d")
        q = q.filter(models.AuditLog.created_at >= sd)
    if end_date:
        ed = datetime.strptime(end_date, "%Y-%m-%d")
        q = q.filter(models.AuditLog.created_at <= ed)
    return q.order_by(models.AuditLog.created_at.desc()).all()
