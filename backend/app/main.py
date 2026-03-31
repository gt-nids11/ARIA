from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, admin, documents, alerts, complaints, audit, meetings
from app.database import Base, engine

app = FastAPI(title="ARIA Backend API - MINIMAL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Open for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"DEBUG: Incoming {request.method} to {request.url}")
    response = await call_next(request)
    print(f"DEBUG: Response status {response.status_code}")
    return response

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(complaints.router, prefix="/api/complaints", tags=["complaints"])
app.include_router(audit.router, prefix="/api/audit", tags=["audit"])
app.include_router(meetings.router, prefix="/api/meetings", tags=["meetings"])

@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    print("Startup complete")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "minimal": True}

@app.get("/")
def home():
    return {"message": "ARIA Minimal Backend"}
