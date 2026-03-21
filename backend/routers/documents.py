from fastapi import APIRouter, Depends, UploadFile, File, Request, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
import os, json
import fitz # PyMuPDF
from openai import OpenAI

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/upload", response_model=schemas.DocumentOut)
async def upload_document(
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user),
    req: Request = None
):
    valid_ext = ["pdf", "txt"]
    ext = file.filename.split(".")[-1].lower()
    if ext not in valid_ext:
        raise HTTPException(status_code=400, detail="Only PDF or TXT allowed")

    upload_dir = "uploads/"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    text = ""
    if ext == "pdf":
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
    else:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

    # Summarize with GPT-4o
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are an expert intelligence analyst for a government official. Extract the following from the document as JSON: 'summary' (short paragraph), 'key_decisions' (list of strings), 'action_items' (list of strings), 'deadlines' (list of strings), 'stakeholders' (list of strings)."},
            {"role": "user", "content": text[:8000]} # Limit to ~8k chars roughly for prompt
        ]
    )
    res_json = json.loads(response.choices[0].message.content)

    new_doc = models.Document(
        filename=file.filename,
        file_path=file_path,
        summary=res_json.get("summary", ""),
        key_decisions=res_json.get("key_decisions", []),
        action_items=res_json.get("action_items", []),
        deadlines=res_json.get("deadlines", []),
        stakeholders=res_json.get("stakeholders", []),
        uploaded_by=current_user.id
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    auth.log_api_action(db, current_user, "Upload Document", "Documents", f"File: {file.filename}", req)
    return new_doc

@router.get("/", response_model=list[schemas.DocumentOut])
def get_all_documents(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Document).all()

@router.get("/{doc_id}", response_model=schemas.DocumentOut)
def get_document(doc_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Document).filter(models.Document.id == doc_id).first()
