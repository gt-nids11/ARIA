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
    email: EmailStr
    password: str
    role: UserRole = UserRole.AIDE
    
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
    email: EmailStr
    password: str

@router.post("/register")
@limiter.limit("3/hour")
def register(request: Request, user: RegisterRequest, db: Session = Depends(get_db)):
    is_valid, reason = validate_password(user.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=reason)
        
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    audit = AuditLog(
        user_id=new_user.id,
        user_name=new_user.name,
        action="REGISTER",
        module="AUTH",
        details=f"New user: {user.email}",
        ip_address=request.client.host if request.client else "Unknown"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Account created successfully", "user_id": new_user.id}

@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, user_credentials: LoginRequest, db: Session = Depends(get_db)):
    if is_account_locked(user_credentials.email):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Account locked for 5 minutes.")
        
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        record_failed_attempt(user_credentials.email)
        
        audit = AuditLog(
            user_id=user.id if user else 0,
            user_name=user.name if user else "Unknown",
            action="FAILED_LOGIN",
            module="AUTH",
            details=f"Failed login attempt for {user_credentials.email}",
            ip_address=request.client.host if request.client else "Unknown"
        )
        db.add(audit)
        db.commit()
        
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    clear_failed_attempts(user_credentials.email)
    
    access_token = create_access_token(data={
        "sub": str(user.id),
        "role": user.role,
        "name": user.name,
        "email": user.email
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
        "email": user.email
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
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at
    }
