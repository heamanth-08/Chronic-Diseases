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

# 15 Specific Clinical Stage 1 Question Features
STAGE1_FEATURES = [
    "age",
    "sex",
    "bmi",
    "smoker",
    "phys_activity",
    "sleep_hours",
    "high_bp",
    "high_chol",
    "family_history",
    "weight_change",
    "tired_energy",
    "breath_chest_discomfort",
    "increased_thirst_urination",
    "swelling",
    "gen_health"
]

# 10 In-depth Clinical Stage 2 Question Features
STAGE2_FEATURES = [
    "symptom_duration",
    "symptom_frequency",
    "worse_with_exertion",
    "sleep_disturbance",
    "unexplained_body_changes",
    "family_chronic_diagnosis",
    "taking_medication",
    "doctor_visit_12m",
    "daily_life_impact",
    "has_additional_concerns"
]

def generate_stage1_dataset(n_samples=3000, random_state=42):
    np.random.seed(random_state)
    
    # 1. Age (18-100)
    age = np.random.randint(18, 85, size=n_samples)
    
    # 2. Biological Sex (0: Female, 1: Male)
    sex = np.random.choice([0, 1], p=[0.51, 0.49], size=n_samples)
    
    # 3. BMI (calculated from height & weight, average 26.5)
    bmi = np.random.normal(26.5, 5.2, size=n_samples).clip(16.0, 48.0)
    
    # 4. Tobacco/Smoking (0: Never, 1: Former smoker, 2: Current smoker)
    smoker = np.random.choice([0, 1, 2], p=[0.55, 0.25, 0.20], size=n_samples)
    
    # 5. Physical Activity (0: Sedentary, 1: Light, 2: Moderate, 3: Active)
    phys_activity = np.random.choice([0, 1, 2, 3], p=[0.30, 0.30, 0.25, 0.15], size=n_samples)
    
    # 6. Sleep Hours (0: <5h, 1: 5-6h, 2: 7-8h, 3: >9h)
    sleep_hours = np.random.choice([0, 1, 2, 3], p=[0.15, 0.30, 0.45, 0.10], size=n_samples)
    
    # 7. High Blood Pressure Doctor Diagnosis (0: No, 1: Not sure, 2: Pregnancy only, 3: Yes)
    high_bp = np.random.choice([0, 1, 2, 3], p=[0.60, 0.10, 0.05, 0.25], size=n_samples)
    
    # 8. High Cholesterol Doctor Diagnosis (0: No, 1: Never checked, 2: Yes)
    high_chol = np.random.choice([0, 1, 2], p=[0.55, 0.20, 0.25], size=n_samples)
    
    # 9. Family History Conditions Count (0 to 4 conditions)
    family_history = np.random.choice([0, 1, 2, 3, 4], p=[0.40, 0.30, 0.18, 0.09, 0.03], size=n_samples)
    
    # 10. Unexplained Weight Changes (0: No change, 1: Significant gain, 2: Significant loss)
    weight_change = np.random.choice([0, 1, 2], p=[0.70, 0.18, 0.12], size=n_samples)
    
    # 11. Tired/Low Energy Frequency (0: Never, 1: Sometimes, 2: Often, 3: Almost always)
    tired_energy = np.random.choice([0, 1, 2, 3], p=[0.35, 0.35, 0.20, 0.10], size=n_samples)
    
    # 12. Shortness of Breath / Chest Discomfort (0: Never, 1: Sometimes, 2: Often, 3: Always)
    breath_chest_discomfort = np.random.choice([0, 1, 2, 3], p=[0.60, 0.25, 0.10, 0.05], size=n_samples)
    
    # 13. Increased Thirst / Frequent Urination (0: Never, 1: Sometimes, 2: Often, 3: Always)
    increased_thirst_urination = np.random.choice([0, 1, 2, 3], p=[0.65, 0.20, 0.10, 0.05], size=n_samples)
    
    # 14. Swelling in feet/ankles/face (0: Never, 1: Sometimes, 2: Often, 3: Always)
    swelling = np.random.choice([0, 1, 2, 3], p=[0.70, 0.18, 0.08, 0.04], size=n_samples)
    
    # 15. Self-rated General Health (0: Excellent, 1: Very good, 2: Good, 3: Fair, 4: Poor)
    gen_health = np.random.choice([0, 1, 2, 3, 4], p=[0.20, 0.30, 0.30, 0.15, 0.05], size=n_samples)

    df = pd.DataFrame({
        "age": age,
        "sex": sex,
        "bmi": bmi,
        "smoker": smoker,
        "phys_activity": phys_activity,
        "sleep_hours": sleep_hours,
        "high_bp": high_bp,
        "high_chol": high_chol,
        "family_history": family_history,
        "weight_change": weight_change,
        "tired_energy": tired_energy,
        "breath_chest_discomfort": breath_chest_discomfort,
        "increased_thirst_urination": increased_thirst_urination,
        "swelling": swelling,
        "gen_health": gen_health
    })

    # Realistic clinical risk scores based on epidemiology & BRFSS/NHANES benchmarks
    # 1. Heart Disease
    heart_score = (
        (age > 50) * 1.5 + (age > 65) * 1.2 + (sex == 1) * 0.6 + (bmi > 30) * 1.3 +
        (smoker == 2) * 2.2 + (smoker == 1) * 0.8 +
        (high_bp == 3) * 2.6 + (high_bp == 2) * 1.0 +
        (high_chol == 2) * 2.2 +
        (breath_chest_discomfort >= 2) * 3.6 + (breath_chest_discomfort == 1) * 1.5 +
        (swelling >= 2) * 1.6 +
        (family_history >= 1) * 1.5 +
        (gen_health >= 3) * 1.2
    )
    y_heart = (heart_score + np.random.normal(0, 1.1, size=n_samples) > 6.2).astype(int)

    # 2. Diabetes
    diab_score = (
        (age > 45) * 1.8 + (bmi > 28) * 2.2 + (bmi > 35) * 1.6 +
        (phys_activity == 0) * 1.8 + (phys_activity == 1) * 0.8 +
        (high_bp == 3) * 1.5 + (high_chol == 2) * 1.2 +
        (increased_thirst_urination >= 2) * 3.8 + (increased_thirst_urination == 1) * 1.8 +
        (weight_change >= 1) * 1.5 +
        (tired_energy >= 2) * 1.2 +
        (family_history >= 1) * 1.8 +
        (gen_health >= 3) * 1.0
    )
    y_diabetes = (diab_score + np.random.normal(0, 1.1, size=n_samples) > 6.4).astype(int)

    # 3. Hypertension
    hyp_score = (
        (age > 40) * 2.0 + (age > 60) * 1.2 +
        (bmi > 27) * 1.8 +
        (high_bp == 3) * 4.6 + (high_bp == 2) * 2.2 +
        (high_chol == 2) * 1.8 +
        (smoker >= 1) * 1.2 +
        ((sleep_hours == 0) | (sleep_hours == 3)) * 1.2 +
        (phys_activity == 0) * 1.2 +
        (family_history >= 1) * 1.6 +
        (tired_energy >= 2) * 1.0
    )
    y_hypertension = (hyp_score + np.random.normal(0, 1.0, size=n_samples) > 5.8).astype(int)

    # 4. Kidney Disease
    kid_score = (
        (age > 55) * 1.6 +
        (high_bp == 3) * 2.8 +
        (high_chol == 2) * 1.2 +
        (swelling >= 2) * 3.8 + (swelling == 1) * 1.8 +
        (increased_thirst_urination >= 2) * 2.0 +
        (tired_energy >= 2) * 1.8 +
        (breath_chest_discomfort >= 2) * 1.2 +
        (family_history >= 1) * 1.8 +
        (gen_health >= 3) * 1.5
    )
    y_kidney = (kid_score + np.random.normal(0, 1.1, size=n_samples) > 6.2).astype(int)

    # 5. Respiratory (Asthma / COPD)
    resp_score = (
        (smoker == 2) * 3.8 + (smoker == 1) * 1.8 +
        (breath_chest_discomfort >= 2) * 4.0 + (breath_chest_discomfort == 1) * 2.0 +
        (tired_energy >= 2) * 1.4 +
        (sleep_hours == 0) * 1.2 +
        (family_history >= 1) * 1.4 +
        (gen_health >= 3) * 1.4
    )
    y_respiratory = (resp_score + np.random.normal(0, 1.1, size=n_samples) > 5.8).astype(int)

    targets = {
        "heart": y_heart,
        "diabetes": y_diabetes,
        "hypertension": y_hypertension,
        "kidney": y_kidney,
        "respiratory": y_respiratory
    }

    return df, targets

