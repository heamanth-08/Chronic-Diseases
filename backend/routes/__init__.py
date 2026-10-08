from fastapi import APIRouter
from backend.routes.auth import router as auth_router
from backend.routes.profile import router as profile_router
from backend.routes.assessment import router as assessment_router
from backend.routes.dashboard import router as dashboard_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(profile_router, prefix="/user", tags=["User Profile"])
api_router.include_router(assessment_router, prefix="/assessment", tags=["Assessment Screening"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
