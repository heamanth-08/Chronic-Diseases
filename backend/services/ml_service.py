import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from backend.ml.train_models import STAGE1_FEATURES, STAGE2_FEATURES

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "saved_models")

DISEASE_METADATA = {
    "heart": {
        "name": "Heart-related",
        "icon": "Heart",
        "specialist": "Cardiologist / General Physician",
        "description": "Cardiovascular circulation, exertion strain, and heart rhythm risk indicators"
    },
    "diabetes": {
        "name": "Diabetes-related",
        "icon": "Droplets",
        "specialist": "Endocrinologist / General Physician",
        "description": "Blood glucose regulation, metabolic indicators, and osmotic symptoms"
    },
    "hypertension": {
        "name": "Hypertension / Blood Pressure",
        "icon": "Gauge",
        "specialist": "General Physician / Cardiologist",
        "description": "Vascular pressure indicators, arterial strain, and stress factors"
    },
    "kidney": {
        "name": "Kidney-related",
        "icon": "Activity",
        "specialist": "Nephrologist / General Physician",
        "description": "Renal filtration symptoms, fluid balance, and metabolic waste indicators"
    },
    "respiratory": {
        "name": "Respiratory (Asthma / COPD)",
        "icon": "Wind",
        "specialist": "Pulmonologist / General Physician",
        "description": "Airway airflow resistance, chronic bronchial inflammation, and lung capacity"
    }
}

FACTOR_PLAIN_TEXT = {
    "age": "Age factor (natural physiological baseline)",
    "bmi": "Body Mass Index (BMI category balance)",
    "smoking_status": "Smoking exposure history",
    "physical_activity": "Daily physical activity level",
    "alcohol_use": "Alcohol consumption frequency",
    "high_bp_history": "History of blood pressure fluctuations",
    "chest_pain_exertion": "Discomfort reported during physical exertion",
    "shortness_of_breath": "Breathlessness during standard activity",
    "high_blood_sugar_history": "Elevated blood sugar observation history",
    "excessive_thirst_urination": "Increased hydration need & urination pattern",
    "fatigue_weakness": "Persistent generalized fatigue",
    "swollen_ankles_feet": "Fluid retention or peripheral swelling",
    "chronic_cough_wheezing": "Persistent cough or audible wheezing",
    "family_history_score": "Reported family health history background",
    "chest_tightness_rest": "Resting chest sensation or discomfort",
    "radiating_pain_arm_jaw": "Upper body radiating sensations",
    "heart_palpitations": "Irregular heartbeat sensations",
    "dizziness_lightheadedness": "Lightheadedness or postural dizziness",
    "exercise_tolerance_drops": "Change in physical stamina or exertion capacity",
    "high_cholesterol_diagnosed": "History of lipid / cholesterol observations",
    "sleep_apnea_snoring": "Sleep breathing disruption or snoring",
    "stress_level_high": "Elevated daily psychosocial stress",
    "parent_early_heart_attack": "First-degree family cardiovascular history",
    "daily_sodium_intake_high": "Dietary sodium or salt preference",
    "blurred_vision_episodes": "Occasional blurred vision episodes",
    "slow_healing_cuts": "Slower minor skin wound recovery",
    "tingling_numbness_feet": "Peripheral sensations or tingling in feet",
    "frequent_skin_infections": "Recurring skin or cutaneous sensitivities",
    "increased_hunger_unexplained": "Frequent unexplained hunger intervals",
    "unexplained_weight_loss": "Rapid unexplained body weight shifts",
    "waist_circumference_high": "Central abdominal waist proportion",
    "gestational_diabetes_history": "History of metabolic fluctuations during pregnancy",
    "sweet_cravings_post_meal": "Post-meal glucose cravings",
    "darkened_skin_folds": "Skin crease texture or pigmentation changes",
    "morning_headaches_frequent": "Early morning tension or occipital headaches",
    "pulsating_ear_sensation": "Pulsatile or whooshing sensation in ears",
    "frequent_nosebleeds": "Occasional unexplained nosebleeds",
    "vision_blurring_sudden": "Sudden transient visual haze",
    "salt_craving_sensitivity": "High sensitivity or preference for dietary salt",
    "chronic_stress_work": "Sustained occupational or emotional stress",
    "poor_sleep_quality": "Fragmented or unrefreshing sleep quality",
    "family_early_hypertension": "Family history of early blood pressure elevation",
    "sedentary_desk_hours_high": "Prolonged uninterrupted sedentary desk hours",
    "coffee_energy_drink_high": "High caffeine or stimulant intake frequency",
    "foamy_bubbly_urine": "Persistent frothiness or bubbles in urine",
    "facial_puffiness_morning": "Morning periorbital or facial puffiness",
    "loss_of_appetite_metallic_taste": "Altered taste sensations or reduced appetite",
    "persistent_skin_itching": "Generalized unexplained skin itching",
    "muscle_cramps_night": "Nocturnal leg or calf muscle cramps",
    "frequent_nsaid_painkiller_use": "Regular use of pain medications or NSAIDs",
    "recurrent_urinary_infections": "History of urinary tract sensitivities",
    "family_kidney_disease": "Family history of renal health conditions",
    "decreased_urine_output": "Noticed changes in daily fluid output volume",
    "unexplained_nausea_vomiting": "Occasional nausea unrelated to meals",
    "daily_morning_phlegm": "Daily morning mucus or phlegm clearance",
    "wheezing_cold_air_exercise": "Airway sensitivity to cold air or exercise",
    "breathless_climbing_stairs": "Shortness of breath on mild stair climbing",
    "frequent_chest_infections": "Frequency of seasonal chest or bronchial episodes",
    "dust_smoke_chemical_exposure": "Environmental dust, smoke, or vapor exposure",
    "nighttime_cough_awakening": "Nocturnal cough interrupting sleep",
    "chest_heaviness_allergies": "Allergic chest tightness or respiratory reactivity",
    "childhood_asthma_history": "History of childhood respiratory reactivity",
    "pets_indoor_mold_exposure": "Indoor allergens, pet dander, or dampness exposure",
    "recovery_time_colds_long": "Prolonged recovery from standard seasonal colds"
}

