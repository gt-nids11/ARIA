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
    email: str
    role: str
    clearance_level: int
    
    class Config:
        orm_mode = True

class RoleUpdateRequest(BaseModel):
    role: UserRole
    clearance_level: int

@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_admin=Depends(require_admin)):
    return db.query(User).all()

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
        user_id=current_admin.get("sub"),
        user_name=current_admin.get("name"),
        action="ROLE_CHANGE",
        module="ADMIN",
        details=f"Changed user {user.email}: {old_role}(L{old_level}) -> {update.role}(L{update.clearance_level})",
        ip_address=request.client.host if request.client else "Unknown"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Role updated successfully", "user": user.email, "role": user.role}
