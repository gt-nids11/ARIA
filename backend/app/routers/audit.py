from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.audit import AuditLog
from app.core.dependencies import require_admin
from typing import Optional
import csv
from io import StringIO

router = APIRouter()

@router.get("", dependencies=[Depends(require_admin)])
def list_logs(user_name: Optional[str] = None, module: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(AuditLog)
    if user_name: q = q.filter(AuditLog.user_name == user_name)
    if module: q = q.filter(AuditLog.module == module)
    return q.order_by(AuditLog.created_at.desc()).all()

@router.get("/export", dependencies=[Depends(require_admin)])
def export(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).all()
    f = StringIO()
    writer = csv.writer(f)
    writer.writerow(["ID", "User", "Action", "Module", "Details", "Date"])
    for l in logs:
        writer.writerow([l.id, l.user_name, l.action, l.module, l.details, str(l.created_at)])
    f.seek(0)
    return StreamingResponse(iter([f.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=audit.csv"})

@router.get("/security-status", dependencies=[Depends(require_admin)])
def security_status(db: Session = Depends(get_db)):
    from app.core.security import token_blacklist, failed_attempts, is_account_locked
    from datetime import datetime

    today = datetime.utcnow().date()
    # Count total_failed_logins_today
    total_failed = db.query(AuditLog).filter(
        AuditLog.action == "FAILED_LOGIN",
        db.func.date(AuditLog.created_at) == today
    ).count()

    total_logins = db.query(AuditLog).filter(
        AuditLog.action == "LOGIN",
        db.func.date(AuditLog.created_at) == today
    ).count()

    locked = [email for email, attempts in failed_attempts.items() if is_account_locked(email)]

    return {
        "jwt_blacklist_size": len(token_blacklist),
        "locked_accounts": locked,
        "total_failed_logins_today": total_failed,
        "total_logins_today": total_logins,
        "status": "secure"
    }
