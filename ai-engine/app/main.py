from fastapi import FastAPI
from app.routes.analyze import router as analyze_router

from app.routes.simulate import (
    router as simulate_router
)

app = FastAPI(
    title="Merchanta AI",
    version="1.0"
)
@app.get("/")
def home():
    return {
        "success": True,
        "message": "Merchanta AI Running, ready to analyze product representations!",
        "docs":
            "/docs",
    }

app.include_router(analyze_router)

app.include_router(simulate_router)