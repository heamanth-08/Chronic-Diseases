import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { UserCheck, Activity, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export default function Onboarding({ setView }) {
  const { updateProfileStatus } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 State
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState('female');
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(68);

  // Step 2 State
  const [smokingStatus, setSmokingStatus] = useState('never');
  const [physicalActivity, setPhysicalActivity] = useState('moderate');
  const [alcoholUse, setAlcoholUse] = useState('occasional');
  const [familyHistory, setFamilyHistory] = useState([]);
  const [existingConditions, setExistingConditions] = useState([]);

  // Auto-calculated BMI
  const heightM = heightCm / 100.0;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : 22.0;

  const toggleFamilyHistory = (item) => {
    setFamilyHistory(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const toggleCondition = (item) => {
    setExistingConditions(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.saveProfile({
        age: Number(age),
        gender,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        smoking_status: smokingStatus,
        physical_activity: physicalActivity,
        alcohol_use: alcoholUse,
        family_history: familyHistory,
        existing_conditions: existingConditions
      });

      updateProfileStatus(true);
      setView('dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save health profile. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '680px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step {step} of 2
            </span>
            <h1 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>
              {step === 1 ? 'Demographics & Body Composition' : 'Lifestyle & Family Medical Background'}
            </h1>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {step === 1 ? <UserCheck size={22} /> : <Activity size={22} />}
          </div>
        </div>

        {error && (
          <div className="alert-banner alert-banner-danger" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="fade-in">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age (18+)</label>
                <input
                  type="number"
                  min="18"
                  max="120"
                  className="form-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biological Sex</label>
                <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  className="form-input"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  className="form-input"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />
              </div>
            </div>

            {/* Auto BMI Card */}
            <div style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Auto-Calculated Body Mass Index (BMI)
                </span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.2rem 0 0' }}>
                  {bmi} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>kg/m²</span>
                </p>
              </div>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: bmi < 18.5 ? '#FEF3C7' : (bmi < 25 ? '#ECFDF5' : (bmi < 30 ? '#FFFBEB' : '#FEF2F2')),
                color: bmi < 18.5 ? '#92400E' : (bmi < 25 ? '#065F46' : (bmi < 30 ? '#B45309' : '#991B1B'))
              }}>
                {bmi < 18.5 ? 'Underweight' : (bmi < 25 ? 'Normal BMI' : (bmi < 30 ? 'Overweight' : 'Elevated BMI'))}
              </span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={() => setStep(2)}
            >
              <span>Next: Lifestyle & Medical History</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="fade-in">
            <div className="form-group">
              <label className="form-label">Smoking Status</label>
              <div className="grid-3">
                {[
                  { id: 'never', label: 'Never Smoked' },
                  { id: 'former', label: 'Former Smoker' },
                  { id: 'current', label: 'Current Smoker' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`btn ${smokingStatus === item.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.65rem 0.75rem', fontSize: '0.9rem' }}
                    onClick={() => setSmokingStatus(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Activity Level</label>
              <div className="grid-3">
                {[
                  { id: 'low', label: 'Low (Sedentary)' },
                  { id: 'moderate', label: 'Moderate (1-3x/wk)' },
                  { id: 'high', label: 'High (4+ sessions)' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`btn ${physicalActivity === item.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.65rem 0.75rem', fontSize: '0.9rem' }}
                    onClick={() => setPhysicalActivity(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alcohol Consumption</label>
              <div className="grid-3">
                {[
                  { id: 'none', label: 'None / Rarely' },
                  { id: 'occasional', label: 'Occasional' },
                  { id: 'regular', label: 'Regular (3+/wk)' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`btn ${alcoholUse === item.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.65rem 0.75rem', fontSize: '0.9rem' }}
                    onClick={() => setAlcoholUse(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Family History Checklist */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Family History (Immediate family)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {[
                  { id: 'heart', label: 'Heart Disease' },
                  { id: 'diabetes', label: 'Type 2 Diabetes' },
                  { id: 'hypertension', label: 'High Blood Pressure' },
                  { id: 'kidney', label: 'Kidney Disease' },
                  { id: 'respiratory', label: 'Asthma / COPD' }
                ].map((item) => {
                  const checked = familyHistory.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleFamilyHistory(item.id)}
                      className={`option-card ${checked ? 'selected' : ''}`}
                      style={{ padding: '0.65rem 0.9rem', marginBottom: 0 }}
                    >
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '4px',
                        border: checked ? 'none' : '2px solid var(--color-border)',
                        backgroundColor: checked ? 'var(--color-primary)' : 'white',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {checked && <Check size={14} />}
                      </div>
                      <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.85rem' }}
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.85rem' }}
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Saving Health Profile...' : 'Complete & Open Dashboard'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
