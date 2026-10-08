from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

class ProfileCreate(BaseModel):
    age: int = Field(..., ge=18, le=120, description="Age in years (18+)")
    gender: str = Field(..., description="male, female, or other")
    height_cm: float = Field(..., ge=50, le=260, description="Height in cm")
    weight_kg: float = Field(..., ge=20, le=300, description="Weight in kg")
    smoking_status: str = Field(..., description="never, former, current")
    physical_activity: str = Field(..., description="low, moderate, high")
    alcohol_use: str = Field(..., description="none, occasional, regular")
    family_history: List[str] = Field(default_factory=list)
    existing_conditions: List[str] = Field(default_factory=list)

class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    smoking_status: Optional[str] = None
    physical_activity: Optional[str] = None
    alcohol_use: Optional[str] = None
    family_history: Optional[List[str]] = None
    existing_conditions: Optional[List[str]] = None

class ProfileResponse(BaseModel):
    id: str
    user_id: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    bmi: float
    smoking_status: str
    physical_activity: str
    alcohol_use: str
    family_history: List[str]
    existing_conditions: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
