from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    return decode_token(credentials.credentials)

def get_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    return credentials.credentials

def require_admin(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return user

def require_clearance(min_level: int):
    def dependency(user=Depends(get_current_user)):
        user_clearance = user.get("clearance", 0)
        if user_clearance < min_level:
            raise HTTPException(
                status_code=403,
                detail=f"Clearance level {min_level} required. Your level: {user_clearance}"
            )
        return user
    return dependency
