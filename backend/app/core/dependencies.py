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

def require_leader_or_admin(user=Depends(get_current_user)):
    if user.get("role") not in ["admin", "leader"]:
        raise HTTPException(
            status_code=403,
            detail="Leader or Admin access required"
        )
    return user
