export const stage2QuestionsByDisease = {
  heart: {
    title: "Heart-related Detailed Assessment",
    subtitle: "10 targeted questions to evaluate cardiovascular strain and circulatory indicators",
    icon: "Heart",
    color: "#EF4444",
    questions: [
      {
        id: "chest_tightness_rest",
        question: "Do you ever experience chest tightness, pressure, or a squeezing sensation even when at rest?",
        why: "Resting chest symptoms help distinguish exertion-only strain from spontaneous ischemic patterns.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "radiating_pain_arm_jaw",
        question: "Have you noticed discomfort radiating into your left arm, shoulder, neck, or jaw?",
        why: "Referred nerve pathways often transmit cardiac sensory signals to the upper left quadrant and neck.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "heart_palpitations",
        question: "Do you experience fluttering, pounding, or racing heartbeats out of the blue?",
        why: "Palpitations can point toward transient arrhythmias or autonomic nervous system strain.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "dizziness_lightheadedness",
        question: "Do you feel lightheaded, faint, or unsteady when standing up or exerting yourself?",
        why: "Transient cerebral perfusion drops may be associated with blood pressure or heart output regulation.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "exercise_tolerance_drops",
        question: "Has your physical stamina noticeably decreased compared to 6–12 months ago?",
        why: "Progressive reductions in functional exercise capacity are clinically informative for cardiac reserve.",
        type: "radio",
        options: [{ label: "No, stable", value: 0 }, { label: "Yes, noticeably decreased", value: 1 }]
      },
      {
        id: "high_cholesterol_diagnosed",
        question: "Have you ever been told you have high LDL cholesterol or triglycerides?",
        why: "Elevated circulating lipids accelerate atherosclerotic plaque build-up within coronary arteries.",
        type: "radio",
        options: [{ label: "No / Normal lipids", value: 0 }, { label: "Yes / Elevated lipids", value: 1 }]
      },
      {
        id: "sleep_apnea_snoring",
        question: "Do you snore loudly, wake up gasping for air, or feel unrefreshed despite 7+ hours of sleep?",
        why: "Obstructive sleep apnea causes nocturnal hypoxemia and increases long-term cardiac workload.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "stress_level_high",
        question: "Do you experience persistent, severe psychological or emotional stress daily?",
        why: "Chronic cortisol and catecholamine elevation constrict peripheral blood vessels and elevate heart rate.",
        type: "radio",
        options: [{ label: "Low / Manageable", value: 0 }, { label: "High / Severe ongoing stress", value: 1 }]
      },
      {
        id: "parent_early_heart_attack",
        question: "Did your mother (before 65) or father (before 55) experience a heart attack or cardiac procedure?",
        why: "Premature first-degree coronary artery disease reflects strong inherited genetic susceptibility.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "daily_sodium_intake_high",
        question: "Do you frequently consume processed snacks, fast foods, or add table salt to meals?",
        why: "Excess sodium intake increases intravascular volume and arterial resistance.",
        type: "radio",
        options: [{ label: "Low to Moderate salt", value: 0 }, { label: "High sodium preference", value: 1 }]
      }
    ]
  },
  diabetes: {
    title: "Diabetes-related Detailed Assessment",
    subtitle: "10 targeted questions to evaluate glycemic regulation and metabolic sensitivity",
    icon: "Droplets",
    color: "#F59E0B",
    questions: [
      {
        id: "blurred_vision_episodes",
        question: "Do you experience periodic blurred vision that seems to come and go?",
        why: "Fluctuating blood glucose alters the osmolarity and shape of the eye's lens.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "slow_healing_cuts",
        question: "Do small cuts, scratches, or bruises take an unusually long time to heal?",
        why: "Elevated glucose impairs microvascular blood flow and cellular wound repair mechanisms.",
        type: "radio",
        options: [{ label: "No, heals normally", value: 0 }, { label: "Yes, heals slowly", value: 1 }]
      },
      {
        id: "tingling_numbness_feet",
        question: "Do you feel tingling, numbness, burning, or 'pins and needles' in your toes or feet?",
        why: "Peripheral neuropathy is a common manifestation of prolonged elevated circulating glucose.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "frequent_skin_infections",
        question: "Do you experience recurring skin infections, boils, or persistent fungal issues?",
        why: "Hyperglycemia provides a favorable environment for fungal and bacterial skin colonization.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "increased_hunger_unexplained",
        question: "Do you feel intense hunger shortly after eating full meals?",
        why: "Cellular insulin resistance prevents glucose from entering muscle cells, signaling starvation.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "unexplained_weight_loss",
        question: "Have you lost weight rapidly without dieting or changing exercise habits?",
        why: "When cells cannot utilize glucose, the body breaks down adipose and muscle tissue for fuel.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "waist_circumference_high",
        question: "Is your waist circumference greater than 35 inches (women) or 40 inches (men)?",
        why: "Visceral abdominal adiposity is a primary driver of systemic insulin resistance.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "gestational_diabetes_history",
        question: "Have you ever had gestational diabetes during pregnancy, or delivered a baby > 4 kg?",
        why: "History of gestational hyperglycemia indicates a higher baseline lifetime risk of Type 2 diabetes.",
        type: "radio",
        options: [{ label: "No / Not applicable", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "sweet_cravings_post_meal",
        question: "Do you experience significant sugar cravings or extreme drowsiness after carbohydrate-rich meals?",
        why: "Reactive postprandial glucose swings reflect insulin surge and clearance dynamics.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "darkened_skin_folds",
        question: "Have you noticed velvety darkened skin patches on your neck, armpits, or knuckles (Acanthosis Nigricans)?",
        why: "Skin hyperpigmentation in crease areas is a classic clinical marker of high circulating insulin.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      }
    ]
  },
  hypertension: {
    title: "Hypertension / Blood Pressure Assessment",
    subtitle: "10 targeted questions to evaluate vascular pressure strain and secondary symptoms",
    icon: "Gauge",
    color: "#3B82F6",
    questions: [
      {
        id: "morning_headaches_frequent",
        question: "Do you frequently wake up with dull, throbbing headaches at the back of your head?",
        why: "Early morning occipital headaches can occur from nocturnal and morning blood pressure surges.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "pulsating_ear_sensation",
        question: "Do you ever hear a rhythmic rushing or pulsing sound in your ears in quiet environments?",
        why: "Pulsatile tinnitus can be caused by turbulent arterial blood flow near the auditory canal.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "frequent_nosebleeds",
        question: "Have you had unexplained spontaneous nosebleeds without physical trauma?",
        why: "Elevated vascular pressure can occasionally rupture delicate nasal mucosal capillaries.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "vision_blurring_sudden",
        question: "Do you experience sudden episodes of visual haze or transient spots in vision?",
        why: "Hypertensive changes in retinal arterioles can momentarily distort visual clarity.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "salt_craving_sensitivity",
        question: "Do you feel bloated or experience finger/foot swelling after eating salty restaurant food?",
        why: "Salt sensitivity leads to fluid retention and acute vascular volume expansion.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "chronic_stress_work",
        question: "Is your daily routine characterized by constant deadlines, anxiety, or high workplace tension?",
        why: "Sympathetic nervous system hyperactivation causes chronic vasoconstriction.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "poor_sleep_quality",
        question: "Do you routinely sleep less than 6 hours per night or experience frequent midnight waking?",
        why: "Lack of deep restorative sleep prevents normal nocturnal blood pressure dipping.",
        type: "radio",
        options: [{ label: "No (Healthy sleep)", value: 0 }, { label: "Yes (Poor sleep)", value: 1 }]
      },
      {
        id: "family_early_hypertension",
        question: "Were your parents or grandparents diagnosed with high blood pressure before age 50?",
        why: "Heritability accounts for up to 30–50% of essential hypertension variance.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "sedentary_desk_hours_high",
        question: "Do you sit for 8+ hours a day without regular standing or stretching breaks?",
        why: "Prolonged sitting promotes endothelial stiffness and arterial constriction.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "coffee_energy_drink_high",
        question: "Do you consume 3+ cups of strong coffee, espresso, or caffeinated energy drinks daily?",
        why: "High caffeine intake induces acute adenosine blockade and transient blood pressure spikes.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      }
    ]
  },
  kidney: {
    title: "Kidney-related Detailed Assessment",
    subtitle: "10 targeted questions to evaluate renal filtration indicators and fluid balance",
    icon: "ShieldAlert",
    color: "#8B5CF6",
    questions: [
      {
        id: "foamy_bubbly_urine",
        question: "Have you noticed persistent foamy or frothy bubbles in your urine that require multiple flushes?",
        why: "Persistent frothiness can indicate protein (albumin) leaking past glomerular filters.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "facial_puffiness_morning",
        question: "Do you wake up with noticeable puffiness or swelling around your eyes and face?",
        why: "Proteinuria and altered sodium excretion cause fluid retention in loose tissue around the eyes.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "loss_of_appetite_metallic_taste",
        question: "Have you noticed a persistent metallic or ammonia-like taste in your mouth, or loss of appetite?",
        why: "Accumulation of uremic metabolic byproducts in the blood alters taste receptor responses.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "persistent_skin_itching",
        question: "Do you suffer from deep, persistent skin itching that lotions or creams do not soothe?",
        why: "Uremic pruritus results from phosphate retention and mineral imbalance in advanced filtration strain.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "muscle_cramps_night",
        question: "Do you get sudden, painful calf or foot muscle cramps while resting or during the night?",
        why: "Electrolyte shifts (calcium, magnesium, potassium balance) trigger neuromuscular irritability.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "frequent_nsaid_painkiller_use",
        question: "Do you take ibuprofen, naproxen, or other over-the-counter pain relievers on a weekly basis?",
        why: "Frequent NSAID use decreases renal prostaglandin synthesis and reduces glomerular blood perfusion.",
        type: "radio",
        options: [{ label: "Rarely / Never", value: 0 }, { label: "Yes, regularly", value: 1 }]
      },
      {
        id: "recurrent_urinary_infections",
        question: "Have you had multiple urinary tract infections or kidney stone episodes in recent years?",
        why: "Chronic structural inflammation or stone obstruction can cause cumulative nephron stress.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "family_kidney_disease",
        question: "Does anyone in your direct family have a history of polycystic kidney disease or dialysis treatment?",
        why: "Certain chronic renal disorders follow strong familial and autosomal inheritance patterns.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "decreased_urine_output",
        question: "Have you noticed a significant decrease in your overall daily volume of urination despite normal fluid intake?",
        why: "Oliguria reflects declining renal glomerular filtration rate.",
        type: "radio",
        options: [{ label: "No, normal volume", value: 0 }, { label: "Yes, reduced volume", value: 1 }]
      },
      {
        id: "unexplained_nausea_vomiting",
        question: "Do you experience periodic unexplained morning nausea or aversion to protein-rich foods?",
        why: "Elevated blood urea nitrogen directly irritates gastric mucosal linings.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      }
    ]
  },
  respiratory: {
    title: "Respiratory (Asthma / COPD) Detailed Assessment",
    subtitle: "10 targeted questions to evaluate airway resistance and bronchial reactive history",
    icon: "Wind",
    color: "#10B981",
    questions: [
      {
        id: "daily_morning_phlegm",
        question: "Do you produce mucus or phlegm upon waking on most mornings for months at a time?",
        why: "Chronic mucus hypersecretion is a defining clinical indicator of chronic bronchitis.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "wheezing_cold_air_exercise",
        question: "Does breathing cold air or engaging in physical exercise trigger audible whistling in your chest?",
        why: "Exercise-induced bronchospasm and thermal airway narrowing indicate bronchial hyperreactivity.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "breathless_climbing_stairs",
        question: "Do you need to stop and catch your breath after climbing a single flight of stairs or walking up a slight incline?",
        why: "Dyspnea on mild physical exertion reflects impaired functional pulmonary gas exchange.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "frequent_chest_infections",
        question: "Do you suffer from 2 or more bronchial or chest infections (e.g. bronchitis) each winter?",
        why: "Compromised airway ciliary clearance increases vulnerability to persistent lower respiratory infections.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "dust_smoke_chemical_exposure",
        question: "Have you had regular workplace exposure to mineral dusts, industrial fumes, chemical vapors, or biomass smoke?",
        why: "Occupational particulate inhalation is a major independent etiology for chronic obstructive pulmonary disease.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "nighttime_cough_awakening",
        question: "Do you frequently wake up in the middle of the night or early morning due to coughing fits?",
        why: "Circadian drops in airway caliber and nocturnal gastroesophageal reflux trigger nighttime coughs.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "chest_heaviness_allergies",
        question: "Do pollen, pet dander, or dust mites trigger chest tightness in addition to sneezing?",
        why: "Atopic allergic sensitization often extends into allergic asthma pathophysiology.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "childhood_asthma_history",
        question: "Did you have asthma, frequent wheezing, or eczema during your childhood or adolescence?",
        why: "Early life airway remodeling can persist or re-emerge in adulthood as chronic bronchial hypersensitivity.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "pets_indoor_mold_exposure",
        question: "Do you live in a home with noticeable dampness, mold patches, or furry pets in bedrooms?",
        why: "Ongoing indoor mycotoxins and animal allergens maintain subclinical chronic airway inflammation.",
        type: "radio",
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }]
      },
      {
        id: "recovery_time_colds_long",
        question: "Does a simple head cold typically take more than 2–3 weeks to resolve and settle deeply in your chest?",
        why: "Delayed viral clearance and post-infectious bronchospasm suggest reduced lower airway reserve.",
        type: "radio",
        options: [{ label: "No, resolves fast", value: 0 }, { label: "Yes, takes weeks", value: 1 }]
      }
    ]
  }
};
