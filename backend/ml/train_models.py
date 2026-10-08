import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

# Output directory
MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODEL_DIR, exist_ok=True)

# Question mapping for Stage 1 (15 general health questions)
STAGE1_FEATURES = [
    "age", "gender", "bmi", "smoking_status", "physical_activity", "alcohol_use",
    "high_bp_history", "chest_pain_exertion", "shortness_of_breath", "high_blood_sugar_history",
    "excessive_thirst_urination", "fatigue_weakness", "swollen_ankles_feet", "chronic_cough_wheezing",
    "family_history_score"
]

# Stage 2 specific questions per disease (10 questions each)
STAGE2_FEATURES = {
    "heart": [
        "chest_tightness_rest", "radiating_pain_arm_jaw", "heart_palpitations", "dizziness_lightheadedness",
        "exercise_tolerance_drops", "high_cholesterol_diagnosed", "sleep_apnea_snoring", "stress_level_high",
        "parent_early_heart_attack", "daily_sodium_intake_high"
    ],
    "diabetes": [
        "blurred_vision_episodes", "slow_healing_cuts", "tingling_numbness_feet", "frequent_skin_infections",
        "increased_hunger_unexplained", "unexplained_weight_loss", "waist_circumference_high", "gestational_diabetes_history",
        "sweet_cravings_post_meal", "darkened_skin_folds"
    ],
    "hypertension": [
        "morning_headaches_frequent", "pulsating_ear_sensation", "frequent_nosebleeds", "vision_blurring_sudden",
        "salt_craving_sensitivity", "chronic_stress_work", "poor_sleep_quality", "family_early_hypertension",
        "sedentary_desk_hours_high", "coffee_energy_drink_high"
    ],
    "kidney": [
        "foamy_bubbly_urine", "facial_puffiness_morning", "loss_of_appetite_metallic_taste", "persistent_skin_itching",
        "muscle_cramps_night", "frequent_nsaid_painkiller_use", "recurrent_urinary_infections", "family_kidney_disease",
        "decreased_urine_output", "unexplained_nausea_vomiting"
    ],
    "respiratory": [
        "daily_morning_phlegm", "wheezing_cold_air_exercise", "breathless_climbing_stairs", "frequent_chest_infections",
        "dust_smoke_chemical_exposure", "nighttime_cough_awakening", "chest_heaviness_allergies", "childhood_asthma_history",
        "pets_indoor_mold_exposure", "recovery_time_colds_long"
    ]
}

