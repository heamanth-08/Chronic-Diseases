export const stage1Questions = [
  {
    id: "age",
    question: "What is your age?",
    why: "Age is a primary baseline indicator for chronic cardiovascular, metabolic, and renal risk models.",
    type: "number",
    min: 18,
    max: 100,
    placeholder: "e.g. 35",
    unit: "years"
  },
  {
    id: "sex",
    question: "What is your biological sex?",
    why: "Certain chronic health conditions exhibit distinct prevalence patterns influenced by biological hormonal factors.",
    type: "radio",
    options: [
      { label: "Male", value: 1 },
      { label: "Female", value: 0 }
    ]
  },
  {
    id: "bmi",
    question: "What is your height and weight?",
    why: "Height and weight determine your Body Mass Index (BMI), an essential clinical metric for metabolic and cardiovascular strain.",
    type: "bmi_calculator",
    defaultValue: 24.2
  },
  {
    id: "smoker",
    question: "Do you currently smoke or use any tobacco products?",
    why: "Tobacco smoke causes vascular endothelial inflammation, arterial stiffening, and chronic bronchial deterioration.",
    type: "radio",
    options: [
      { label: "Never", value: 0 },
      { label: "Former smoker", value: 1 },
      { label: "Current smoker", value: 2 }
    ]
  },
  {
    id: "phys_activity",
    question: "How physically active are you on a weekly basis?",
    why: "Regular exercise significantly enhances insulin sensitivity, vascular compliance, and cardiovascular endurance.",
    type: "radio",
    options: [
      { label: "Sedentary (no exercise)", value: 0 },
      { label: "Light (1–2 days)", value: 1 },
      { label: "Moderate (3–4 days)", value: 2 },
      { label: "Active (5+ days)", value: 3 }
    ]
  },
  {
    id: "sleep_hours",
    question: "How many hours of sleep do you get on average per night?",
    why: "Sleep duration strongly regulates circadian cortisol release, autonomic blood pressure tone, and glucose metabolism.",
    type: "radio",
    options: [
      { label: "Less than 5 hours", value: 0 },
      { label: "5–6 hours", value: 1 },
      { label: "7–8 hours (Optimal)", value: 2 },
      { label: "More than 9 hours", value: 3 }
    ]
  },
  {
    id: "high_bp",
    question: "Have you ever been told by a doctor that you have high blood pressure?",
    why: "Sustained high blood pressure places direct mechanical strain on coronary vessels, kidneys, and cerebral circulation.",
    type: "radio",
    options: [
      { label: "No", value: 0 },
      { label: "Not sure", value: 1 },
      { label: "Only during pregnancy", value: 2 },
      { label: "Yes", value: 3 }
    ]
  },
  {
    id: "high_chol",
    question: "Have you ever been told by a doctor that you have high cholesterol?",
    why: "Elevated circulating lipids and LDL accelerate atherosclerotic plaque build-up in arterial walls.",
    type: "radio",
    options: [
      { label: "No", value: 0 },
      { label: "Never checked", value: 1 },
      { label: "Yes", value: 2 }
    ]
  },
  {
    id: "family_history",
    question: "Do you have a family history of any of the following conditions?",
    why: "Genetic predisposition significantly influences individual susceptibility across all major chronic disease categories.",
    type: "multiselect",
    options: [
      { label: "Heart disease", value: "heart" },
      { label: "Diabetes", value: "diabetes" },
      { label: "High blood pressure", value: "hypertension" },
      { label: "Kidney disease", value: "kidney" },
      { label: "Lung disease", value: "respiratory" },
      { label: "None of the above", value: "none" }
    ],
    defaultValue: ["none"]
  },
  {
    id: "weight_change",
    question: "Have you noticed any unexplained weight changes in the past 3 months?",
    why: "Rapid unexplained weight fluctuations can signal fluid retention, endocrine shifts, or insulin dysregulation.",
    type: "radio",
    options: [
      { label: "No change", value: 0 },
      { label: "Significant weight gain", value: 1 },
      { label: "Significant weight loss", value: 2 }
    ]
  },
  {
    id: "tired_energy",
    question: "How often do you feel unusually tired or low on energy without a clear reason?",
    why: "Chronic unrefreshing fatigue is a shared cross-system symptom of metabolic, renal, and cardiac strain.",
    type: "radio",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Almost always", value: 3 }
    ]
  },
  {
    id: "breath_chest_discomfort",
    question: "Do you experience shortness of breath or chest discomfort during normal daily activities?",
    why: "Exertional breathlessness or chest pressure reflects reduced cardiorespiratory reserve or pulmonary limitation.",
    type: "radio",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Always", value: 3 }
    ]
  },
  {
    id: "increased_thirst_urination",
    question: "Do you feel increased thirst or urinate more frequently than usual?",
    why: "Polydipsia and polyuria are classic osmotic indicators of elevated circulating blood sugar levels.",
    type: "radio",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Always", value: 3 }
    ]
  },
  {
    id: "swelling",
    question: "Have you noticed any swelling in your feet, ankles, face, or around your eyes?",
    why: "Peripheral edema and facial puffiness commonly indicate fluid retention associated with kidney or heart stress.",
    type: "radio",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Always", value: 3 }
    ]
  },
  {
    id: "gen_health",
    question: "How would you rate your overall health right now?",
    why: "Self-rated general health has been clinically validated as a powerful predictor of future chronic health trajectories.",
    type: "radio",
    options: [
      { label: "Excellent", value: 0 },
      { label: "Very good", value: 1 },
      { label: "Good", value: 2 },
      { label: "Fair", value: 3 },
      { label: "Poor", value: 4 }
    ]
  }
];