def generate_stage2_dataset(disease: str, n_samples=2500, random_state=42):
    np.random.seed(random_state + hash(disease) % 100)
    
    # 1. Symptom duration (0: <1w, 1: 1-4w, 2: 1-6m, 3: >6m)
    symptom_duration = np.random.choice([0, 1, 2, 3], p=[0.25, 0.30, 0.25, 0.20], size=n_samples)
    
    # 2. Symptom frequency (0: rarely, 1: sometimes, 2: most days, 3: every day)
    symptom_frequency = np.random.choice([0, 1, 2, 3], p=[0.20, 0.35, 0.30, 0.15], size=n_samples)
    
    # 3. Worse with exertion (0: no, 1: sometimes, 2: yes)
    worse_with_exertion = np.random.choice([0, 1, 2], p=[0.45, 0.30, 0.25], size=n_samples)
    
    # 4. Sleep disturbance (0: never, 1: sometimes, 2: often, 3: always)
    sleep_disturbance = np.random.choice([0, 1, 2, 3], p=[0.35, 0.35, 0.20, 0.10], size=n_samples)
    
    # 5. Unexplained body changes (0: no, 1: not sure, 2: yes)
    unexplained_body_changes = np.random.choice([0, 1, 2], p=[0.60, 0.15, 0.25], size=n_samples)
    
    # 6. Family chronic disease diagnosis (0: no, 1: not sure, 2: yes)
    family_chronic_diagnosis = np.random.choice([0, 1, 2], p=[0.40, 0.15, 0.45], size=n_samples)
    
    # 7. Taking regular medication (0: no, 1: yes)
    taking_medication = np.random.choice([0, 1], p=[0.60, 0.40], size=n_samples)
    
    # 8. Visited doctor in past 12m (0: no, 1: yes)
    doctor_visit_12m = np.random.choice([0, 1], p=[0.55, 0.45], size=n_samples)
    
    # 9. Daily life impact scale (1 to 5)
    daily_life_impact = np.random.choice([1, 2, 3, 4, 5], p=[0.25, 0.30, 0.25, 0.12, 0.08], size=n_samples)
    
    # 10. Has additional concerns (0: no, 1: yes)
    has_additional_concerns = np.random.choice([0, 1], p=[0.65, 0.35], size=n_samples)

    df = pd.DataFrame({
        "symptom_duration": symptom_duration,
        "symptom_frequency": symptom_frequency,
        "worse_with_exertion": worse_with_exertion,
        "sleep_disturbance": sleep_disturbance,
        "unexplained_body_changes": unexplained_body_changes,
        "family_chronic_diagnosis": family_chronic_diagnosis,
        "taking_medication": taking_medication,
        "doctor_visit_12m": doctor_visit_12m,
        "daily_life_impact": daily_life_impact,
        "has_additional_concerns": has_additional_concerns
    })

    # Disease-specific clinical risk calibration for Stage 2
    if disease == "heart":
        score = (
            worse_with_exertion * 2.8 +
            (symptom_frequency >= 2) * 2.0 + (symptom_frequency == 1) * 0.8 +
            (sleep_disturbance >= 2) * 1.8 +
            (symptom_duration >= 2) * 1.5 +
            (family_chronic_diagnosis == 2) * 1.6 +
            (daily_life_impact >= 3) * 1.8 + (daily_life_impact >= 4) * 1.2 +
            taking_medication * 1.2 + doctor_visit_12m * 1.0
        )
        threshold = 6.2
    elif disease == "diabetes":
        score = (
            (unexplained_body_changes == 2) * 3.0 +
            (symptom_duration >= 2) * 2.2 +
            (symptom_frequency >= 2) * 1.8 +
            (family_chronic_diagnosis == 2) * 2.0 +
            (sleep_disturbance >= 2) * 1.4 +
            (daily_life_impact >= 3) * 1.6 + (daily_life_impact >= 4) * 1.2 +
            taking_medication * 1.4 + doctor_visit_12m * 1.0
        )
        threshold = 6.0
    elif disease == "hypertension":
        score = (
            (sleep_disturbance >= 2) * 2.5 +
            (symptom_frequency >= 2) * 2.2 +
            (family_chronic_diagnosis == 2) * 2.2 +
            (daily_life_impact >= 3) * 2.0 +
            taking_medication * 1.8 +
            (symptom_duration >= 2) * 1.4 +
            doctor_visit_12m * 1.2
        )
        threshold = 6.0
    elif disease == "kidney":
        score = (
            (unexplained_body_changes == 2) * 3.4 +
            (symptom_duration >= 2) * 2.2 +
            (sleep_disturbance >= 2) * 1.8 +
            (family_chronic_diagnosis == 2) * 1.8 +
            (daily_life_impact >= 3) * 1.8 +
            taking_medication * 1.6 +
            doctor_visit_12m * 1.2
        )
        threshold = 6.2
    else: # respiratory
        score = (
            worse_with_exertion * 3.0 +
            (sleep_disturbance >= 2) * 2.6 +
            (symptom_frequency >= 2) * 2.0 +
            (symptom_duration >= 2) * 1.6 +
            (daily_life_impact >= 3) * 1.8 +
            doctor_visit_12m * 1.2 +
            taking_medication * 1.0
        )
        threshold = 6.2

    y = (score + np.random.normal(0, 0.9, size=n_samples) > threshold).astype(int)
    return df, y

