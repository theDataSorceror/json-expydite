from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router


app = FastAPI(title="JSON Expydite API")

# Allow CORS from specific origins
origins = [
    "http://localhost:5173",  # Your frontend origin
    # You can add more allowed origins here if needed
]

# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the frontend to access the backend
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Allows all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn

    # uvicorn.run(app, host="0.0.0.0", port=8000)
