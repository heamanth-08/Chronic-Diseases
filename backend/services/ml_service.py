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
    # Stage 1 factors
    "age": "Age factor (natural physiological baseline)",
    "sex": "Biological sex hormonal baseline",
    "bmi": "Body Mass Index (BMI category balance)",
    "smoker": "Tobacco & smoking exposure status",
    "phys_activity": "Weekly physical activity level",
    "sleep_hours": "Average nightly sleep duration",
    "high_bp": "History of high blood pressure diagnosis",
    "high_chol": "History of elevated cholesterol diagnosis",
    "family_history": "Reported family chronic illness background",
    "weight_change": "Recent unexplained weight fluctuation",
    "tired_energy": "Persistent unrefreshing fatigue or low energy",
    "breath_chest_discomfort": "Exertional breathlessness or chest discomfort",
    "increased_thirst_urination": "Increased thirst or frequent urination pattern",
    "swelling": "Fluid retention or peripheral/facial swelling",
    "gen_health": "Self-rated general health baseline",

    # Stage 2 factors (10 in-depth clinical questions)
    "symptom_duration": "Longstanding symptom chronicity (>1 month)",
    "symptom_frequency": "Frequent recurring symptoms (most days or daily)",
    "worse_with_exertion": "Symptoms worsening significantly on physical exertion",
    "sleep_disturbance": "Symptoms disturbing sleep or waking during night",
    "unexplained_body_changes": "Noticed physical changes (swelling/skin/fluid retention)",
    "family_chronic_diagnosis": "First-degree family history of serious chronic illness",
    "taking_medication": "Current use of regular prescription medications or supplements",
    "doctor_visit_12m": "Prior medical consultation for related concerns in past 12 months",
    "daily_life_impact": "High functional impairment on daily routine & activities",
    "has_additional_concerns": "Additional specific symptoms & patient notes reported"
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

    def _parse_feature_val(self, key: str, val: Any) -> float:
        if val is None:
            return 0.0
        if isinstance(val, bool):
            return 1.0 if val else 0.0
        if isinstance(val, (int, float)):
            return float(val)
        if isinstance(val, list):
            # For multiselect: count selected items excluding 'none'
            valid_items = [x for x in val if x and str(x).lower() != 'none']
            return float(len(valid_items))
        if isinstance(val, str):
            val_clean = val.strip().lower()
            if val_clean in ["male", "yes", "true", "severe", "always"]:
                return 1.0
            if val_clean in ["female", "no", "false", "none", "nothing to add", "never", "rarely"]:
                return 0.0
            try:
                return float(val)
            except ValueError:
                return 1.0 if len(val_clean) > 0 and val_clean != "nothing to add" else 0.0
        return 0.0

    def predict_stage1(self, answers: Dict[str, Any], profile_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Runs all 5 disease models simultaneously on the 15 Stage 1 inputs.
        """
        combined = dict(answers)
        if profile_data:
            for k, v in profile_data.items():
                if k in STAGE1_FEATURES and (k not in combined or combined[k] is None):
                    combined[k] = v

        # Build feature vector
        vector = []
        for feat in STAGE1_FEATURES:
            val = combined.get(feat)
            vector.append(self._parse_feature_val(feat, val))

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
                except Exception as e:
                    print(f"Error predicting stage 1 for {disease}: {e}")
                    prob = 0.25
            else:
                prob = 0.20

            prob = round(prob, 3)
            level = self.get_risk_level(prob)

            # Stage 2 triggered when patient risk is elevated or moderate
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
        Runs detailed Stage 2 model with the 10 in-depth clinical factors.
        """
        # Map user Stage 2 answers to feature vector
        vector = []
        for feat in STAGE2_FEATURES:
            if feat == "has_additional_concerns":
                notes_val = stage2_answers.get("additional_notes", stage2_answers.get("has_additional_concerns", ""))
                parsed_val = 1.0 if isinstance(notes_val, str) and notes_val.strip() and notes_val.strip().lower() != "nothing to add" else self._parse_feature_val(feat, notes_val)
            else:
                raw_val = stage2_answers.get(feat, 0)
                parsed_val = self._parse_feature_val(feat, raw_val)
            vector.append(parsed_val)

        df_input = pd.DataFrame([vector], columns=STAGE2_FEATURES)
        model = self.stage2_models.get(disease)

        if model is not None:
            try:
                prob = float(model.predict_proba(df_input)[0][1])
            except Exception as e:
                print(f"Error in stage 2 prediction: {e}")
                prob = 0.55
        else:
            prob = 0.50

        # Blended score (65% Stage 2 clinical depth, 35% Stage 1 screening)
        s1_score = stage1_results.get(disease, {}).get("score", 0.5) if isinstance(stage1_results, dict) else 0.5
        blended_score = round(0.65 * prob + 0.35 * s1_score, 3)
        level = self.get_risk_level(blended_score)

        # Compute Explainability / Contributing factors
        top_factors = self._compute_feature_contributions(disease, df_input, stage1_answers, stage2_answers)

        meta = DISEASE_METADATA.get(disease, DISEASE_METADATA["heart"])
        specialist = meta["specialist"]

        if level == "Elevated":
            recommendation = (
                "Your responses indicate an elevated risk during this screening. "
                f"Consider consulting an appropriate healthcare professional ({specialist}) for further diagnostic evaluation."
            )
        elif level == "Moderate":
            recommendation = (
                "Some responses indicate moderate risk factors. "
                "We recommend monitoring your symptoms regularly and maintaining proactive lifestyle and dietary habits."
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
                    "summary": f"In-depth assessment indicates {level.lower()} risk profile for {meta['name']}."
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

    def _compute_feature_contributions(
        self,
        disease: str,
        df_input: pd.DataFrame,
        stage1_answers: Dict[str, Any],
        stage2_answers: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Computes calibrated feature importance / weights for top contributing factors.
        """
        factors = []
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

        if importances is None or len(importances) != len(STAGE2_FEATURES):
            importances = np.linspace(0.20, 0.05, len(STAGE2_FEATURES))

        row_vals = df_input.iloc[0].to_dict()

        for idx, feat_name in enumerate(STAGE2_FEATURES):
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

        # Incorporate prominent Stage 1 factors if reported
        s1_impact_map = [
            ("high_bp", 3, 24.0),
            ("high_chol", 2, 20.0),
            ("breath_chest_discomfort", 2, 25.0),
            ("increased_thirst_urination", 2, 22.0),
            ("swelling", 2, 20.0),
            ("smoker", 2, 18.0),
            ("tired_energy", 2, 15.0),
            ("gen_health", 3, 14.0)
        ]

        for s1_k, threshold, weight in s1_impact_map:
            val = self._parse_feature_val(s1_k, stage1_answers.get(s1_k))
            if val >= threshold:
                plain_desc = FACTOR_PLAIN_TEXT.get(s1_k, s1_k.replace("_", " ").title())
                factors.append({
                    "factor": s1_k.replace("_", " ").title(),
                    "impact": weight,
                    "direction": "increases_risk",
                    "plain_text": plain_desc
                })

        # Sort by impact descending, take top 5
        factors.sort(key=lambda x: x["impact"], reverse=True)
        if not factors:
            factors.append({
                "factor": "Baseline Lifestyle Factors",
                "impact": 10.0,
                "direction": "neutral",
                "plain_text": "Balanced physical activity and healthy lifestyle responses"
            })

        return factors[:5]

ml_service = MLService()
