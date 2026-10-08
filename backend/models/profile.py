import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, index=True, nullable=False)
    
    # Demographics & Physical
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False) # male, female, other
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)

    # Lifestyle & Medical Context
    smoking_status = Column(String(50), nullable=False) # never, former, current
    physical_activity = Column(String(50), nullable=False) # low, moderate, high
    alcohol_use = Column(String(50), nullable=False) # none, occasional, regular
    family_history = Column(JSON, default=list) # e.g. ["heart", "diabetes", "hypertension", "kidney", "respiratory"]
    existing_conditions = Column(JSON, default=list) # e.g. ["high_bp", "high_cholesterol", "asthma", "none"]

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="profile")
