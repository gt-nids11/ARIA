from fastapi import APIRouter, Depends
from .. import schemas, auth, database

router = APIRouter()

@router.get("/", response_model=list[schemas.AuditLogOut])
async def get_audit_logs(db = Depends(database.get_db), current_user: dict = Depends(auth.role_required(["admin"]))):
    logs = await db["audit_logs"].find().sort("created_at", -1).to_list(100)
    return database.fix_ids(logs)
