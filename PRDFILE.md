# VitaScreen — Product Requirements Document (PRD)
**Version:** 1.0
**Status:** Draft
**Type:** Hackathon Prototype
**Last Updated:** October 2026

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Name
VitaScreen

### 1.2 Tagline
"Spot health risks early."

### 1.3 Product Type
AI-powered early chronic disease risk screening and health monitoring
web application.

### 1.4 Problem Statement (Assigned)
"Early symptom prediction system for chronic diseases."

### 1.5 Product Summary
VitaScreen is a web application that allows users to complete a
structured two-stage health questionnaire. Machine learning models
evaluate the responses and estimate the user's risk level across five
chronic disease categories. The system stores assessment history,
tracks risk over time, and generates downloadable health risk reports.

### 1.6 Medical Boundary (Non-Negotiable)
VitaScreen is a RISK SCREENING tool.
It is NOT a diagnostic system.
It does NOT diagnose, treat, prescribe, or replace professional
medical advice under any circumstances.
Every feature, screen, output, and report must reflect this boundary.

---

## 2. GOALS AND OBJECTIVES

### 2.1 Primary Goal
Enable early awareness of chronic disease risk through an accessible,
AI-powered, questionnaire-based screening system.

### 2.2 Secondary Goals
- Provide explainable, understandable risk outputs (not just a number)
- Track health risk over time with trend comparison
- Encourage timely professional medical consultation when risk is elevated
- Demonstrate responsible AI use in health tech at hackathon level

### 2.3 Success Criteria (Hackathon)
- Complete two-stage screening flow works end to end
- At least 3 of 5 disease ML models trained and serving predictions
- Dashboard displays risk overview and trend chart
- PDF report generates successfully
- Comparison with previous assessment works
- Medical disclaimer present on every screen and report
- Demo scenario runs without errors

---

## 3. TARGET USERS

### 3.1 Primary User
General public, 18 years and above, with no medical background.
People who want to check their health risk before visiting a doctor.

### 3.2 Secondary User
Individuals with family history of chronic diseases seeking early
awareness.

### 3.3 User Characteristics
- May have no medical knowledge
- Expects simple, plain-language output
- Uses mobile as the primary device
- Does not want to be alarmed unnecessarily
- Needs clear guidance on what to do next

### 3.4 Out of Scope Users
- Licensed medical professionals (this is not a clinical tool)
- Children under 18
- Users seeking emergency medical assistance

---

## 4. SUPPORTED DISEASE CATEGORIES

Exactly five categories are supported in this prototype.
No additional categories may be added without updating this PRD.

| # | Category | Specialist Referral |
|---|---|---|
| 1 | Heart-related | Cardiologist / General Physician |
| 2 | Diabetes-related | Endocrinologist / General Physician |
| 3 | Hypertension / Blood pressure-related | General Physician / Cardiologist |
| 4 | Kidney-related | Nephrologist / General Physician |
| 5 | Respiratory (Asthma / COPD) | Pulmonologist / General Physician |

---

## 5. CORE FEATURES

### 5.1 User Authentication
**Priority:** P0 (must have)
- User registration with email and password
- Secure login
- Password hashing (bcrypt)
- JWT session management
- Logout

### 5.2 Onboarding / Health Profile
**Priority:** P0 (must have)
- Step 1: Name, age, gender, height, weight (auto BMI), email
- Step 2: Smoking status, physical activity level, alcohol use,
  family history checklist, existing conditions checklist
- Profile stored and used to pre-fill relevant screening context
- User can edit profile from settings

### 5.3 Dashboard
**Priority:** P0 (must have)
- Greeting with user name, age, last analysis date
- Current health risk overview: all 5 categories with risk badge
  (icon + text label, never color alone)
- Trend label per category: Improving / Stable / Increased
- Elevated risk alert banner when any category is elevated
- Risk trend line chart across past assessments
- Recent assessments list with date, result, view report link
- "Start New Analysis" primary button
- Empty state for first-time users

### 5.4 Two-Stage Screening System
**Priority:** P0 (must have)

#### Stage 1 — Initial Risk Screening
- 15 general questions shared across all five diseases
- One question per screen with progress indicator
- "Why we ask this" helper text per question
- Answers preprocessed and fed into 5 ML models simultaneously
- Output: risk score per category (Low / Moderate / Elevated)
- Stage title: "Initial Risk Screening" (never "diagnosis")

#### Stage 2 — Disease-Specific Detailed Assessment
- Triggered when any category is Moderate-High or Elevated
- 10 additional targeted questions for the highest-priority category
- Same question UI with category chip at top
- Output: final risk score + SHAP-based contributing factors
- Stage title: "Detailed Risk Assessment — [Category]"
- If all Stage 1 results are Low: skip Stage 2, go to report

### 5.5 Results Screen
**Priority:** P0 (must have)
- Large risk badge (icon + text) for assessed category
- Plain-language explanation of risk level
- "Factors that influenced this screening" (SHAP/feature importance)
- Comparison with previous assessment (if exists)
- Suggested next step (specialist type recommendation)
- "Download PDF Report" button
- "Back to Dashboard" button
- Medical disclaimer visible

