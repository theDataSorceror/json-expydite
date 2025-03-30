# debug_app.py

import uvicorn
from app.main import app  # Import your FastAPI app from the main module

if __name__ == "__main__":
    try:
        uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
    except SystemExit as e:
        print("Server stopped with exit code:", e.code)
        raise e  # Re-raise the exception if needed
