import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { User, Save, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ProfileSettings({ setView }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [smokingStatus, setSmokingStatus] = useState('never');
  const [physicalActivity, setPhysicalActivity] = useState('moderate');
  const [alcoholUse, setAlcoholUse] = useState('occasional');
  const [familyHistory, setFamilyHistory] = useState([]);
  const [existingConditions, setExistingConditions] = useState([]);

  const heightM = heightCm / 100.0;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : 22.0;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const p = await api.getProfile();
        setAge(p.age);
        setGender(p.gender);
        setHeightCm(p.height_cm);
        setWeightKg(p.weight_kg);
        setSmokingStatus(p.smoking_status);
        setPhysicalActivity(p.physical_activity);
        setAlcoholUse(p.alcohol_use);
        setFamilyHistory(p.family_history || []);
        setExistingConditions(p.existing_conditions || []);
      } catch (err) {
        setError('Could not load profile. You may need to complete onboarding.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const toggleFamilyHistory = (item) => {
    setFamilyHistory(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      await api.updateProfile({
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
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading your profile data...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '680px', margin: '1rem auto' }}>
      <button
        className="btn btn-secondary"
        onClick={() => setView('dashboard')}
        style={{ marginBottom: '1.25rem', padding: '0.45rem 0.85rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>Health Profile Settings</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Update your baseline parameters used across screening models
            </p>
          </div>
        </div>

        {success && (
          <div className="alert-banner alert-banner-success fade-in" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} />
            <span>Health profile updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-banner-danger" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Age</label>
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
                <option value="male">Male</option>
                <option value="female">Female</option>
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

          <div style={{
            backgroundColor: 'var(--color-bg-subtle)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Calculated BMI</span>
            <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.25rem' }}>{bmi} kg/m²</span>
          </div>

          <div className="form-group">
            <label className="form-label">Smoking Status</label>
            <select className="form-select" value={smokingStatus} onChange={(e) => setSmokingStatus(e.target.value)}>
              <option value="never">Never Smoked</option>
              <option value="former">Former Smoker</option>
              <option value="current">Current Smoker</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Physical Activity</label>
            <select className="form-select" value={physicalActivity} onChange={(e) => setPhysicalActivity(e.target.value)}>
              <option value="low">Low / Sedentary</option>
              <option value="moderate">Moderate (1-3x/week)</option>
              <option value="high">High (4+ sessions)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Alcohol Consumption</label>
            <select className="form-select" value={alcoholUse} onChange={(e) => setAlcoholUse(e.target.value)}>
              <option value="none">None / Rare</option>
              <option value="occasional">Occasional</option>
              <option value="regular">Regular (3+/week)</option>
            </select>
          </div>

          {/* Family History Checklist */}
          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="form-label">Family Medical History</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
              {[
                { id: 'heart', label: 'Heart Disease' },
                { id: 'diabetes', label: 'Diabetes' },
                { id: 'hypertension', label: 'High BP' },
                { id: 'kidney', label: 'Kidney Disease' },
                { id: 'respiratory', label: 'Asthma / COPD' }
              ].map((item) => {
                const checked = familyHistory.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`btn ${checked ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    onClick={() => toggleFamilyHistory(item.id)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}
            disabled={saving}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Updates'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
