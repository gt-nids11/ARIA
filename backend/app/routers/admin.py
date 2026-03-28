from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.audit import AuditLog
from app.core.dependencies import require_admin
from pydantic import BaseModel
from typing import List

router = APIRouter()

class UserResponse(BaseModel):
    id: int
    name: str
    username: str
    role: str
    clearance_level: int
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    username: str
    password: str
    role: UserRole

class RoleUpdateRequest(BaseModel):
    role: UserRole
    clearance_level: int

ROLE_LEVEL_MAP = {
    UserRole.ADMIN: 4,
    UserRole.MANAGER: 3,
    UserRole.EDITOR: 2,
    UserRole.VIEWER: 1
}

@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_admin=Depends(require_admin)):
    return db.query(User).all()

@router.post("/users", response_model=UserResponse)
def create_user(
    user_req: UserCreate, 
    request: Request,
    db: Session = Depends(get_db), 
    current_admin=Depends(require_admin)
):
    from app.core.security import hash_password
    
    existing = db.query(User).filter(User.username == user_req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
        
    new_user = User(
        name=user_req.name,
        username=user_req.username,
        hashed_password=hash_password(user_req.password),
        role=user_req.role,
        clearance_level=ROLE_LEVEL_MAP.get(user_req.role, 1)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    audit = AuditLog(
        user_id=int(current_admin.get("sub", 0)),
        user_name=current_admin.get("name"),
        action="CREATE_USER",
        module="ADMIN",
        details=f"Created user {user_req.username} as {user_req.role}",
        ip_address=request.client.host if request.client else "Unknown"
    )
    db.add(audit)
    db.commit()
    
    return new_user

@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int, 
    update: RoleUpdateRequest, 
    request: Request,
    db: Session = Depends(get_db), 
    current_admin=Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_role = user.role
    old_level = user.clearance_level
    
    user.role = update.role
    user.clearance_level = update.clearance_level
    db.commit()
    
    # Audit Logging
    audit = AuditLog(
        user_id=int(current_admin.get("sub", 0)),
        user_name=current_admin.get("name"),
        action="ROLE_CHANGE",
        module="ADMIN",
        details=f"Changed user {user.username}: {old_role}(L{old_level}) -> {update.role}(L{update.clearance_level})",
        ip_address=request.client.host if request.client else "Unknown"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Role updated successfully", "username": user.username, "role": user.role}