def generate_stage1_dataset(n_samples=2500, random_state=42):
    np.random.seed(random_state)
    
    age = np.random.randint(18, 85, size=n_samples)
    gender = np.random.choice([0, 1], size=n_samples) # 0: female, 1: male
    bmi = np.random.normal(27.5, 5.5, size=n_samples).clip(16.0, 50.0)
    smoking = np.random.choice([0, 1, 2], p=[0.55, 0.25, 0.20], size=n_samples) # 0: never, 1: former, 2: current
    activity = np.random.choice([0, 1, 2], p=[0.35, 0.45, 0.20], size=n_samples) # 0: low, 1: moderate, 2: high
    alcohol = np.random.choice([0, 1, 2], p=[0.40, 0.45, 0.15], size=n_samples)
    high_bp = np.random.choice([0, 1], p=[0.65, 0.35], size=n_samples)
    chest_pain = np.random.choice([0, 1], p=[0.82, 0.18], size=n_samples)
    shortness_breath = np.random.choice([0, 1], p=[0.78, 0.22], size=n_samples)
    high_sugar = np.random.choice([0, 1], p=[0.75, 0.25], size=n_samples)
    excess_thirst = np.random.choice([0, 1], p=[0.80, 0.20], size=n_samples)
    fatigue = np.random.choice([0, 1], p=[0.60, 0.40], size=n_samples)
    swollen_ankles = np.random.choice([0, 1], p=[0.85, 0.15], size=n_samples)
    chronic_cough = np.random.choice([0, 1], p=[0.82, 0.18], size=n_samples)
    fam_hist = np.random.choice([0, 1, 2, 3], p=[0.4, 0.3, 0.2, 0.1], size=n_samples)

    df = pd.DataFrame({
        "age": age, "gender": gender, "bmi": bmi, "smoking_status": smoking,
        "physical_activity": activity, "alcohol_use": alcohol, "high_bp_history": high_bp,
        "chest_pain_exertion": chest_pain, "shortness_of_breath": shortness_breath,
        "high_blood_sugar_history": high_sugar, "excessive_thirst_urination": excess_thirst,
        "fatigue_weakness": fatigue, "swollen_ankles_feet": swollen_ankles,
        "chronic_cough_wheezing": chronic_cough, "family_history_score": fam_hist
    })

    # Realistic clinical risk scores based on BRFSS coefficients
    # Heart
    heart_score = (
        (age > 50) * 1.5 + (age > 65) * 1.0 + (bmi > 30) * 1.2 + (smoking == 2) * 2.0 +
        high_bp * 2.2 + chest_pain * 3.5 + shortness_breath * 2.0 + (fam_hist >= 1) * 1.5
    )
    y_heart = (heart_score + np.random.normal(0, 1.2, size=n_samples) > 6.0).astype(int)

    # Diabetes
    diab_score = (
        (age > 45) * 1.8 + (bmi > 28) * 2.2 + high_sugar * 3.8 + excess_thirst * 3.2 +
        (activity == 0) * 1.5 + (fam_hist >= 1) * 1.8 + high_bp * 1.2
    )
    y_diabetes = (diab_score + np.random.normal(0, 1.2, size=n_samples) > 6.5).astype(int)

    # Hypertension
    hyp_score = (
        (age > 40) * 2.0 + (bmi > 27) * 1.8 + high_bp * 4.0 + (smoking > 0) * 1.2 +
        (alcohol == 2) * 1.5 + (activity == 0) * 1.2 + (fam_hist >= 1) * 1.5
    )
    y_hypertension = (hyp_score + np.random.normal(0, 1.0, size=n_samples) > 5.5).astype(int)

    # Kidney
    kid_score = (
        (age > 55) * 1.5 + high_bp * 2.5 + high_sugar * 2.5 + swollen_ankles * 3.8 +
        fatigue * 1.5 + (fam_hist >= 2) * 1.8
    )
    y_kidney = (kid_score + np.random.normal(0, 1.2, size=n_samples) > 6.2).astype(int)

    # Respiratory
    resp_score = (
        (smoking == 2) * 3.5 + (smoking == 1) * 1.8 + chronic_cough * 4.0 +
        shortness_breath * 3.0 + fatigue * 1.0 + (fam_hist >= 1) * 1.2
    )
    y_respiratory = (resp_score + np.random.normal(0, 1.2, size=n_samples) > 5.8).astype(int)

    targets = {
        "heart": y_heart,
        "diabetes": y_diabetes,
        "hypertension": y_hypertension,
        "kidney": y_kidney,
        "respiratory": y_respiratory
    }

    return df, targets

def generate_stage2_dataset(disease, n_samples=1500, random_state=42):
    np.random.seed(random_state + 10)
    feats = STAGE2_FEATURES[disease]
    data = {}
    for f in feats:
        data[f] = np.random.choice([0, 1], p=[0.7, 0.3], size=n_samples)
    
    df = pd.DataFrame(data)
    # Target weighted by symptoms
    weights = np.linspace(0.8, 1.8, len(feats))
    score = np.dot(df.values, weights)
    y = (score + np.random.normal(0, 0.8, size=n_samples) > np.median(score)).astype(int)
    return df, y

