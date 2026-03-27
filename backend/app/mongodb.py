from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from typing import Optional

# Global MongoDB client
mongodb_client: Optional[AsyncIOMotorClient] = None
mongodb: Optional[AsyncIOMotorDatabase] = None

async def connect_to_mongo():
    """Connect to MongoDB on startup"""
    global mongodb_client, mongodb
    mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongodb = mongodb_client[settings.MONGODB_DB_NAME]
    try:
        # Verify connection by pinging the server
        await mongodb_client.admin.command('ping')
        print("Success: Connected to MongoDB")
    except Exception as e:
        print(f"Warning: Failed to connect to MongoDB. Is it running? {e}")

async def close_mongo_connection():
    """Close MongoDB connection on shutdown"""
    global mongodb_client, mongodb
    if mongodb_client:
        mongodb_client.close()
        mongodb = None
        print("Info: Disconnected from MongoDB")

def get_mongodb() -> AsyncIOMotorDatabase:
    """Get MongoDB database instance"""
    if mongodb is None:
        raise RuntimeError("MongoDB not initialized. Call connect_to_mongo() first.")
    return mongodb
