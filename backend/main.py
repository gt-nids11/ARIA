from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from . import schemas, auth, database
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
import os
import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from .routers import documents, meetings, speeches, complaints, alerts, schedule, dashboard, audit

app = FastAPI(title="ARIA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_db_client():
    database.connect_db()
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_db_client():
    database.close_db()

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
async def register(user: schemas.UserCreate, db = Depends(database.get_db), req: Request = None):
    db_user = await db["users"].find_one({"email": user.email})
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = {
        "name": user.name,
        "email": user.email,
        "hashed_password": auth.get_password_hash(user.password),
        "role": user.role,
        "created_at": datetime.datetime.utcnow()
    }
    res = await db["users"].insert_one(new_user)
    new_user["_id"] = res.inserted_id
    new_user = database.fix_id(new_user)
    
    await auth.log_api_action(db, new_user, "System Registration", "Authentication", f"User {user.email} registered", req)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(database.get_db), req: Request = None):
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not auth.verify_password(form_data.password, user.get("hashed_password")):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    user = database.fix_id(user)
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.get("email"), "role": user.get("role"), "name": user.get("name")},
        expires_delta=access_token_expires
    )
    await auth.log_api_action(db, user, "System Login", "Authentication", f"User {user['email']} logged in", req)
    return {"access_token": access_token, "token_type": "bearer", "name": user["name"], "role": user.get("role")}

async def check_for_alerts():
    db = database.db_state.db
    if not db: return
    now = datetime.datetime.utcnow()
    cursor = db["complaints"].find({"status": "open"})
    async for c in cursor:
        created_at = c.get("created_at")
        if created_at and (now - created_at).total_seconds() > 72 * 3600:
            await db["alerts"].insert_one({
                "title": f"Unresolved Complaint: {c.get('title')}",
                "description": f"Complaint open >72 hr in {c.get('ward')}",
                "severity": "high",
                "resolved": False,
                "created_at": datetime.datetime.utcnow()
            })

scheduler.add_job(check_for_alerts, 'interval', hours=6)
