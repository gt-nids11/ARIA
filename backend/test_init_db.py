from app.main import init_db
import sys

try:
    print("Running init_db()...")
    init_db()
    print("init_db() completed successfully!")
except Exception as e:
    print(f"init_db() failed with error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
