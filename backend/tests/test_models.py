import os
import pytest
from backend.services.ml_service import MLService
from backend.ml.train_models import STAGE1_FEATURES, STAGE2_FEATURES

def test_ml_service_models_loaded():
    ml = MLService()
    assert len(ml.stage1_models) == 5, f"Expected 5 stage 1 models, got {len(ml.stage1_models)}"
    assert len(ml.stage2_models) == 5, f"Expected 5 stage 2 models, got {len(ml.stage2_models)}"

def test_critical_patient_triggers_stage2():
    """
    Critical/high-risk patient with chest discomfort, high BP, high cholesterol,
    heavy smoking, and family history should trigger Stage 2 for in-depth evaluation.
    """
    ml = MLService()
    high_risk_input = {
        "age": 62,
        "sex": 1,
        "bmi": 32.5,
        "smoker": 2, # Current smoker
        "phys_activity": 0, # Sedentary
        "sleep_hours": 0, # < 5 hours
        "high_bp": 3, # Yes
        "high_chol": 2, # Yes
        "family_history": ["heart", "hypertension", "diabetes"],
        "weight_change": 1,
        "tired_energy": 3, # Almost always
        "breath_chest_discomfort": 3, # Always
        "increased_thirst_urination": 2,
        "swelling": 2,
        "gen_health": 4 # Poor
    }

    result = ml.predict_stage1(high_risk_input)
    assert result["requires_stage2"] is True, "High risk patient should require Stage 2 assessment"
    assert result["highest_risk_level"] in ["Moderate", "Elevated"]
    assert result["trigger_disease"] is not None
    print(f"\n[PASS] Critical Patient Test -> Highest Category: {result['trigger_disease']}, Risk Level: {result['highest_risk_level']}, Requires Stage 2: {result['requires_stage2']}")

def test_healthy_patient_bypasses_stage2():
    """
    Healthy/low-risk patient with no adverse symptoms should NOT trigger Stage 2
    and can directly proceed to their normal low-risk report.
    """
    ml = MLService()
    low_risk_input = {
        "age": 25,
        "sex": 0,
        "bmi": 21.8,
        "smoker": 0, # Never
        "phys_activity": 3, # Active
        "sleep_hours": 2, # 7-8 hours
        "high_bp": 0, # No
        "high_chol": 0, # No
        "family_history": ["none"],
        "weight_change": 0,
        "tired_energy": 0, # Never
        "breath_chest_discomfort": 0, # Never
        "increased_thirst_urination": 0, # Never
        "swelling": 0, # Never
        "gen_health": 0 # Excellent
    }

    result = ml.predict_stage1(low_risk_input)
    assert result["requires_stage2"] is False, "Healthy patient should not require Stage 2"
    assert result["highest_risk_level"] == "Low"
    print(f"\n[PASS] Low Risk Patient Test -> Highest Level: {result['highest_risk_level']}, Requires Stage 2: {result['requires_stage2']}")

def test_stage2_inference_and_explainability():
    """
    Tests Stage 2 in-depth inference with 10 questions and verifies SHAP/feature contributions.
    """
    ml = MLService()
    s1_answers = {
        "age": 58, "sex": 1, "bmi": 30.0, "smoker": 2, "phys_activity": 0,
        "sleep_hours": 0, "high_bp": 3, "high_chol": 2, "family_history": ["heart"],
        "weight_change": 1, "tired_energy": 2, "breath_chest_discomfort": 2,
        "increased_thirst_urination": 1, "swelling": 1, "gen_health": 3
    }
    s1_res = ml.predict_stage1(s1_answers)

    s2_answers = {
        "symptom_duration": 3, # More than 6 months
        "symptom_frequency": 3, # Every day
        "worse_with_exertion": 2, # Yes
        "sleep_disturbance": 2, # Often
        "unexplained_body_changes": 2, # Yes
        "family_chronic_diagnosis": 2, # Yes
        "taking_medication": 1, # Yes
        "doctor_visit_12m": 1, # Yes
        "daily_life_impact": 5, # Severely
        "additional_notes": "Occasional tight chest pressure radiating up left arm during brisk walks"
    }

    s2_result = ml.predict_stage2("heart", s1_answers, s1_res["results"], s2_answers)
    assert s2_result["disease_category"] == "heart"
    assert s2_result["final_score"] >= 0.60
    assert s2_result["overall_risk_level"] in ["Moderate", "Elevated"]
    assert len(s2_result["top_contributing_factors"]) > 0
    assert s2_result["specialist_referral"] != ""
    print(f"\n[PASS] Stage 2 In-depth Test -> Final Score: {s2_result['final_score']}, Overall Level: {s2_result['overall_risk_level']}, Factors Count: {len(s2_result['top_contributing_factors'])}")

if __name__ == "__main__":
    test_ml_service_models_loaded()
    test_critical_patient_triggers_stage2()
    test_healthy_patient_bypasses_stage2()
    test_stage2_inference_and_explainability()
    print("\n[SUCCESS] All Model and Stage 2 Workflow Tests Passed Successfully!")