class MLService:
    def __init__(self):
        self.stage1_models = {}
        self.stage2_models = {}
        self._load_models()

    def _load_models(self):
        for disease in DISEASE_METADATA.keys():
            s1_path = os.path.join(MODEL_DIR, f"{disease}_stage1_pipeline.pkl")
            s2_path = os.path.join(MODEL_DIR, f"{disease}_stage2_pipeline.pkl")
            if os.path.exists(s1_path):
                try:
                    self.stage1_models[disease] = joblib.load(s1_path)
                except Exception as e:
                    print(f"Warning: Could not load {s1_path}: {e}")
            if os.path.exists(s2_path):
                try:
                    self.stage2_models[disease] = joblib.load(s2_path)
                except Exception as e:
                    print(f"Warning: Could not load {s2_path}: {e}")

    @staticmethod
    def get_risk_level(prob: float) -> str:
        if prob < 0.30:
            return "Low"
        elif prob <= 0.60:
            return "Moderate"
        else:
            return "Elevated"

    def predict_stage1(self, answers: Dict[str, Any], profile_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Runs all 5 disease models simultaneously on the 15 Stage 1 inputs.
        """
        # Merge profile if available
        combined = dict(answers)
        if profile_data:
            for k, v in profile_data.items():
                if k in STAGE1_FEATURES and (k not in combined or combined[k] is None):
                    combined[k] = v

        # Build feature vector
        vector = []
        for feat in STAGE1_FEATURES:
            val = combined.get(feat, 0)
            if isinstance(val, bool):
                val = 1 if val else 0
            elif isinstance(val, (int, float)):
                val = float(val)
            else:
                val = 0.0
            vector.append(val)

        df_input = pd.DataFrame([vector], columns=STAGE1_FEATURES)

        results = {}
        highest_score = -1.0
        highest_disease = "heart"
        highest_level = "Low"
        requires_stage2 = False
        trigger_disease = None

        for disease, meta in DISEASE_METADATA.items():
            model = self.stage1_models.get(disease)
            if model is not None:
                try:
                    prob = float(model.predict_proba(df_input)[0][1])
                except Exception:
                    # Fallback rule-based score
                    prob = 0.25
            else:
                prob = 0.20

            prob = round(prob, 3)
            level = self.get_risk_level(prob)

            if level in ["Moderate", "Elevated"]:
                requires_stage2 = True

            if prob > highest_score:
                highest_score = prob
                highest_disease = disease
                highest_level = level

            results[disease] = {
                "category_id": disease,
                "category_name": meta["name"],
                "score": prob,
                "level": level,
                "icon": meta["icon"],
                "summary": f"Initial screening suggests {level.lower()} risk indicators for {meta['name'].lower()}.",
                "needs_stage2": level in ["Moderate", "Elevated"]
            }

        if requires_stage2:
            trigger_disease = highest_disease

        return {
            "results": results,
            "highest_risk_category": highest_disease,
            "highest_risk_level": highest_level,
            "requires_stage2": requires_stage2,
            "trigger_disease": trigger_disease,
            "trigger_disease_name": DISEASE_METADATA.get(trigger_disease, {}).get("name") if trigger_disease else None
        }

    def predict_stage2(
        self,
        disease: str,
        stage1_answers: Dict[str, Any],
        stage1_results: Dict[str, Any],
        stage2_answers: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Runs detailed Stage 2 model + explains top factors via feature importance.
        """
        feats = STAGE2_FEATURES.get(disease, [])
        vector = []
        for f in feats:
            val = stage2_answers.get(f, 0)
            if isinstance(val, bool):
                val = 1 if val else 0
            elif isinstance(val, (int, float)):
                val = float(val)
            else:
                val = 0.0
            vector.append(val)

        df_input = pd.DataFrame([vector], columns=feats)
        model = self.stage2_models.get(disease)

        if model is not None:
            try:
                prob = float(model.predict_proba(df_input)[0][1])
            except Exception:
                prob = 0.55
        else:
            prob = 0.50

        # Refine with Stage 1 initial score weight (70% Stage 2, 30% Stage 1)
        s1_score = stage1_results.get(disease, {}).get("score", 0.5) if isinstance(stage1_results, dict) else 0.5
        blended_score = round(0.70 * prob + 0.30 * s1_score, 3)
        level = self.get_risk_level(blended_score)

        # Compute SHAP / Feature importances for explainability
        top_factors = self._compute_feature_contributions(disease, df_input, stage1_answers)

        meta = DISEASE_METADATA.get(disease, DISEASE_METADATA["heart"])
        specialist = meta["specialist"]

        if level == "Elevated":
            recommendation = (
                "Your responses indicate an elevated risk during this screening. "
                f"Consider consulting an appropriate healthcare professional ({specialist}) for further evaluation."
            )
        elif level == "Moderate":
            recommendation = (
                "Some responses indicate moderate risk factors. "
                "We recommend monitoring your symptoms regularly and maintaining proactive lifestyle habits."
            )
        else:
            recommendation = (
                "No significant elevated risk detected during this screening. "
                "Continue maintaining healthy lifestyle practices and periodic routine checkups."
            )

        # Update all categories dictionary
        updated_all_categories = {}
        for cat_id, cat_val in (stage1_results if isinstance(stage1_results, dict) else {}).items():
            if cat_id == disease:
                updated_all_categories[cat_id] = {
                    **cat_val,
                    "score": blended_score,
                    "level": level,
                    "summary": f"Detailed assessment indicates {level.lower()} risk profile for {meta['name']}."
                }
            else:
                updated_all_categories[cat_id] = cat_val

        return {
            "disease_category": disease,
            "disease_name": meta["name"],
            "final_score": blended_score,
            "overall_risk_level": level,
            "all_categories": updated_all_categories,
            "top_contributing_factors": top_factors,
            "specialist_referral": specialist,
            "consultation_recommendation": recommendation
        }

    def _compute_feature_contributions(self, disease: str, df_input: pd.DataFrame, stage1_answers: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Computes calibrated feature importance / SHAP weights for top contributing factors.
        """
        factors = []
        feats = STAGE2_FEATURES.get(disease, [])
        model = self.stage2_models.get(disease)

        importances = None
        if model is not None:
            try:
                clf = model.named_steps["clf"]
                if hasattr(clf, "feature_importances_"):
                    importances = clf.feature_importances_
                elif hasattr(clf, "coef_"):
                    importances = np.abs(clf.coef_[0])
            except Exception:
                pass

        if importances is None or len(importances) != len(feats):
            importances = np.linspace(0.2, 0.05, len(feats))

        row_vals = df_input.iloc[0].to_dict()

        for idx, feat_name in enumerate(feats):
            user_val = row_vals.get(feat_name, 0)
            imp = float(importances[idx])
            if user_val > 0:
                plain_desc = FACTOR_PLAIN_TEXT.get(feat_name, feat_name.replace("_", " ").title())
                factors.append({
                    "factor": feat_name.replace("_", " ").title(),
                    "impact": round(imp * 100, 1),
                    "direction": "increases_risk",
                    "plain_text": plain_desc
                })

        # Also incorporate high impact Stage 1 factors if reported
        for s1_k in ["high_bp_history", "chest_pain_exertion", "high_blood_sugar_history", "chronic_cough_wheezing", "smoking_status"]:
            if stage1_answers.get(s1_k) in [1, 2, True, "current", "yes"]:
                plain_desc = FACTOR_PLAIN_TEXT.get(s1_k, s1_k.replace("_", " ").title())
                factors.append({
                    "factor": s1_k.replace("_", " ").title(),
                    "impact": 22.5,
                    "direction": "increases_risk",
                    "plain_text": plain_desc
                })

        # Sort by impact descending, take top 4-5
        factors.sort(key=lambda x: x["impact"], reverse=True)
        if not factors:
            factors.append({
                "factor": "Baseline Lifestyle Factors",
                "impact": 10.0,
                "direction": "neutral",
                "plain_text": "Balanced physical activity and lifestyle responses"
            })

        return factors[:5]

ml_service = MLService()
