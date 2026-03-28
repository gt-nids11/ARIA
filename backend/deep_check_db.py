from app.database import engine
import os
from sqlalchemy import inspect

print(f"Engine URL: {engine.url}")
# Resolve the path if it's sqlite
url_str = str(engine.url)
if url_str.startswith("sqlite:///"):
    db_path = url_str.replace("sqlite:///", "")
    abs_path = os.path.abspath(db_path)
    print(f"Absolute DB Path: {abs_path}")
    print(f"DB file exists: {os.path.exists(abs_path)}")
    
    # Check columns via SQLAlchemy inspector
    inspector = inspect(engine)
    if 'users' in inspector.get_table_names():
        cols = [c['name'] for c in inspector.get_columns('users')]
        print(f"Columns in users: {cols}")
    else:
        print("Table 'users' NOT FOUND.")
