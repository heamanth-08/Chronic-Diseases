# VitaScreen
### AI-Powered Early Chronic Disease Risk Screening & Health Monitoring Platform
> "Spot health risks early." | Hackathon Prototype

---

## What Is VitaScreen
VitaScreen is an AI-powered web application for early chronic disease
risk screening. It uses a two-stage questionnaire system and machine
learning models to estimate health risk across five chronic disease
categories and tracks risk over time.

This is a RISK SCREENING tool. It is NOT a diagnostic system.
It does not diagnose, treat, or replace professional medical advice.

---

## Problem Statement
"Early symptom prediction system for chronic diseases."

Chronic diseases such as diabetes, heart disease, and hypertension are
often diagnosed late because early symptoms are subtle, go unnoticed,
or are never reported. VitaScreen aims to bridge this gap through
accessible, questionnaire-based AI risk screening.

---

## Supported Disease Categories
1. Heart-related
2. Diabetes-related
3. Hypertension / Blood pressure-related
4. Kidney-related
5. Respiratory (Asthma / COPD)

---

## Key Features
- Two-stage intelligent screening (15 general + 10 targeted questions)
- Separate ML model per disease category
- Explainable AI output using SHAP and feature importance
- Longitudinal health tracking with trend comparison
- Risk status: Improving / Stable / Increased
- Downloadable PDF health risk report
- Professional consultation recommendation by specialist type

---

## Application Flow
Sign Up → Onboarding → Dashboard → Start Analysis →
15 General Questions → Stage 1 ML Screening →
(If elevated) 10 Targeted Questions → Stage 2 Assessment →
Results + SHAP Explanation → PDF Report → Dashboard Update

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React / Next.js |
| Backend | Python, FastAPI |
| ML | scikit-learn, XGBoost, SHAP, imbalanced-learn |
| Database | PostgreSQL |
| Reports | ReportLab / WeasyPrint |
| Model saving | joblib |
| Auth | JWT + bcrypt |

---

## ML Models
| Disease | Stage 1 | Stage 2 |
|---|---|---|
| Heart | Random Forest | Random Forest |
| Diabetes | Logistic Regression | XGBoost |
| Hypertension | Random Forest | Logistic Regression |
| Kidney | Decision Tree / RF | Random Forest |
| Respiratory | XGBoost | Gradient Boosting |

---

## Datasets
| Disease | Dataset | Source |
|---|---|---|
| Heart | BRFSS 2015 Heart Disease | Kaggle / CDC |
| Diabetes | BRFSS Diabetes Health Indicators | Kaggle / CDC |
| Hypertension | BRFSS Hypertension subset | Kaggle / CDC |
| Kidney | UCI Chronic Kidney Disease | UCI ML Repository |
| Respiratory | BRFSS Asthma/COPD subset | Kaggle / CDC |

---

## Project Structure
vitascreen/
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── styles/
│ └── public/
├── backend/
│ ├── routes/
│ ├── models/
│ ├── schemas/
│ ├── services/
│ └── main.py
├── ml/
│ ├── datasets/
│ ├── notebooks/
│ ├── pipelines/
│ └── saved_models/
├── reports/
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt


---

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/your-team/vitascreen.git
cd vitascreen


### 2. Backend setup

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

Fill in your .env values

uvicorn main:app --reload


### 3. Frontend setup

cd frontend
npm install
npm run dev


### 4. ML setup

cd ml
pip install -r requirements.txt

Run notebooks in order to train and save models

---

## Environment Variables (.env)

DATABASE_URL=your_postgresql_url
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

Never commit your .env file.

---

## Git Rules
- Never push to main directly
- Use feature branches: feature/your-feature-name
- Pull request required for all merges
- Never commit: .env, dataset files, model .pkl files over 100MB

---

## Medical Disclaimer
This system provides an AI-based risk assessment for early awareness
and does not provide a medical diagnosis. The results should not
replace professional medical advice. If you have concerns about your
health, please consult a qualified healthcare professional.

---

## Team
| Name | Role |
|---|---|
| [Name 1] | ML Engineer |
| [Name 2] | Backend Developer |
| [Name 3] | Frontend Developer |
| [Name 4] | Data / Research |

---

## Hackathon
Event: [Hackathon Name]
Problem Statement: Early symptom prediction system for chronic diseases
Category: AI/ML for Health Tech

---

*"Early awareness. Better outcomes."*