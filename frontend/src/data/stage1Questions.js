export const stage1Questions = [
  {
    id: "age",
    question: "What is your current age?",
    why: "Age is a primary physiological baseline for chronic cardiovascular and metabolic disease risk models.",
    type: "number",
    min: 18,
    max: 100,
    defaultValue: 35,
    unit: "years"
  },
  {
    id: "gender",
    question: "What is your biological sex?",
    why: "Certain chronic conditions exhibit distinct prevalence patterns based on biological hormonal profiles.",
    type: "select",
    options: [
      { label: "Female", value: 0 },
      { label: "Male", value: 1 }
    ]
  },
  {
    id: "bmi",
    question: "What is your approximate Body Mass Index (BMI)?",
    why: "Body Mass Index reflects weight-to-height ratio, an established indicator for metabolic and cardiac strain.",
    type: "number",
    min: 15.0,
    max: 55.0,
    step: 0.1,
    defaultValue: 24.5,
    unit: "kg/m²"
  },
  {
    id: "smoking_status",
    question: "What is your current tobacco / smoking status?",
    why: "Tobacco smoke causes vascular endothelial inflammation and chronic bronchial deterioration.",
    type: "radio",
    options: [
      { label: "Never smoked", value: 0 },
      { label: "Former smoker (Quit > 12 months ago)", value: 1 },
      { label: "Current regular or occasional smoker", value: 2 }
    ]
  },
  {
    id: "physical_activity",
    question: "How would you describe your typical weekly physical activity?",
    why: "Physical activity enhances insulin sensitivity, vascular compliance, and cardiorespiratory endurance.",
    type: "radio",
    options: [
      { label: "Low / Sedentary (Minimal intentional exercise)", value: 0 },
      { label: "Moderate (1–3 sessions or brisk walking weekly)", value: 1 },
      { label: "High / Active (4+ exercise sessions or physically demanding work)", value: 2 }
    ]
  },
  {
    id: "alcohol_use",
    question: "How often do you consume alcoholic beverages?",
    why: "Alcohol intake impacts blood pressure regulation, liver function, and metabolic pathways.",
    type: "radio",
    options: [
      { label: "None / Never", value: 0 },
      { label: "Occasional (1–2 drinks per week or socially)", value: 1 },
      { label: "Regular / Moderate to High (3+ drinks weekly)", value: 2 }
    ]
  },
  {
    id: "high_bp_history",
    question: "Have you ever been told by a doctor or noticed that your blood pressure was elevated?",
    why: "Sustained high blood pressure places strain on arteries, kidneys, and the heart muscle.",
    type: "radio",
    options: [
      { label: "No / Normal blood pressure", value: 0 },
      { label: "Yes / Elevated or Borderline High", value: 1 }
    ]
  },
  {
    id: "chest_pain_exertion",
    question: "Do you ever experience tightness, pressure, or discomfort in your chest during exertion (e.g. climbing stairs)?",
    why: "Exertional chest sensations may reflect changes in cardiovascular oxygen delivery.",
    type: "radio",
    options: [
      { label: "No, never", value: 0 },
      { label: "Yes, occasionally or frequently", value: 1 }
    ]
  },
  {
    id: "shortness_of_breath",
    question: "Do you experience unexplained breathlessness during routine daily activities?",
    why: "Shortness of breath can be an early indicator of both cardiorespiratory and pulmonary workload limits.",
    type: "radio",
    options: [
      { label: "No, breath is normal", value: 0 },
      { label: "Yes, noticeably breathless", value: 1 }
    ]
  },
  {
    id: "high_blood_sugar_history",
    question: "Have you previously had an elevated blood sugar or pre-diabetes reading?",
    why: "Elevated fasting glucose or HbA1c is a strong early indicator of insulin resistance progression.",
    type: "radio",
    options: [
      { label: "No / Normal readings", value: 0 },
      { label: "Yes / Borderline or elevated", value: 1 }
    ]
  },
  {
    id: "excessive_thirst_urination",
    question: "Do you regularly experience excessive thirst, dry mouth, or unusually frequent urination (especially at night)?",
    why: "The kidneys excrete excess circulating glucose with water, triggering thirst and frequent voiding.",
    type: "radio",
    options: [
      { label: "No, normal thirst and urination", value: 0 },
      { label: "Yes, frequent thirst or night urination", value: 1 }
    ]
  },
  {
    id: "fatigue_weakness",
    question: "Do you experience ongoing persistent fatigue that does not improve after rest?",
    why: "Chronic fatigue is a shared marker across metabolic, renal, and cardiopulmonary systems.",
    type: "radio",
    options: [
      { label: "No, energy levels are steady", value: 0 },
      { label: "Yes, persistent fatigue/low energy", value: 1 }
    ]
  },
  {
    id: "swollen_ankles_feet",
    question: "Have you noticed persistent swelling or fluid retention around your ankles, feet, or eyelids?",
    why: "Peripheral edema can occur when renal filtration or venous return efficiency changes.",
    type: "radio",
    options: [
      { label: "No swelling", value: 0 },
      { label: "Yes, noticeable swelling", value: 1 }
    ]
  },
  {
    id: "chronic_cough_wheezing",
    question: "Do you have a lingering cough, wheezing sound while breathing, or recurring morning mucus?",
    why: "Chronic airway mucus and audible wheezing are hallmark indicators of airway hypersensitivity or COPD.",
    type: "radio",
    options: [
      { label: "No chronic cough or wheeze", value: 0 },
      { label: "Yes, recurring cough or wheezing", value: 1 }
    ]
  },
  {
    id: "family_history_score",
    question: "Do any immediate family members (parents or siblings) have chronic heart disease, diabetes, hypertension, or kidney disease?",
    why: "Genetic predisposition significantly influences individual baseline risk across all major chronic categories.",
    type: "radio",
    options: [
      { label: "None known", value: 0 },
      { label: "1 family member", value: 1 },
      { label: "2 family members", value: 2 },
      { label: "3 or more family members", value: 3 }
    ]
  }
];
