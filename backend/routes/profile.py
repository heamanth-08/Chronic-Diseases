from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.models.profile import HealthProfile
from backend.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from backend.services.auth_service import get_current_user

router = APIRouter()

def calculate_bmi(height_cm: float, weight_kg: float) -> float:
    height_m = height_cm / 100.0
    if height_m <= 0:
        return 22.0
    return round(weight_kg / (height_m * height_m), 1)

@router.get("/profile", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health profile not found for this user. Please complete onboarding."
        )
    return profile

@router.post("/profile", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_or_replace_profile(
    profile_in: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    bmi = calculate_bmi(profile_in.height_cm, profile_in.weight_kg)

    if existing:
        existing.age = profile_in.age
        existing.gender = profile_in.gender
        existing.height_cm = profile_in.height_cm
        existing.weight_kg = profile_in.weight_kg
        existing.bmi = bmi
        existing.smoking_status = profile_in.smoking_status
        existing.physical_activity = profile_in.physical_activity
        existing.alcohol_use = profile_in.alcohol_use
        existing.family_history = profile_in.family_history
        existing.existing_conditions = profile_in.existing_conditions
        db.commit()
        db.refresh(existing)
        return existing

    profile = HealthProfile(
        user_id=current_user.id,
        age=profile_in.age,
        gender=profile_in.gender,
        height_cm=profile_in.height_cm,
        weight_kg=profile_in.weight_kg,
        bmi=bmi,
        smoking_status=profile_in.smoking_status,
        physical_activity=profile_in.physical_activity,
        alcohol_use=profile_in.alcohol_use,
        family_history=profile_in.family_history,
        existing_conditions=profile_in.existing_conditions
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health profile not found."
        )

    for field, val in profile_update.dict(exclude_unset=True).items():
        if val is not None:
            setattr(profile, field, val)

    profile.bmi = calculate_bmi(profile.height_cm, profile.weight_kg)
    db.commit()
    db.refresh(profile)
    return profile
