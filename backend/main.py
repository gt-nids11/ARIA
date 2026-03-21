from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, auth, database
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
import os

from apscheduler.schedulers.background import BackgroundScheduler
from .routers import documents, meetings, speeches, complaints, alerts, schedule, dashboard, audit

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="ARIA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
app.include_router(speeches.router, prefix="/speeches", tags=["speeches"])
app.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(schedule.router, prefix="/schedule", tags=["schedule"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(audit.router, prefix="/audit", tags=["audit"])

@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db), req: Request = None):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    auth.log_api_action(db, new_user, "System Registration", "Authentication", f"User {user.email} registered", req)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db), req: Request = None):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role, "name": user.name},
        expires_delta=access_token_expires
    )
    auth.log_api_action(db, user, "System Login", "Authentication", f"User {user.email} logged in", req)
    return {"access_token": access_token, "token_type": "bearer", "name": user.name, "role": user.role}

# APScheduler Background Job setup for Alerts triggering
def check_for_alerts():
    db = database.SessionLocal()
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    # Check High alerts for 72hr open complaints
    old_complaints = db.query(models.Complaint).filter(models.Complaint.status == "open").all()
    for c in old_complaints:
        if c.created_at and (now - c.created_at).total_seconds() > 72 * 3600:
            db.add(models.Alert(title=f"Unresolved Complaint: {c.title}", description=f"Complaint open >72 hr in {c.ward}", severity="high"))
    db.commit()
    db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(check_for_alerts, 'interval', hours=6)
scheduler.start()
