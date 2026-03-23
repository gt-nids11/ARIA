from fastapi import APIRouter, Depends, UploadFile, File, Request, HTTPException
from .. import schemas, auth, database
import os, json, datetime
import fitz # PyMuPDF
from openai import OpenAI
from bson import ObjectId

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/upload", response_model=schemas.DocumentOut)
async def upload_document(file: UploadFile = File(...), db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user), req: Request = None):
    ext = file.filename.split('.')[-1].lower()
    if ext not in ["pdf", "txt"]: raise HTTPException(400, "Only PDF or TXT allowed")
    os.makedirs("uploads/", exist_ok=True)
    file_path = os.path.join("uploads/", file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    text = ""
    if ext == "pdf":
        try:
            doc = fitz.open(file_path)
            for page in doc: text += page.get_text()
        except: pass
    else:
        with open(file_path, "r", encoding="utf-8") as f: text = f.read()

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "Extract JSON: 'summary', 'key_decisions' (list), 'action_items' (list), 'deadlines' (list), 'stakeholders' (list)."},
                {"role": "user", "content": text[:8000]}
            ]
        )
        res_json = json.loads(response.choices[0].message.content)
    except Exception:
        res_json = {}

    doc_data = {
        "filename": file.filename,
        "file_path": file_path,
        "summary": res_json.get("summary", ""),
        "key_decisions": res_json.get("key_decisions", []),
        "action_items": res_json.get("action_items", []),
        "deadlines": res_json.get("deadlines", []),
        "stakeholders": res_json.get("stakeholders", []),
        "uploaded_by": current_user.get("id", str(current_user.get("_id"))),
        "created_at": datetime.datetime.utcnow()
    }
    res = await db["documents"].insert_one(doc_data)
    doc_data["_id"] = res.inserted_id
    await auth.log_api_action(db, current_user, "Upload Document", "Documents", f"File: {file.filename}", req)
    return database.fix_id(doc_data)

@router.get("/", response_model=list[schemas.DocumentOut])
async def get_all_documents(db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    docs = await db["documents"].find().to_list(100)
    return database.fix_ids(docs)

@router.get("/{doc_id}", response_model=schemas.DocumentOut)
async def get_document(doc_id: str, db = Depends(database.get_db), current_user: dict = Depends(auth.get_current_user)):
    doc = await db["documents"].find_one({"_id": ObjectId(doc_id)})
    if not doc: raise HTTPException(404)
    return database.fix_id(doc)
