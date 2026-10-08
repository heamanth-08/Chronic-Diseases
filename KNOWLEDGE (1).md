# VitaScreen — Domain Knowledge Reference

## What Are Chronic Diseases
Chronic diseases are long-term health conditions that typically progress
slowly and cannot be cured but can be managed. They include heart disease,
diabetes, hypertension, chronic kidney disease, and chronic respiratory
diseases. They are the leading cause of death and disability worldwide.

## Why Early Detection Matters
- Many chronic diseases develop silently for years before diagnosis
- Early awareness allows lifestyle changes and timely medical consultation
- Late diagnosis leads to worse outcomes and higher treatment costs
- Questionnaire-based screening tools can flag risk before clinical tests

## The Five Diseases — Clinical Context

### 1. Heart Disease
- Includes coronary artery disease, heart failure, arrhythmia
- Key risk factors: age, smoking, high cholesterol, high BP,
  physical inactivity, obesity, family history, diabetes
- Common early symptoms: chest discomfort, breathlessness,
  fatigue, palpitations, swelling in legs
- Screening: risk-score tools like Framingham, ASCVD are used clinically
- Referral type: Cardiologist

### 2. Diabetes (Type 2)
- A metabolic condition where the body cannot use insulin effectively
- Key risk factors: obesity (especially abdominal), physical inactivity,
  family history, age 45+, high BP, gestational diabetes history
- Common early symptoms: excessive thirst, frequent urination, fatigue,
  blurred vision, slow-healing wounds, tingling in extremities
- Many people are asymptomatic until advanced stage
- Referral type: Endocrinologist or General Physician

### 3. Hypertension (High Blood Pressure)
- Often called the "silent killer" because most people have no symptoms
- Key risk factors: age, obesity, high salt diet, physical inactivity,
  smoking, alcohol, stress, family history
- Symptoms when severe: headache, dizziness, nosebleeds, vision changes
- Leads to heart disease, stroke, kidney damage if unmanaged
- Referral type: General Physician or Cardiologist

### 4. Chronic Kidney Disease (CKD)
- Gradual loss of kidney function over months or years
- Key risk factors: diabetes, high blood pressure, family history,
  age 60+, obesity, frequent NSAID use, repeated kidney infections
- Common symptoms: swelling (feet, ankles, eyes), foamy urine,
  fatigue, loss of appetite, muscle cramps, itching
- Often detected late because symptoms appear only at advanced stages
- Referral type: Nephrologist or General Physician

### 5. Respiratory Disease (Asthma / COPD)
- Asthma: reversible airway inflammation, often allergy/trigger-based
- COPD: progressive, largely irreversible, usually smoking-related
- Key risk factors: smoking (active or passive), occupational dust/chemicals,
  air pollution, family history, allergies, childhood respiratory infections
- Common symptoms: chronic cough, sputum, wheezing, breathlessness,
  frequent chest infections
- Referral type: Pulmonologist or General Physician

---

## Datasets — Reference

### BRFSS (Behavioral Risk Factor Surveillance System)
- Source: CDC (Centers for Disease Control and Prevention), USA
- Type: Annual telephone health survey
- Relevance: Self-reported questionnaire data — directly maps to our
  question-based screening approach
- Contains: demographics, lifestyle, chronic conditions, health behaviors
- Used for: Heart, Diabetes, Hypertension, Respiratory models
- Kaggle versions available for 2015 data (clean, pre-processed)

### UCI Chronic Kidney Disease Dataset
- Source: UCI Machine Learning Repository
- Records: ~400
- Features: 24 (mix of lab values and symptoms)
- Label: CKD / Not CKD
- Note: Small dataset, very high accuracy possible. Flag as small and
  not representative of a large population. Needs external validation.

---

## ML Concepts Used — Plain Language Reference

### Classification
Predicting which category (Low/Moderate/Elevated) a user falls into
based on their questionnaire answers.

### SMOTE (Synthetic Minority Oversampling Technique)
A method to handle imbalanced datasets where "disease" cases are rare.
Creates synthetic positive samples so the model doesn't just learn to
predict "no disease" every time. Apply ONLY to training data.

### SHAP (SHapley Additive exPlanations)
A method to explain individual predictions by showing how much each
feature contributed to the result. Used to generate "factors that
influenced this screening."

### ROC-AUC
Area Under the Receiver Operating Characteristic Curve. Measures how
well the model separates positive from negative cases regardless of
threshold. Higher is better. 0.5 = random, 1.0 = perfect.

### Recall (Sensitivity)
Out of all actual positive (high-risk) cases, how many did the model
correctly flag? Critical for screening because missing a high-risk
person is more dangerous than a false alert.

### F1-Score
Harmonic mean of Precision and Recall. Useful when classes are imbalanced.

### Cross-Validation (5-fold)
Splitting data into 5 parts, training on 4 and testing on 1, repeated
5 times. Gives a more reliable performance estimate than a single split.

### Pipeline
A scikit-learn object that chains preprocessing and model steps together.
Ensures the same transformations applied during training are applied
during prediction automatically.

---

## Risk Level Definitions

| Level | Meaning | Action |
|---|---|---|
| Low | No significant elevated risk detected in this screening | Continue healthy habits, rescreen periodically |
| Moderate | Some factors indicate increased risk | Monitor regularly, consider professional advice |
| Elevated | Screening result indicates elevated risk | Professional medical evaluation recommended |

---

## Medical Disclaimer (Standard — Use Everywhere)
"This system provides an AI-based risk assessment for early awareness
and does not provide a medical diagnosis. The results should not replace
professional medical advice. If you have concerns about your health,
please consult a qualified healthcare professional."

---

## Key Statistics (Verify Before Citing)
- NCDs cause ~74% of global deaths (WHO)
- ~63% of deaths in India are due to NCDs (WHO India)
- ~101 million people in India have diabetes (ICMR-INDIAB 2023)
- ~46% of adults with hypertension are unaware (WHO 2023)
- ~50% of people with diabetes are undiagnosed globally (IDF Atlas)