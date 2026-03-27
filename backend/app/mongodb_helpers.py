"""
MongoDB Helper functions for common operations
"""
from app.mongodb import get_mongodb
from bson import ObjectId
from typing import Any, Dict, List, Optional

async def insert_document(collection_name: str, document: Dict[str, Any]) -> str:
    """Insert a document and return its ID"""
    db = get_mongodb()
    result = await db[collection_name].insert_one(document)
    return str(result.inserted_id)

async def find_document(collection_name: str, query: Dict[str, Any]) -> Optional[Dict]:
    """Find a single document"""
    db = get_mongodb()
    document = await db[collection_name].find_one(query)
    if document:
        document['_id'] = str(document['_id'])
    return document

async def find_documents(collection_name: str, query: Dict[str, Any] = None, limit: int = 0, skip: int = 0) -> List[Dict]:
    """Find multiple documents"""
    db = get_mongodb()
    query = query or {}
    cursor = db[collection_name].find(query).skip(skip)
    if limit > 0:
        cursor = cursor.limit(limit)
    documents = await cursor.to_list(length=None)
    # Convert ObjectId to string
    for doc in documents:
        doc['_id'] = str(doc['_id'])
    return documents

async def update_document(collection_name: str, query: Dict[str, Any], update_data: Dict[str, Any]) -> int:
    """Update a document and return modified count"""
    db = get_mongodb()
    result = await db[collection_name].update_one(query, {"$set": update_data})
    return result.modified_count

async def delete_document(collection_name: str, query: Dict[str, Any]) -> int:
    """Delete a document and return deleted count"""
    db = get_mongodb()
    result = await db[collection_name].delete_one(query)
    return result.deleted_count

async def count_documents(collection_name: str, query: Dict[str, Any] = None) -> int:
    """Count documents matching query"""
    db = get_mongodb()
    query = query or {}
    return await db[collection_name].count_documents(query)

async def create_index(collection_name: str, field: str, unique: bool = False):
    """Create an index on a field"""
    db = get_mongodb()
    await db[collection_name].create_index(field, unique=unique)
