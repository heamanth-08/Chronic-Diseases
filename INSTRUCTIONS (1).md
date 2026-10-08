# VitaScreen — Development Instructions

## Rule 0 — Non-Negotiable
This system performs RISK SCREENING, not medical diagnosis.
Every piece of code, content, design, and output must reflect this.
If you are unsure whether something crosses the medical boundary, do not
include it. Ask the team lead first.

---

## General Development Rules

1. Read the master prompt and this file before starting any task.
2. Never work on a feature in isolation without understanding how it
   fits the full two-stage screening flow.
3. Never invent ML metrics, dataset statistics, or medical facts.
4. Never hard-code API keys, credentials, or secrets anywhere.
5. Use environment variables for all sensitive configuration.
6. Commit clean, readable, commented code.
7. Test every API endpoint before marking a task done.
8. Never push directly to main. Use feature branches and pull requests.

---

## Frontend Instructions

### Setup
- Framework: React (Next.js preferred for routing and SSR)
- Styling: Tailwind CSS or CSS modules
- Follow the design system colors and typography strictly

### Design Rules
- Mobile-first. Test at 390px before 1280px.
- Every risk badge must show: icon + text label. Never color alone.
- Risk colors: Low = green, Moderate = amber, Elevated = coral red
- Font: Inter or Plus Jakarta Sans, minimum 16px body text
- Rounded cards (16px radius), soft shadows, generous whitespace
- Keep UI calm and non-alarming even for elevated results

### Component Rules
- Build reusable components: RiskBadge, QuestionCard, ProgressBar,
  FactorChart, TrendChart, ComparisonTable, DisclaimerFooter
- Every screen must include the disclaimer footer
- Empty states must be designed for first-time users
- Loading state must say "Analyzing your responses..." not
  "Diagnosing..." or any medical term

### Question Flow Rules
- One question per screen
- Show progress: "Question 7 of 15"
- Include a "Why we ask this" helper line under every question
- Stage 1 title: "Initial Risk Screening" (never "diagnosis")
- Stage 2 title: "Detailed Risk Assessment — [Category Name]"

---

## Backend Instructions

### Setup
- Framework: FastAPI
- Language: Python 3.10+
- Authentication: JWT (python-jose or similar)
- Password hashing: bcrypt (passlib)
- Database ORM: SQLAlchemy

### API Rules
- Validate all inputs before processing
- Never expose raw model outputs directly to the frontend
- Map probabilities to Low / Moderate / Elevated before responding
- Always return a structured JSON response
- Protect all health-data endpoints with JWT middleware
- Never log sensitive health data

### Endpoint Structure (suggested)
POST   /auth/register
POST   /auth/login
GET    /user/profile
PUT    /user/profile
POST   /assessment/stage1
POST   /assessment/stage2
GET    /assessment/history
GET    /assessment/{id}
GET    /assessment/{id}/report
GET    /dashboard/summary

---

## ML Instructions

### Pipeline Rules
- Save preprocessing pipeline WITH the model using joblib
- Apply identical preprocessing during training and prediction
- Never apply SMOTE to test data, only training data
- Use stratified 80/20 train/test split
- Use 5-fold stratified cross-validation
- Report metrics as mean ± std

### Model Saving Convention
- heart_stage1_pipeline.pkl
- heart_stage2_pipeline.pkl
- diabetes_stage1_pipeline.pkl
- diabetes_stage2_pipeline.pkl
- hypertension_stage1_pipeline.pkl
- hypertension_stage2_pipeline.pkl
- kidney_stage1_pipeline.pkl
- kidney_stage2_pipeline.pkl
- respiratory_stage1_pipeline.pkl
- respiratory_stage2_pipeline.pkl

### SHAP Rules
- Use TreeExplainer for all tree-based models
- Use LinearExplainer for Logistic Regression
- Only show factors the model actually used
- Never fabricate contributing factors

### Risk Threshold Rules
- Determine thresholds from validation results, not arbitrary choices
- Document every threshold with its justification
- Default starting point: Low < 0.30, Moderate 0.30–0.60, Elevated > 0.60
  (adjust based on your model's validation)

---

## Database Instructions

### Schema Rules
- Use UUIDs for all primary keys
- Store assessment results as JSON fields where appropriate
- Never store raw SHAP values in the database, compute on demand
- Index user_id on all assessment and response tables
- Store model version with every assessment record

### Migration Rules
- Use Alembic for schema migrations
- Never modify the database schema directly in production
- Document every migration

---

## Security Instructions

- Hash all passwords with bcrypt before storing
- Never store passwords in plain text
- Use JWT with expiry (recommended: 24 hours access, 7 days refresh)
- Validate and sanitize all user inputs server-side
- Use HTTPS in production
- Store all secrets in .env file, never in code
- Add .env to .gitignore immediately
- Rate-limit authentication endpoints

---

## Git & Collaboration Rules

- Branch naming: feature/your-feature-name
- Commit messages: clear and descriptive
- Pull requests required for all merges to main
- Do not commit: .env, model .pkl files over 100MB,
  any dataset files, any credentials
- Add large model files to .gitignore and share via Google Drive
  or a cloud bucket

---

## What To Say In The App (Copy Rules)

USE:                              NEVER USE:
"elevated risk"                   "diagnosed"
"screening result suggests"       "you have [disease]"
"professional evaluation          "you don't have [disease]"
 may be appropriate"
"this screening indicates"        "confirmed"
"risk category"                   "100% accurate"
"early awareness"                 "medically proven"
"monitoring may be appropriate"   "guaranteed"