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
    # RBAC REMOVED: Every authenticated user is an admin
    return user

def require_leader_or_admin(user=Depends(get_current_user)):
    # RBAC REMOVED: Every authenticated user has leader/admin access
    return user

def require_clearance(min_level: int):
    # RBAC REMOVED: Every authenticated user has required clearance
    def dependency(user=Depends(get_current_user)):
        return user
    return dependency
