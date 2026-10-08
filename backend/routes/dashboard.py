from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.database import get_db
from backend.models.user import User
from backend.models.profile import HealthProfile
from backend.models.assessment import Assessment
from backend.schemas.assessment import DashboardSummary, CategoryTrend, AssessmentSummary
from backend.services.auth_service import get_current_user
from backend.services.ml_service import DISEASE_METADATA

router = APIRouter()

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    assessments = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .all()
    )

    user_name = current_user.full_name or current_user.email.split("@")[0]
    user_age = profile.age if profile else 30
    last_date = assessments[0].created_at if assessments else None

    # Determine latest status per disease
    latest = assessments[0] if assessments else None
    elevated_categories = []
    category_trends = []

    for cat_id, meta in DISEASE_METADATA.items():
        score = 0.15
        level = "Low"
        trend_status = "Stable"

        if latest and latest.stage1_results and cat_id in latest.stage1_results:
            cat_data = latest.stage1_results[cat_id]
            score = cat_data.get("score", 0.15)
            level = cat_data.get("level", "Low")
            
            # Check previous assessment for this category
            if len(assessments) > 1 and assessments[1].stage1_results and cat_id in assessments[1].stage1_results:
                prev_cat_score = assessments[1].stage1_results[cat_id].get("score", score)
                diff = score - prev_cat_score
                if diff > 0.05:
                    trend_status = "Increased"
                elif diff < -0.05:
                    trend_status = "Improving"

        if level == "Elevated":
            elevated_categories.append(meta["name"])

        category_trends.append(
            CategoryTrend(
                category_id=cat_id,
                category_name=meta["name"],
                current_level=level,
                current_score=score,
                trend_status=trend_status,
                icon=meta["icon"]
            )
        )

    # Trend history line chart data (chronological)
    trend_history = []
    for a in reversed(assessments[:10]): # Take last 10 in chronological order
        point = {
            "id": a.id,
            "date": a.created_at.strftime("%b %d"),
            "full_date": a.created_at.strftime("%B %d, %Y"),
            "overall_score": a.risk_score,
            "overall_level": a.overall_risk_level
        }
        if a.stage1_results:
            for c_id, c_data in a.stage1_results.items():
                point[c_id] = round(c_data.get("score", 0.0) * 100, 1)
        trend_history.append(point)

    recent_summaries = [
        AssessmentSummary(
            id=a.id,
            created_at=a.created_at,
            overall_risk_level=a.overall_risk_level,
            primary_category=DISEASE_METADATA.get(a.primary_category, {}).get("name", a.primary_category.title()),
            risk_score=a.risk_score,
            trend_status=a.trend_status
        )
        for a in assessments[:5]
    ]

    return DashboardSummary(
        user_name=user_name,
        age=user_age,
        last_analysis_date=last_date,
        has_elevated_risk=len(elevated_categories) > 0,
        elevated_categories=elevated_categories,
        categories=category_trends,
        trend_history=trend_history,
        recent_assessments=recent_summaries,
        total_assessments=len(assessments)
    )