### 5.6 Health History
**Priority:** P0 (must have)
- Full list of past assessments with date and overall result
- Tap/click to open a past report
- Side-by-side comparison of two assessments
- Note: "These labels describe screening results, not your medical
  condition."

### 5.7 Risk Trend Visualization
**Priority:** P0 (must have)
- Line chart of risk level over past assessments
- Y-axis: Low / Moderate / Elevated
- Category filter chips
- Status labels: Improving / Stable / Increased
- Disclaimer: refers to screening output, not medical condition

### 5.8 Downloadable PDF Report
**Priority:** P0 (must have)
Report must contain:
- Header: "Personal Health Risk Assessment"
- User information and assessment date
- Risk results table for all 5 categories
- Detailed result for the assessed category
- Top contributing factors
- Comparison with previous assessment (if exists)
- Recommended next step (specialist type)
- Medical disclaimer footer

### 5.9 Professional Consultation Recommendation
**Priority:** P0 (must have)
- Displayed when any category is Elevated
- Recommends the TYPE of specialist, not a specific doctor
- Wording: "Your responses indicate an elevated risk during this
  screening. Consider consulting an appropriate healthcare professional
  for further evaluation."

### 5.10 Assessment Comparison
**Priority:** P1 (should have)
- Auto-loaded from database, no upload required
- Shows: Previous risk | Current risk | Change | Date
- Copy: "Your screening risk category has increased compared with
  your previous assessment."
- Shows which input factors changed between assessments

### 5.11 Admin Panel
**Priority:** P2 (nice to have)
- Read-only view of: model status per disease, dataset info,
  user count, analysis count, model metrics
- No individual user health data displayed

### 5.12 Optional Report Import
**Priority:** P3 (future scope)
- Upload historical reports from outside the system
- Not required for the prototype workflow

---

## 6. USER FLOW

Sign Up / Login
↓
Onboarding (2 steps)
↓
Dashboard
↓
Start New Analysis
↓
[First time?]
YES → Stage 1: 15 General Questions
NO → Load previous assessment → Stage 1: 15 General Questions
↓
Data Preprocessing
↓
5 ML Models (simultaneous)
↓
Stage 1 Risk Scores (all 5 categories)
↓
[Any Elevated or Moderate-High?]
NO → Results (all Low) → PDF Report → Dashboard
YES ↓
Stage 2: 10 Disease-Specific Questions (flagged category)
↓
Disease-Specific ML Model
↓
Final Risk Score + SHAP Explanation
↓
Results Screen
↓
[Risk Elevated?]
YES → Professional Consultation Recommendation
NO → Monitoring Advice
↓
PDF Report Generated
↓
Save to Database
↓
Dashboard Updated


---

## 7. ML REQUIREMENTS

### 7.1 Models

| Disease | Stage 1 Model | Stage 2 Model |
|---|---|---|
| Heart | Random Forest | Random Forest |
| Diabetes | Logistic Regression | XGBoost |
| Hypertension | Random Forest | Logistic Regression |
| Kidney | Decision Tree / RF | Random Forest |
| Respiratory | XGBoost | Gradient Boosting |

### 7.2 Datasets

| Disease | Dataset | Source |
|---|---|---|
| Heart | BRFSS 2015 Heart Disease subset | Kaggle / CDC |
| Diabetes | BRFSS Diabetes Health Indicators | Kaggle / CDC |
| Hypertension | BRFSS Hypertension subset | Kaggle / CDC |
| Kidney | UCI Chronic Kidney Disease | UCI ML Repository |
| Respiratory | BRFSS Asthma/COPD subset | Kaggle / CDC |

### 7.3 Preprocessing Requirements
- SimpleImputer: median (numeric), most_frequent (categorical)
- LabelEncoder / OneHotEncoder for categorical variables
- StandardScaler for Logistic Regression only
- SMOTE applied to training data only
- Pipeline saved with model using joblib
- Same pipeline applied at training and prediction

### 7.4 Evaluation Requirements
All models must report:
- Accuracy
- Precision
- Recall (highest priority for screening)
- F1-score
- ROC-AUC
- Confusion matrix
- Reported as mean ± std from 5-fold stratified cross-validation

### 7.5 Explainability Requirements
- SHAP TreeExplainer for tree-based models
- Coefficient-based for Logistic Regression
- Only show factors the model actually used
- Plain-language factor labels for end users

### 7.6 Risk Threshold Requirements
- Thresholds determined from validation, not arbitrary
- Default starting point:
  Low < 0.30 | Moderate 0.30–0.60 | Elevated > 0.60
- Every threshold must be documented with justification

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### 8.1 Performance
- Stage 1 ML inference: under 3 seconds
- Stage 2 ML inference: under 3 seconds
- PDF generation: under 10 seconds
- Dashboard load: under 3 seconds

### 8.2 Usability
- Mobile-first responsive design (390px minimum)
- Desktop support (1280px)
- Beginner-friendly, no medical knowledge required
- Maximum 25 questions per full session
- Clear progress indicators throughout

