from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import engine, Base
from backend.routes import api_router

# Initialize database schema tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VitaScreen — AI-Powered Early Chronic Disease Risk Screening & Monitoring API"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "name": "VitaScreen API",
        "status": "operational",
        "version": settings.VERSION,
        "disclaimer": (
            "This system provides an AI-based risk assessment for early awareness "
            "and does not provide a medical diagnosis. The results should not "
            "replace professional medical advice."
        )
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "VitaScreen Backend"}