def train_and_save_all_models():
    print("Training Stage 1 (15 Clinical Questions) & Stage 2 (10 Clinical Questions) Models...")
    metrics_report = {}

    df_stage1, targets_stage1 = generate_stage1_dataset()

    # Stage 1 ML Classifiers with optimized hyper-parameters
    stage1_models = {
        "heart": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(n_estimators=120, max_depth=6, min_samples_leaf=3, random_state=42))
        ]),
        "diabetes": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, C=1.5, random_state=42))
        ]),
        "hypertension": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(n_estimators=120, max_depth=6, min_samples_leaf=3, random_state=42))
        ]),
        "kidney": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(n_estimators=100, max_depth=5, min_samples_leaf=4, random_state=42))
        ]),
        "respiratory": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.07, eval_metric="logloss", random_state=42))
        ])
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scoring = ["accuracy", "precision", "recall", "f1", "roc_auc"]

    for disease, model in stage1_models.items():
        X = df_stage1
        y = targets_stage1[disease]
        
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
        print(f"Saved {filepath} | Accuracy: {metrics_report[f'{disease}_stage1']['accuracy']} | ROC-AUC: {metrics_report[f'{disease}_stage1']['roc_auc']}")

    # Stage 2 Models (10 Detailed In-depth Questions)
    stage2_models = {
        "heart": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(n_estimators=120, max_depth=5, min_samples_leaf=2, random_state=42))
        ]),
        "diabetes": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.08, eval_metric="logloss", random_state=42))
        ]),
        "hypertension": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, C=1.2, random_state=42))
        ]),
        "kidney": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(n_estimators=120, max_depth=5, min_samples_leaf=2, random_state=42))
        ]),
        "respiratory": Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("clf", GradientBoostingClassifier(n_estimators=100, max_depth=4, learning_rate=0.08, random_state=42))
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
        print(f"Saved {filepath} | Accuracy: {metrics_report[f'{disease}_stage2']['accuracy']} | ROC-AUC: {metrics_report[f'{disease}_stage2']['roc_auc']}")

    # Save metrics JSON
    metrics_path = os.path.join(MODEL_DIR, "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_report, f, indent=2)

    print(f"\nAll 10 models trained and metrics saved to {metrics_path} successfully.")

if __name__ == "__main__":
    train_and_save_all_models()