### 8.3 Accessibility
- Risk badges: icon + text label (never color alone)
- Minimum 16px body text
- Accessible color contrast
- Clear, plain-language copy throughout

### 8.4 Security
- Passwords hashed with bcrypt
- JWT authentication with expiry
- All inputs validated server-side
- No API keys or secrets committed to code
- Environment variables for all sensitive config
- Health data not unnecessarily exposed

### 8.5 Reliability
- Preprocessing pipeline consistent between train and predict
- Model version stored with every assessment record
- Database indexed on user_id for all health tables

---

## 9. DESIGN REQUIREMENTS

### 9.1 Visual Style
- Minimal, clean, medical-tech aesthetic
- Rounded cards (16px radius), soft shadows, generous whitespace
- Professional enough for national hackathon presentation

### 9.2 Color System
| Token | Hex | Usage |
|---|---|---|
| Primary | #0F9D9A | Buttons, highlights, active states |
| Text | #12263A | All body and heading text |
| Background | #F6F9FB | Page background |
| Card | #FFFFFF | Card surfaces |
| Low risk | #10B981 | Low risk badges and indicators |
| Moderate risk | #F59E0B | Moderate risk badges and indicators |
| Elevated risk | #EF4444 | Elevated risk badges and indicators |

### 9.3 Typography
- Font: Inter or Plus Jakarta Sans
- Body text: minimum 16px
- Headings: clear hierarchy

### 9.4 Required Components
- RiskBadge (icon + text label)
- QuestionCard (question + options + helper text)
- ProgressBar (Question X of Y)
- FactorChart (contributing factors bar chart)
- TrendChart (risk over time line chart)
- ComparisonTable (previous vs current)
- DisclaimerFooter (on every screen)
- EmptyState (no assessments yet)
- LoadingState ("Analyzing your responses...")

---

## 10. CONTENT AND COPY REQUIREMENTS

### 10.1 Approved Language
| Use | Never Use |
|---|---|
| "elevated risk" | "diagnosed" |
| "screening result suggests" | "you have [disease]" |
| "professional evaluation may be appropriate" | "you don't have [disease]" |
| "this screening indicates" | "confirmed" |
| "risk category" | "100% accurate" |
| "early awareness" | "medically proven" |
| "monitoring may be appropriate" | "guaranteed" |

### 10.2 Standard Medical Disclaimer
Must appear on every screen and every report:
"This system provides an AI-based risk assessment for early awareness
and does not provide a medical diagnosis. The results should not
replace professional medical advice. If you have concerns about your
health, please consult a qualified healthcare professional."

---

## 11. OUT OF SCOPE (PROTOTYPE)

The following are explicitly out of scope for this prototype:

- Sequential Stage 2 for multiple elevated categories
- Integration with real medical records or clinical systems
- Wearable or IoT device data input
- Real-time doctor consultation or telemedicine
- Drug or treatment recommendations
- Multilingual support
- Native mobile app (iOS / Android)
- Payment or subscription features
- Optional report import from external systems
- Admin panel (P2, nice to have only)

---

## 12. FUTURE SCOPE

- Sequential multi-disease Stage 2 assessment
- More disease categories
- Multilingual support
- Doctor / clinic directory integration
- Wearable device data integration
- External report import
- Native mobile application
- Clinically validated model versions

---

## 13. RISKS AND MITIGATIONS

| Risk | Mitigation |
|---|---|
| Model gives misleading high confidence | Report ROC-AUC and recall, not just accuracy. Show confusion matrix. |
| UCI CKD dataset too small | Flag as small dataset, state it needs external validation |
| Users interpret screening as diagnosis | Disclaimer on every screen, careful copy rules throughout |
| Class imbalance in BRFSS | Apply SMOTE on training data only, prioritize recall |
| Threshold values arbitrary | Derive from validation results, document every decision |
| Judges question accuracy claims | Never claim medical accuracy. Show honest cross-validated metrics. |
| Data leakage | Strict train/test separation, SMOTE on training only |

---

## 14. TECH STACK SUMMARY

| Layer | Technology |
|---|---|
| Frontend | React / Next.js |
| Backend | Python, FastAPI |
| ML | scikit-learn, XGBoost, SHAP, imbalanced-learn |
| Database | PostgreSQL |
| Reports | ReportLab / WeasyPrint |
| Model saving | joblib |
| Auth | JWT + bcrypt |
| Version control | Git / GitHub |

---

## 15. TEAM ROLES (FILL IN)

| Name | Role |
|---|---|
| [Name] | ML Engineer |
| [Name] | Backend Developer |
| [Name] | Frontend Developer |
| [Name] | Data / Research |

---

## 16. HACKATHON INFORMATION (FILL IN)

- Event name: [Hackathon Name]
- Problem statement: Early symptom prediction system for chronic diseases
- Category: AI/ML for Health Tech
- Submission deadline: [Date]
- Demo format: [Live demo / Video / Both]

---

*"Early awareness. Better outcomes."*
*VitaScreen — Hackathon Prototype v1.0*