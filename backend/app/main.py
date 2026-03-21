from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.core.config import settings
from app.routers import auth, documents, meetings, speeches, complaints, alerts, schedule, dashboard, audit
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
from app.database import SessionLocal
import threading
from app.services.insight_engine import check_complaint_escalations, check_upcoming_meetings, check_complaint_clusters
from apscheduler.schedulers.background import BackgroundScheduler

app = FastAPI(title="ARIA Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
app.include_router(speeches.router, prefix="/speeches", tags=["speeches"])
app.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(schedule.router, prefix="/schedule", tags=["schedule"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(audit.router, prefix="/audit", tags=["audit"])

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(User).first():
            admin = User(
                email="admin@aria.gov.in",
                hashed_password=get_password_hash("aria2026"),
                role="admin",
                name="System Admin"
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    init_db()
    scheduler = BackgroundScheduler()
    
    def run_checks():
        db = SessionLocal()
        try:
            check_complaint_escalations(db)
            check_upcoming_meetings(db)
            check_complaint_clusters(db)
        finally:
            db.close()
            
    scheduler.add_job(run_checks, "interval", hours=6)
    scheduler.start()

@app.get("/")
def health_check():
    return {"status": "ARIA Backend Online", "version": "1.0"}
