from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.audit import AuditLog
from app.core.dependencies import require_role
from typing import Optional
import csv
from io import StringIO

router = APIRouter()

@router.get("", dependencies=[Depends(require_role(["admin"]))])
def list_logs(user_name: Optional[str] = None, module: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(AuditLog)
    if user_name: q = q.filter(AuditLog.user_name == user_name)
    if module: q = q.filter(AuditLog.module == module)
    return q.order_by(AuditLog.created_at.desc()).all()

@router.get("/export", dependencies=[Depends(require_role(["admin"]))])
def export(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).all()
    f = StringIO()
    writer = csv.writer(f)
    writer.writerow(["ID", "User", "Action", "Module", "Details", "Date"])
    for l in logs:
        writer.writerow([l.id, l.user_name, l.action, l.module, l.details, str(l.created_at)])
    f.seek(0)
    return StreamingResponse(iter([f.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=audit.csv"})
