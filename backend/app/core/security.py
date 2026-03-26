# ARIA Security Module
# Last updated: 2026
# Implements: bcrypt hashing, JWT auth, rate limiting,
# account lockout, token blacklisting, input validation

from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from collections import defaultdict
import time
import re
from app.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

token_blacklist = set()
failed_attempts = defaultdict(list)

LOCKOUT_THRESHOLD = 5
LOCKOUT_DURATION = 300

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def validate_password(password: str) -> tuple[bool, str]:
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain an uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain a lowercase letter"
    if not re.search(r"[0-9]", password):
        return False, "Password must contain a number"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain a special character"
    return True, "OK"

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    if token in token_blacklist:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been invalidated. Please login again."
        )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

def invalidate_token(token: str):
    token_blacklist.add(token)

def record_failed_attempt(email: str):
    current_time = time.time()
    failed_attempts[email] = [t for t in failed_attempts[email] if current_time - t <= LOCKOUT_DURATION]
    failed_attempts[email].append(current_time)

def is_account_locked(email: str) -> bool:
    current_time = time.time()
    valid_attempts = [t for t in failed_attempts[email] if current_time - t <= LOCKOUT_DURATION]
    return len(valid_attempts) >= LOCKOUT_THRESHOLD

def clear_failed_attempts(email: str):
    failed_attempts[email] = []
