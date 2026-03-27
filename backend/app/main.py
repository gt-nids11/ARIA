from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.core.config import settings
from app.routers import auth, documents, meetings, speeches, complaints, alerts, schedule, dashboard, audit, admin
from app.models.user import User
from app.core.security import hash_password
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.mongodb import connect_to_mongo, close_mongo_connection
import threading
from app.services.insight_engine import check_complaint_escalations, check_upcoming_meetings, check_complaint_clusters
from apscheduler.schedulers.background import BackgroundScheduler
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as StarletteRequest
from fastapi import Request
from fastapi.responses import JSONResponse

app = FastAPI(title="ARIA Backend API")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()
    print(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal error: {str(exc)}"}
    )

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: StarletteRequest, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=()"
        return response

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aria-two-mu.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
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
        if not db.query(User).filter(User.username == "admin").first():
            admin_user = User(
                username="admin",
                hashed_password=hash_password("aria2026"),
                role="admin",
                clearance_level=4,
                name="System Admin"
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    # Initialize MongoDB
    await connect_to_mongo()
    
    # Initialize PostgreSQL
    init_db()
    
    # Start background scheduler
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

@app.on_event("shutdown")
async def shutdown_event():
    # Close MongoDB connection
    await close_mongo_connection()

@app.get("/")
def health_check():
    return {"status": "ARIA Backend Online", "version": "1.0"}
