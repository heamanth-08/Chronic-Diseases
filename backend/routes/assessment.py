from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.user import User
from backend.models.profile import HealthProfile
from backend.models.assessment import Assessment
from backend.schemas.assessment import (
    Stage1Request,
    Stage1Response,
    Stage2Request,
    Stage2Response,
    AssessmentSummary,
    AssessmentDetail,
    ComparisonResponse
)
from backend.services.auth_service import get_current_user
from backend.services.ml_service import ml_service, DISEASE_METADATA
from backend.services.pdf_service import generate_assessment_pdf

router = APIRouter()

def compute_trend(current_score: float, previous_score: float) -> str:
    diff = current_score - previous_score
    if diff > 0.05:
        return "Increased"
    elif diff < -0.05:
        return "Improving"
    return "Stable"

@router.post("/stage1", response_model=Stage1Response)
def perform_stage1_screening(
    request: Stage1Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    profile_dict = {}
    if profile:
        profile_dict = {
            "age": profile.age,
            "gender": 1 if profile.gender == "male" else 0,
            "bmi": profile.bmi,
            "smoking_status": 2 if profile.smoking_status == "current" else (1 if profile.smoking_status == "former" else 0),
            "physical_activity": 2 if profile.physical_activity == "high" else (1 if profile.physical_activity == "moderate" else 0),
            "alcohol_use": 2 if profile.alcohol_use == "regular" else (1 if profile.alcohol_use == "occasional" else 0),
            "family_history_score": len(profile.family_history) if profile.family_history else 0
        }

    s1_result = ml_service.predict_stage1(request.answers, profile_dict)
    
    created_id = None
    # If all Low risk, we can immediately save the completed assessment
    if not s1_result["requires_stage2"]:
        # Find previous assessment for trend
        prev_assessment = (
            db.query(Assessment)
            .filter(Assessment.user_id == current_user.id)
            .order_by(Assessment.created_at.desc())
            .first()
        )
        prev_score = prev_assessment.risk_score if prev_assessment else 0.20
        trend_status = compute_trend(0.20, prev_score)

        meta = DISEASE_METADATA.get(s1_result["highest_risk_category"], DISEASE_METADATA["heart"])
        
        assessment = Assessment(
            user_id=current_user.id,
            stage1_answers=request.answers,
            stage1_results=s1_result["results"],
            stage2_disease=None,
            stage2_answers=None,
            stage2_results=None,
            primary_category=s1_result["highest_risk_category"],
            overall_risk_level="Low",
            risk_score=0.20,
            top_contributing_factors=[
                {
                    "factor": "Healthy Overall Profile",
                    "impact": 5.0,
                    "direction": "decreases_risk",
                    "plain_text": "Balanced responses across all primary health screening categories."
                }
            ],
            specialist_referral=meta["specialist"],
            consultation_recommendation="No elevated risk detected. Continue periodic self-monitoring and healthy lifestyle choices.",
            trend_status=trend_status,
            model_version="1.0.0"
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        created_id = assessment.id

    return {
        "results": s1_result["results"],
        "highest_risk_category": s1_result["highest_risk_category"],
        "highest_risk_level": s1_result["highest_risk_level"],
        "requires_stage2": s1_result["requires_stage2"],
        "trigger_disease": s1_result["trigger_disease"],
        "trigger_disease_name": s1_result["trigger_disease_name"],
        "created_assessment_id": created_id
    }

@router.post("/stage2", response_model=Stage2Response)
def perform_stage2_assessment(
    request: Stage2Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    s2_result = ml_service.predict_stage2(
        disease=request.disease_category,
        stage1_answers=request.stage1_answers,
        stage1_results=request.stage1_results,
        stage2_answers=request.answers
    )

    # Previous assessment for trend
    prev_assessment = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .first()
    )
    prev_score = prev_assessment.risk_score if prev_assessment else s2_result["final_score"]
    trend_status = compute_trend(s2_result["final_score"], prev_score)

    assessment = Assessment(
        user_id=current_user.id,
        stage1_answers=request.stage1_answers,
        stage1_results=s2_result["all_categories"],
        stage2_disease=request.disease_category,
        stage2_answers=request.answers,
        stage2_results={
            "score": s2_result["final_score"],
            "level": s2_result["overall_risk_level"]
        },
        primary_category=request.disease_category,
        overall_risk_level=s2_result["overall_risk_level"],
        risk_score=s2_result["final_score"],
        top_contributing_factors=s2_result["top_contributing_factors"],
        specialist_referral=s2_result["specialist_referral"],
        consultation_recommendation=s2_result["consultation_recommendation"],
        trend_status=trend_status,
        model_version="1.0.0"
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return {
        "assessment_id": assessment.id,
        "disease_category": request.disease_category,
        "disease_name": s2_result["disease_name"],
        "final_score": s2_result["final_score"],
        "overall_risk_level": s2_result["overall_risk_level"],
        "all_categories": s2_result["all_categories"],
        "top_contributing_factors": s2_result["top_contributing_factors"],
        "specialist_referral": s2_result["specialist_referral"],
        "consultation_recommendation": s2_result["consultation_recommendation"],
        "trend_status": trend_status,
        "created_at": assessment.created_at
    }

# IMPORTANT: Static routes (/history, /compare) MUST come before the wildcard /{assessment_id} route
# to prevent FastAPI from matching 'history' or 'compare' as an assessment ID.

@router.get("/history", response_model=List[AssessmentSummary])
def get_assessment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessments = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .all()
    )
    return [
        {
            "id": a.id,
            "created_at": a.created_at,
            "overall_risk_level": a.overall_risk_level,
            "primary_category": DISEASE_METADATA.get(a.primary_category, {}).get("name", a.primary_category.title()),
            "risk_score": a.risk_score,
            "trend_status": a.trend_status
        }
        for a in assessments
    ]

@router.get("/compare/{id1}/{id2}", response_model=ComparisonResponse)
def compare_assessments(
    id1: str,
    id2: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    a1 = db.query(Assessment).filter(Assessment.id == id1, Assessment.user_id == current_user.id).first()
    a2 = db.query(Assessment).filter(Assessment.id == id2, Assessment.user_id == current_user.id).first()

    if not a1 or not a2:
        raise HTTPException(status_code=404, detail="One or both assessments not found.")

    # Order chronologically (a_old, a_new)
    if a1.created_at > a2.created_at:
        a_old, a_new = a2, a1
    else:
        a_old, a_new = a1, a2

    score_diff = round(a_new.risk_score - a_old.risk_score, 3)
    if score_diff > 0.05:
        change_label = "Increased"
        summary_msg = f"Your screening risk category has increased compared with your previous assessment on {a_old.created_at.strftime('%b %d, %Y')}."
    elif score_diff < -0.05:
        change_label = "Decreased"
        summary_msg = f"Your screening risk score has improved compared with your previous assessment on {a_old.created_at.strftime('%b %d, %Y')}."
    else:
        change_label = "Stable"
        summary_msg = "Your overall screening risk profile remains stable between assessments."

    # Compare answers to highlight changed input factors
    changed_factors = []
    old_s1 = a_old.stage1_answers or {}
    new_s1 = a_new.stage1_answers or {}

    for k in set(list(old_s1.keys()) + list(new_s1.keys())):
        v_old = old_s1.get(k)
        v_new = new_s1.get(k)
        if v_old != v_new:
            changed_factors.append({
                "factor_key": k,
                "factor_name": k.replace("_", " ").title(),
                "previous_value": str(v_old),
                "current_value": str(v_new)
            })

    return {
        "assessment_1": a_old,
        "assessment_2": a_new,
        "risk_change_label": change_label,
        "score_difference": score_diff,
        "changed_factors": changed_factors,
        "summary_message": summary_msg
    }

@router.get("/{assessment_id}", response_model=AssessmentDetail)
def get_assessment_by_id(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == assessment_id, Assessment.user_id == current_user.id)
        .first()
    )
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    return {
        "id": assessment.id,
        "user_id": assessment.user_id,
        "created_at": assessment.created_at,
        "primary_category": DISEASE_METADATA.get(assessment.primary_category, {}).get("name", assessment.primary_category.title()),
        "overall_risk_level": assessment.overall_risk_level,
        "risk_score": assessment.risk_score,
        "stage1_results": assessment.stage1_results,
        "stage2_disease": assessment.stage2_disease,
        "stage2_results": assessment.stage2_results,
        "top_contributing_factors": assessment.top_contributing_factors,
        "specialist_referral": assessment.specialist_referral,
        "consultation_recommendation": assessment.consultation_recommendation,
        "trend_status": assessment.trend_status,
        "model_version": assessment.model_version
    }

@router.get("/{assessment_id}/pdf")
def download_assessment_pdf(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == assessment_id, Assessment.user_id == current_user.id)
        .first()
    )
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    # Find previous assessment if any
    prev_assessment = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id, Assessment.created_at < assessment.created_at)
        .order_by(Assessment.created_at.desc())
        .first()
    )

    assessment_data = {
        "created_at": assessment.created_at,
        "primary_category": DISEASE_METADATA.get(assessment.primary_category, {}).get("name", assessment.primary_category.title()),
        "overall_risk_level": assessment.overall_risk_level,
        "risk_score": assessment.risk_score,
        "stage1_results": assessment.stage1_results,
        "top_contributing_factors": assessment.top_contributing_factors,
        "specialist_referral": assessment.specialist_referral,
        "consultation_recommendation": assessment.consultation_recommendation,
        "trend_status": assessment.trend_status,
        "model_version": assessment.model_version
    }

    prev_data = None
    if prev_assessment:
        prev_data = {
            "created_at": prev_assessment.created_at,
            "overall_risk_level": prev_assessment.overall_risk_level,
            "risk_score": prev_assessment.risk_score
        }

    pdf_bytes = generate_assessment_pdf(
        user_name=current_user.full_name or "User",
        user_email=current_user.email,
        assessment_data=assessment_data,
        previous_data=prev_data
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=vitascreen_report_{assessment_id[:8]}.pdf"
        }
    )
