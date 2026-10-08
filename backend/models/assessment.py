import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    # Stage 1 Data
    stage1_answers = Column(JSON, nullable=False) # {q1: val, q2: val, ...}
    stage1_results = Column(JSON, nullable=False) # { "heart": {"score": 0.45, "level": "Moderate"}, ... }

    # Stage 2 Data (if triggered)
    stage2_disease = Column(String(50), nullable=True) # e.g. "heart", "diabetes", etc.
    stage2_answers = Column(JSON, nullable=True) # {q1: val, ...}
    stage2_results = Column(JSON, nullable=True) # { "score": 0.68, "level": "Elevated" }

    # Summary & Explainability
    primary_category = Column(String(50), nullable=False)
    overall_risk_level = Column(String(20), nullable=False) # "Low", "Moderate", "Elevated"
    risk_score = Column(Float, nullable=False)
    top_contributing_factors = Column(JSON, nullable=False) # list of { "factor": "High Blood Pressure", "impact": 0.28, "direction": "increases_risk", "plain_text": "..." }
    specialist_referral = Column(String(100), nullable=True)
    consultation_recommendation = Column(String(500), nullable=True)
    trend_status = Column(String(30), default="Stable") # "Improving", "Stable", "Increased"

    # Meta
    model_version = Column(String(30), default="1.0.0")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship
    user = relationship("User", back_populates="assessments")
