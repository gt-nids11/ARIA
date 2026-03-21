from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database

router = APIRouter()

@router.get("/", response_model=list[schemas.AlertOut])
def get_alerts(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Alert).order_by(models.Alert.severity).all()

@router.post("/", response_model=schemas.AlertOut)
def create_alert(alert: schemas.AlertOut, db: Session = Depends(database.get_db), req: Request = None, current_user: models.User = Depends(auth.get_current_user)):
    a = models.Alert(
        title=alert.title,
        description=alert.description,
        severity=alert.severity,
        suggested_action=alert.suggested_action
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    auth.log_api_action(db, current_user, "Add Alert", "Alerts", f"Title: {alert.title}", req)
    return a

@router.patch("/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(database.get_db), req: Request = None, current_user: models.User = Depends(auth.get_current_user)):
    a = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not a: raise HTTPException(status_code=404, detail="Not Found")
    a.resolved = True
    db.commit()
    auth.log_api_action(db, current_user, "Resolve Alert", "Alerts", f"ID: {alert_id}", req)
    return {"message": "resolved"}
