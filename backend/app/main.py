from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.yoga_routes import router as yoga_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(yoga_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the YoJa Yoga Posture Monitoring API"}