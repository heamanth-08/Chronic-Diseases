# VitaScreen — Skills & Capabilities

## Core Skill: AI-Powered Chronic Disease Risk Screening

### What This System Does
- Performs two-stage early risk screening across 5 chronic disease categories
- Stage 1: 15 general questions → 5 ML models → risk triage
- Stage 2: 10 disease-specific questions → detailed risk assessment
- Generates explainable results with SHAP/feature importance
- Tracks longitudinal health risk with trend comparison
- Produces downloadable PDF health risk reports

### Disease Categories Supported
1. Heart-related
2. Diabetes-related
3. Hypertension / Blood pressure-related
4. Kidney-related
5. Respiratory (Asthma / COPD)

### ML Skills
- Binary classification using scikit-learn pipelines
- Model training with SMOTE for class imbalance
- SHAP TreeExplainer for model explainability
- 5-fold stratified cross-validation
- joblib pipeline serialization (preprocessing + model saved together)
- Evaluation: Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix

### Algorithms Used
| Disease | Stage 1 | Stage 2 |
|---|---|---|
| Heart | Random Forest | Random Forest |
| Diabetes | Logistic Regression | XGBoost |
| Hypertension | Random Forest | Logistic Regression |
| Kidney | Decision Tree / RF | Random Forest |
| Respiratory | XGBoost | Gradient Boosting |

### Frontend Skills
- React / Next.js component design
- Mobile-first responsive layout
- Risk badge rendering (icon + text label, never color alone)
- Multi-step questionnaire with progress tracking
- Line chart for health trend visualization
- PDF report preview and download

### Backend Skills
- FastAPI REST API design
- JWT authentication and session management
- Input validation and sanitization
- Preprocessing pipeline serving (consistent train/predict)
- PostgreSQL schema design and querying
- PDF generation with ReportLab or WeasyPrint

### Explainability Skills
- SHAP TreeExplainer for tree-based models
- Logistic Regression coefficient interpretation
- Plain-language factor explanation for end users
- Contributing factor bar chart generation

### Boundaries (What This System Cannot Do)
- Cannot diagnose any disease
- Cannot replace a licensed medical professional
- Cannot guarantee clinical accuracy
- Cannot recommend specific medications or treatments
- Cannot advise stopping any existing medication