import sqlite3

def add_column():
    try:
        conn = sqlite3.connect('aria.db')
        cursor = conn.cursor()
        
        print("Checking for clearance_level column...")
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'clearance_level' not in columns:
            print("Adding clearance_level column...")
            cursor.execute("ALTER TABLE users ADD COLUMN clearance_level INTEGER DEFAULT 1;")
            conn.commit()
            print("Done.")
        else:
            print("Column already exists.")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_column()
