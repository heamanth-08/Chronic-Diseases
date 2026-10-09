from datetime import datetime
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class DiseaseRiskDetail(BaseModel):
    category_id: str
    category_name: str
    score: float
    level: str # "Low", "Moderate", "Elevated"
    icon: str
    summary: str
    needs_stage2: bool

class ContributingFactor(BaseModel):
    factor: str
    impact: float
    direction: str # "increases_risk", "decreases_risk", "neutral"
    plain_text: str

class Stage1Request(BaseModel):
    answers: Dict[str, Any] = Field(..., description="Map of question_id to user response value")

class Stage1Response(BaseModel):
    results: Dict[str, DiseaseRiskDetail]
    highest_risk_category: str
    highest_risk_level: str
    requires_stage2: bool
    trigger_disease: Optional[str] = None
    trigger_disease_name: Optional[str] = None
    created_assessment_id: Optional[str] = None

class Stage2Request(BaseModel):
    assessment_id: Optional[str] = None
    stage1_answers: Dict[str, Any]
    stage1_results: Dict[str, Any]
    disease_category: str
    answers: Dict[str, Any]

class Stage2Response(BaseModel):
    assessment_id: str
    disease_category: str
    disease_name: str
    final_score: float
    overall_risk_level: str
    all_categories: Dict[str, Any]  # Relaxed to Any to handle partial stage1 data
    top_contributing_factors: List[ContributingFactor]
    specialist_referral: str
    consultation_recommendation: str
    trend_status: str  # "Improving", "Stable", "Increased"
    created_at: datetime

class AssessmentSummary(BaseModel):
    id: str
    created_at: datetime
    overall_risk_level: str
    primary_category: str
    risk_score: float
    trend_status: str

class AssessmentDetail(BaseModel):
    id: str
    user_id: str
    created_at: datetime
    primary_category: str
    overall_risk_level: str
    risk_score: float
    stage1_results: Optional[Dict[str, Any]] = None
    stage2_disease: Optional[str] = None
    stage2_results: Optional[Dict[str, Any]] = None
    top_contributing_factors: List[ContributingFactor]
    specialist_referral: Optional[str] = None
    consultation_recommendation: Optional[str] = None
    trend_status: str
    model_version: str

    class Config:
        from_attributes = True

class CategoryTrend(BaseModel):
    category_id: str
    category_name: str
    current_level: str
    current_score: float
    trend_status: str # "Improving", "Stable", "Increased"
    icon: str

class DashboardSummary(BaseModel):
    user_name: str
    age: int
    last_analysis_date: Optional[datetime]
    has_elevated_risk: bool
    elevated_categories: List[str]
    categories: List[CategoryTrend]
    trend_history: List[Dict[str, Any]] # [{ date: ..., heart: 0.2, diabetes: 0.5, ... }]
    recent_assessments: List[AssessmentSummary]
    total_assessments: int

class ComparisonResponse(BaseModel):
    assessment_1: AssessmentDetail
    assessment_2: AssessmentDetail
    risk_change_label: str # "Increased", "Decreased", "Stable"
    score_difference: float
    changed_factors: List[Dict[str, Any]]
    summary_message: str
