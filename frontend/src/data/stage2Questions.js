export const stage2GeneralQuestions = [
  {
    id: "symptom_duration",
    question: "How long have you been experiencing the symptoms that concern you most?",
    why: "Chronicity helps delineate acute benign episodes from progressive underlying pathophysiological processes.",
    type: "radio",
    options: [
      { label: "Less than 1 week", value: 0 },
      { label: "1–4 weeks", value: 1 },
      { label: "1–6 months", value: 2 },
      { label: "More than 6 months", value: 3 }
    ]
  },
  {
    id: "symptom_frequency",
    question: "How often do these symptoms occur?",
    why: "Frequency and periodicity indicate disease burden and autonomic or metabolic instability.",
    type: "radio",
    options: [
      { label: "Rarely (sporadic)", value: 0 },
      { label: "Sometimes (1–2 days/week)", value: 1 },
      { label: "Most days (3–5 days/week)", value: 2 },
      { label: "Every day (constant)", value: 3 }
    ]
  },
  {
    id: "worse_with_exertion",
    question: "Do your symptoms get worse during physical activity or exertion?",
    why: "Exertional worsening is a sensitive marker of cardiorespiratory and metabolic reserve limits.",
    type: "radio",
    options: [
      { label: "No (unrelated to exertion)", value: 0 },
      { label: "Sometimes (moderate effort)", value: 1 },
      { label: "Yes (consistently worsens)", value: 2 }
    ]
  },
  {
    id: "sleep_disturbance",
    question: "Do your symptoms disturb your sleep or wake you up at night?",
    why: "Nocturnal symptom disruption indicates higher clinical severity and impaired restorative physiology.",
    type: "radio",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Always", value: 3 }
    ]
  },
  {
    id: "unexplained_body_changes",
    question: "Have you noticed any recent unexplained changes in your body such as swelling, skin changes, or unusual discharge?",
    why: "Visible morphological changes like edema or skin alterations reflect systemic vascular or renal shifts.",
    type: "radio",
    options: [
      { label: "No", value: 0 },
      { label: "Not sure", value: 1 },
      { label: "Yes", value: 2 }
    ]
  },
  {
    id: "family_chronic_diagnosis",
    question: "Do you have a family member (parent or sibling) who has been diagnosed with a serious chronic disease?",
    why: "Direct first-degree genetic history significantly elevates multi-system chronic disease vulnerability.",
    type: "radio",
    options: [
      { label: "No", value: 0 },
      { label: "Not sure", value: 1 },
      { label: "Yes", value: 2 }
    ]
  },
  {
    id: "taking_medication",
    question: "Are you currently taking any regular medication, supplements, or over-the-counter drugs?",
    why: "Pharmacotherapy usage indicates active symptom management and potential drug-condition interactions.",
    type: "radio",
    options: [
      { label: "No", value: 0 },
      { label: "Yes", value: 1 }
    ]
  },
  {
    id: "doctor_visit_12m",
    question: "Have you visited a doctor or clinic for these concerns in the past 12 months?",
    why: "Prior clinical evaluations help gauge prior clinical investigations and ongoing diagnostic workup.",
    type: "radio",
    options: [
      { label: "No", value: 0 },
      { label: "Yes", value: 1 }
    ]
  },
  {
    id: "daily_life_impact",
    question: "On a scale of 1 to 5 how much are these symptoms affecting your daily life and routine?",
    why: "Functional impact scoring quantifies subjective impairment and urgency for specialist intervention.",
    type: "scale",
    defaultValue: 1
  },
  {
    id: "additional_notes",
    question: "Is there anything else about your health you feel is important that was not covered in the previous questions?",
    why: "Open clinical context enables nuanced reporting for healthcare professionals during subsequent consultations.",
    type: "text_or_none",
    defaultValue: "Nothing to add",
    placeholder: "Describe any other symptoms, medication names, or personal health notes..."
  }
];

export const stage2QuestionsByDisease = {
  heart: {
    title: "Cardiovascular Focused Assessment",
    subtitle: "10 targeted questions evaluating symptom duration, exertion impact, and daily severity",
    icon: "Heart",
    color: "#EF4444",
    questions: stage2GeneralQuestions
  },
  diabetes: {
    title: "Glycemic & Metabolic Focused Assessment",
    subtitle: "10 targeted questions evaluating symptom duration, sleep disruption, and daily severity",
    icon: "Droplets",
    color: "#F59E0B",
    questions: stage2GeneralQuestions
  },
  hypertension: {
    title: "Vascular & Blood Pressure Assessment",
    subtitle: "10 targeted questions evaluating vascular strain, sleep impact, and symptom frequency",
    icon: "Gauge",
    color: "#3B82F6",
    questions: stage2GeneralQuestions
  },
  kidney: {
    title: "Renal Health Focused Assessment",
    subtitle: "10 targeted questions evaluating edema, body changes, and symptom duration",
    icon: "Activity",
    color: "#8B5CF6",
    questions: stage2GeneralQuestions
  },
  respiratory: {
    title: "Respiratory Reserve Focused Assessment",
    subtitle: "10 targeted questions evaluating exertion limits, nighttime awakening, and functional severity",
    icon: "Wind",
    color: "#10B981",
    questions: stage2GeneralQuestions
  }
};
