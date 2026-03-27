# MongoDB Integration Guide

## Setup

MongoDB has been integrated into your ARIA backend alongside PostgreSQL. The application now supports both databases for different use cases.

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

The following packages have been added:
- `motor` - Async MongoDB driver for FastAPI
- `pymongo` - MongoDB Python driver

### 2. Configure MongoDB URL

Add the MongoDB connection string to your `.env` file:

```
MONGODB_URL=mongodb://localhost:27017
```

**Connection String Examples:**
- **Local MongoDB**: `mongodb://localhost:27017`
- **MongoDB Atlas Cloud**: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
- **Remote MongoDB**: `mongodb://host:port`

If no `MONGODB_URL` is provided, it defaults to `mongodb://localhost:27017`.

### 3. Start MongoDB Server

**Local Setup:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Or use Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Verify Connection

The app will automatically test the MongoDB connection on startup. Check the logs for:
```
✓ Connected to MongoDB
```

## Usage

### In Your Route Handlers

```python
from fastapi import APIRouter
from app.mongodb_helpers import insert_document, find_documents

router = APIRouter()

@router.post("/analytics/save")
async def save_analytics(data: dict):
    doc_id = await insert_document("analytics", data)
    return {"id": doc_id}

@router.get("/analytics")
async def get_analytics(skip: int = 0, limit: int = 10):
    docs = await find_documents("analytics", skip=skip, limit=limit)
    return {"data": docs}
```

### Available Helper Functions

```python
from app.mongodb_helpers import (
    insert_document,
    find_document,
    find_documents,
    update_document,
    delete_document,
    count_documents,
    create_index
)

# Insert
doc_id = await insert_document("users", {"name": "John", "email": "john@example.com"})

# Find one
user = await find_document("users", {"email": "john@example.com"})

# Find many
users = await find_documents("users", limit=10)

# Update
modified = await update_document("users", {"email": "john@example.com"}, {"name": "Jane"})

# Delete
deleted = await delete_document("users", {"email": "john@example.com"})

# Count
count = await count_documents("users")

# Create index
await create_index("users", "email", unique=True)
```

### Direct MongoDB Access

For advanced queries, access the database directly:

```python
from app.mongodb import get_mongodb

db = get_mongodb()
collection = db["mycollection"]

# Insert multiple
result = await collection.insert_many([{"a": 1}, {"a": 2}])

# Aggregate
pipeline = [
    {"$match": {"status": "active"}},
    {"$group": {"_id": "$category", "count": {"$sum": 1}}}
]
results = await collection.aggregate(pipeline).to_list(length=None)
```

## Database Design Recommendations

### Suggested Collections

Based on your ARIA application, consider these collections:

```
aria/
├── users              # User data and authentication
├── audit_logs         # Audit trail for all activities
├── analytics          # Aggregated analytics data
├── cache              # Session cache and temporary data
├── documents          # Full-text searchable documents
├── meeting_transcripts # RAG-enriched meeting data
└── insights           # Pre-computed insights and summaries
```

### Example Schema

```javascript
// users collection
{
  _id: ObjectId,
  email: String,
  name: String,
  role: String,
  created_at: Date,
  last_login: Date
}

// audit_logs collection
{
  _id: ObjectId,
  user_id: String,
  action: String,
  resource_type: String,
  resource_id: String,
  changes: Object,
  timestamp: Date,
  ip_address: String
}

// analytics collection
{
  _id: ObjectId,
  metric_type: String,
  value: Number,
  timestamp: Date,
  tags: [String]
}
```

## Hybrid Usage: PostgreSQL + MongoDB

Your app now supports both:
- **PostgreSQL** (via SQLAlchemy): Relational data (users, meetings, schedules)
- **MongoDB** (via Motor): Document storage, analytics, caching

### When to use each:

**PostgreSQL:**
- Relational data with complex joins
- ACID transactions required
- Structured data with fixed schema

**MongoDB:**
- Flexible schema documents
- Aggregation pipelines and analytics
- High-volume, append-only logs
- Caching and temporary data
- Full-text search and indexing

## Troubleshooting

### Connection Refused
- Ensure MongoDB server is running: `mongodb://localhost:27017`
- Check firewall settings if using remote MongoDB
- Verify `MONGODB_URL` in `.env`

### Slow Queries
- Create indexes on frequently queried fields:
  ```python
  await create_index("documents", "user_id")
  await create_index("documents", [("created_at", -1)])
  ```

### Database Not Found
- MongoDB automatically creates the `aria` database on first connection
- Collections are created when first accessed

## Production Deployment

For production, use MongoDB Atlas or a managed MongoDB service:

1. Create a MongoDB Atlas cluster
2. Get the connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
3. Set in `.env`:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Next Steps

1. Update `.env` with your MongoDB connection string
2. Run the backend: `python -m uvicorn app.main:app --reload`
3. Monitor logs for successful MongoDB connection
4. Start creating collections and documents in your routes!
