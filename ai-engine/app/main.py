from fastapi import FastAPI
from app.routes.analyze import router as analyze_router

from app.routes.simulate import (
    router as simulate_router
)

app = FastAPI(
    title="AI Representation Optimizer",
    version="1.0"
)
@app.get("/")
def home():
    return {
        "message": "AI Representation Optimizer Running, ready to analyze product representations!",
        "Go to /docs for API documentation": "http://localhost:8000/docs"
    }

app.include_router(analyze_router)

app.include_router(simulate_router)