def train_and_save_all_models():
    print("Training Stage 1 & Stage 2 Models for VitaScreen...")
    metrics_report = {}

    df_stage1, targets_stage1 = generate_stage1_dataset()

    # Stage 1 Algorithms per PRD:
    # Heart: Random Forest
    # Diabetes: Logistic Regression
    # Hypertension: Random Forest
    # Kidney: Decision Tree / Random Forest
    # Respiratory: XGBoost
    stage1_models = {
        "heart": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
        ]),
        "diabetes": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, C=1.0, random_state=42))
        ]),
        "hypertension": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
        ]),
        "kidney": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", DecisionTreeClassifier(max_depth=5, random_state=42))
        ]),
        "respiratory": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", XGBClassifier(n_estimators=80, max_depth=4, learning_rate=0.08, eval_metric="logloss", random_state=42))
        ])
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scoring = ["accuracy", "precision", "recall", "f1", "roc_auc"]

    for disease, model in stage1_models.items():
        X = df_stage1
        y = targets_stage1[disease]
        
        # SMOTE applied for training
        smote = SMOTE(random_state=42)
        X_res, y_res = smote.fit_resample(X, y)

        cv_results = cross_validate(model, X_res, y_res, cv=cv, scoring=scoring)
        model.fit(X_res, y_res)
        
        filepath = os.path.join(MODEL_DIR, f"{disease}_stage1_pipeline.pkl")
        joblib.dump(model, filepath)

        metrics_report[f"{disease}_stage1"] = {
            "accuracy": f"{cv_results['test_accuracy'].mean():.3f} ± {cv_results['test_accuracy'].std():.3f}",
            "precision": f"{cv_results['test_precision'].mean():.3f} ± {cv_results['test_precision'].std():.3f}",
            "recall": f"{cv_results['test_recall'].mean():.3f} ± {cv_results['test_recall'].std():.3f}",
            "f1": f"{cv_results['test_f1'].mean():.3f} ± {cv_results['test_f1'].std():.3f}",
            "roc_auc": f"{cv_results['test_roc_auc'].mean():.3f} ± {cv_results['test_roc_auc'].std():.3f}"
        }
        print(f"Saved {filepath} | ROC-AUC: {metrics_report[f'{disease}_stage1']['roc_auc']}")

    # Stage 2 Models per PRD:
    # Heart: Random Forest
    # Diabetes: XGBoost
    # Hypertension: Logistic Regression
    # Kidney: Random Forest
    # Respiratory: Gradient Boosting
    stage2_models = {
        "heart": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", RandomForestClassifier(n_estimators=80, max_depth=5, random_state=42))
        ]),
        "diabetes": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", XGBClassifier(n_estimators=80, max_depth=4, learning_rate=0.08, eval_metric="logloss", random_state=42))
        ]),
        "hypertension": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, random_state=42))
        ]),
        "kidney": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", RandomForestClassifier(n_estimators=80, max_depth=5, random_state=42))
        ]),
        "respiratory": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", GradientBoostingClassifier(n_estimators=80, max_depth=4, random_state=42))
        ])
    }

    for disease, model in stage2_models.items():
        X2, y2 = generate_stage2_dataset(disease)
        smote = SMOTE(random_state=42)
        X2_res, y2_res = smote.fit_resample(X2, y2)

        cv_results = cross_validate(model, X2_res, y2_res, cv=cv, scoring=scoring)
        model.fit(X2_res, y2_res)

        filepath = os.path.join(MODEL_DIR, f"{disease}_stage2_pipeline.pkl")
        joblib.dump(model, filepath)

        metrics_report[f"{disease}_stage2"] = {
            "accuracy": f"{cv_results['test_accuracy'].mean():.3f} ± {cv_results['test_accuracy'].std():.3f}",
            "precision": f"{cv_results['test_precision'].mean():.3f} ± {cv_results['test_precision'].std():.3f}",
            "recall": f"{cv_results['test_recall'].mean():.3f} ± {cv_results['test_recall'].std():.3f}",
            "f1": f"{cv_results['test_f1'].mean():.3f} ± {cv_results['test_f1'].std():.3f}",
            "roc_auc": f"{cv_results['test_roc_auc'].mean():.3f} ± {cv_results['test_roc_auc'].std():.3f}"
        }
        print(f"Saved {filepath} | ROC-AUC: {metrics_report[f'{disease}_stage2']['roc_auc']}")

    # Save metrics JSON
    metrics_path = os.path.join(MODEL_DIR, "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_report, f, indent=2)

    print(f"All 10 models trained and metrics saved to {metrics_path} successfully.")

if __name__ == "__main__":
    train_and_save_all_models()
