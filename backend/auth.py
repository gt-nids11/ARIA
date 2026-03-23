from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
import os
from . import schemas, database

SECRET_KEY = os.getenv("SECRET_KEY", "b336df8398e1fdb702b8014528c1eaab7f1c1f516a2d1e03c6225b2f29399126")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await db["users"].find_one({"email": email})
    if user is None:
        raise credentials_exception
    return database.fix_id(user)

def role_required(allowed_roles: list[str]):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in allowed_roles and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user
    return role_checker

async def log_api_action(db, user: dict, action: str, module: str, details: str, request=None):
    ip_address = request.client.host if getattr(request, 'client', None) else "Unknown"
    # Simple struct for mongo
    log = {
        "user_id": user.get("id", str(user.get("_id", ""))),
        "user_name": user.get("name"),
        "action": action,
        "module": module,
        "details": details,
        "ip_address": ip_address,
        "created_at": datetime.utcnow()
    }
    await db["audit_logs"].insert_one(log)
