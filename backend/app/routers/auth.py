from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.audit import AuditLog
from app.core.security import (
    hash_password, verify_password, validate_password,
    create_access_token, invalidate_token, record_failed_attempt,
    is_account_locked, clear_failed_attempts
)
from pydantic import BaseModel, EmailStr, validator
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.dependencies import get_current_user, get_token
import re

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class RegisterRequest(BaseModel):
    name: str
    username: str
    password: str
    role: UserRole = UserRole.VIEWER
    
    @validator('name')
    def validate_name(cls, v):
        v = v.strip()
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name must be under 100 characters')
        if re.search(r'[<>\'"%;()]', v):
            raise ValueError('Name contains invalid characters')
        return v

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
# @limiter.limit("100/hour")
def register(request: Request, user: RegisterRequest, db: Session = Depends(get_db)):
    is_valid, reason = validate_password(user.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=reason)
        
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    # All signups in this simplified system are Ministers (Admin) with Level 4 clearance
    hashed_password = hash_password(user.password)
    new_user = User(
        name=user.name,
        username=user.username,
        hashed_password=hashed_password,
        role=UserRole.ADMIN,
        clearance_level=4
    )
    db.add(new_user)
    
    audit = AuditLog(
        user_name=new_user.name,
        action="INITIAL_REGISTRATION",
        module="AUTH",
        details=f"Minister account created: {user.username}",
        ip_address=request.client.host if request.client else "Unknown"
    )
    db.add(audit)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Minister account created successfully", "user_id": new_user.id}

@router.post("/login")
# @limiter.limit("1000/minute")
def login(request: Request, user_credentials: LoginRequest, db: Session = Depends(get_db)):
    if is_account_locked(user_credentials.username):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Account locked for 5 minutes.")
        
    user = db.query(User).filter(User.username == user_credentials.username).first()
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="User account not found. Personnel must register for a new entry before authorizing access."
        )

    if not verify_password(user_credentials.password, user.hashed_password):
        record_failed_attempt(user_credentials.username)
        
        audit = AuditLog(
            user_id=user.id,
            user_name=user.name,
            action="FAILED_LOGIN",
            module="AUTH",
            details=f"Failed password for {user_credentials.username}",
            ip_address=request.client.host if request.client else "Unknown"
        )
        db.add(audit)
        db.commit()
        
        raise HTTPException(status_code=401, detail="Invalid clearance credentials")
        
    clear_failed_attempts(user_credentials.username)
    
    access_token = create_access_token(data={
        "sub": str(user.id),
        "role": user.role,
        "name": user.name,
        "username": user.username,
        "clearance": user.clearance_level
    })
    
    audit = AuditLog(
        user_id=user.id,
        user_name=user.name,
        action="LOGIN",
        module="AUTH",
        details="Successful login",
        ip_address=request.client.host if request.client else "Unknown"
    )
    db.add(audit)
    db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "name": user.name,
        "role": user.role,
        "clearance": user.clearance_level,
        "username": user.username
    }

@router.post("/logout")
def logout(request: Request, token: str = Depends(get_token), db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    invalidate_token(token)
    
    audit = AuditLog(
        user_id=int(current_user.get("sub", 0)),
        user_name=current_user.get("name", "Unknown"),
        action="LOGOUT",
        module="AUTH",
        details="User logged out",
        ip_address=request.client.host if request.client else "Unknown"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Logged out successfully"}

@router.get("/me")
def read_users_me(current_user_dict: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user_dict.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "role": user.role,
        "clearance": user.clearance_level,
        "created_at": user.created_at
    }
