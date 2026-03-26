import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("MONGODB_DB_NAME", "aria_db")

class Database:
    client = None
    db = None

db_state = Database()

def connect_db():
    db_state.client = AsyncIOMotorClient(MONGODB_URL)
    db_state.db = db_state.client[DATABASE_NAME]

def close_db():
    if db_state.client:
        db_state.client.close()

async def get_db():
    yield db_state.db

def fix_id(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc

def fix_ids(docs):
    return [fix_id(doc) for doc in docs]
