import React, { useState, useEffect } from 'react';
import { Info, Check, Calculator, Edit3, Minus, Plus } from 'lucide-react';

export default function QuestionCard({ question, value, onChange }) {
  const { id, question: text, why, type, options, min = 18, max = 100, step = 1, unit, placeholder } = question;

  // Internal state for BMI calculator
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);

  useEffect(() => {
    if (type === 'bmi_calculator') {
      if (!value) {
        const calculatedBmi = Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));
        onChange(calculatedBmi);
      }
    }
  }, [type]);

  const handleBmiUpdate = (h, w) => {
    setHeightCm(h);
    setWeightKg(w);
    if (h > 50 && w > 20) {
      const calculatedBmi = Number((w / Math.pow(h / 100, 2)).toFixed(1));
      onChange(calculatedBmi);
    }
  };

  const handleMultiSelectToggle = (optValue) => {
    let current = Array.isArray(value) ? [...value] : [];
    if (optValue === 'none') {
      onChange(['none']);
      return;
    }
    current = current.filter(item => item !== 'none');
    if (current.includes(optValue)) {
      current = current.filter(item => item !== optValue);
    } else {
      current.push(optValue);
    }
    if (current.length === 0) {
      current = ['none'];
    }
    onChange(current);
  };

  const handleStep = (delta) => {
    const currentVal = value !== undefined && value !== '' ? Number(value) : Math.round((min + max) / 2);
    const newVal = Math.min(max, Math.max(min, currentVal + delta));
    onChange(newVal);
  };

  return (
    <div className="card fade-in" style={{ padding: '2.25rem', marginBottom: '1.5rem' }}>
      <div className="helper-badge">
        <Info size={14} />
        <span>Clinical Context</span>
      </div>

      <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', lineHeight: '1.4' }}>
        {text}
      </h2>

      {why && (
        <div style={{
          backgroundColor: '#F8FAFC',
          borderLeft: '3px solid var(--color-primary)',
          padding: '0.75rem 1rem',
          borderRadius: '0 8px 8px 0',
          marginBottom: '1.75rem'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            <strong style={{ color: 'var(--color-text-main)' }}>Why we ask this: </strong>
            {why}
          </p>
        </div>
      )}

      {/* 1. Radio Options */}
      {type === 'radio' && options && (
        <div>
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <div
                key={String(opt.value)}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onChange(opt.value)}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: isSelected ? '6px solid var(--color-primary)' : '2px solid var(--color-border)',
                  backgroundColor: 'white',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }} />
                <span style={{ flex: 1, fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                {isSelected && <Check size={18} color="var(--color-primary)" />}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Number input with interactive scroll */}
      {type === 'number' && (
        <div style={{ marginTop: '1rem' }}>
          {/* Main Input Row with Step Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleStep(-1)}
                className="btn btn-secondary"
                style={{ width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
                title="Decrease"
              >
                <Minus size={18} />
              </button>

              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="form-input"
                  value={value !== undefined && value !== null ? value : ''}
                  placeholder={placeholder || (id === 'age' ? "Age" : "")}
                  min={min}
                  max={max}
                  step={step || 1}
                  onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{
                    width: '140px',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    color: value ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleStep(1)}
                className="btn btn-secondary"
                style={{ width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
                title="Increase"
              >
                <Plus size={18} />
              </button>
            </div>

            {unit && (
              <span style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                {unit}
              </span>
            )}
          </div>

          {/* Interactive Number Scroll Slider or Scroll List */}
          {id === 'age' ? (
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              overflowX: 'auto',
              gap: '0.75rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none', // hide scrollbar for firefox
              msOverflowStyle: 'none' // hide scrollbar for IE/Edge
            }}>
              <style>{`
                .age-scroll-container::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
                <div
                  key={num}
                  onClick={() => onChange(num)}
                  style={{
                    scrollSnapAlign: 'center',
                    flexShrink: 0,
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: value === num ? 'var(--color-primary)' : 'transparent',
                    color: value === num ? 'white' : 'var(--color-text-muted)',
                    fontSize: value === num ? '1.2rem' : '1rem',
                    fontWeight: value === num ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: value === num ? 'none' : '1px solid transparent'
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                <span>Scroll to select value:</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  {value !== undefined && value !== '' ? `${value} ${unit || ''}` : `Drag slider (${min}–${max})`}
                </span>
              </div>

              <input
                type="range"
                min={min}
                max={max}
                step={step || 1}
                value={value !== undefined && value !== '' ? value : min}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  accentColor: 'var(--color-primary)',
                  cursor: 'pointer'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                <span>{min} {unit || ''}</span>
                <span>{Math.round((min + max) / 2)}</span>
                <span>{max} {unit || ''}</span>
              </div>
            </div>
          )}

          {/* Quick Preset Chips for Common Ages */}
          {id === 'age' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
                Quick select:
              </span>
              {[20, 30, 40, 50, 60, 70].map((presetAge) => (
                <button
                  key={presetAge}
                  type="button"
                  onClick={() => onChange(presetAge)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.85rem',
                    borderRadius: '20px',
                    border: value === presetAge ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: value === presetAge ? '#F0FDFA' : 'white',
                    color: value === presetAge ? 'var(--color-primary)' : 'var(--color-text-main)',
                    fontWeight: value === presetAge ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {presetAge}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Scale 1 to 5 */}
      {type === 'scale' && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            {[1, 2, 3, 4, 5].map((num) => {
              const isSelected = value === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange(num)}
                  style={{
                    flex: 1,
                    padding: '1.25rem 0.5rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                    backgroundColor: isSelected ? '#F0FDFA' : 'white',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(15, 157, 154, 0.15)' : 'none'
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            <span>1 (Not at all)</span>
            <span>3 (Moderately)</span>
            <span>5 (Severely)</span>
          </div>
        </div>
      )}

      {/* 4. Text / Open Notes */}
      {(type === 'textarea' || type === 'text_or_none') && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className={`btn ${value === 'Nothing to add' || value === '' || value === undefined ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onChange('Nothing to add')}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              Nothing to add
            </button>
            <button
              type="button"
              className={`btn ${value && value !== 'Nothing to add' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { if (value === 'Nothing to add' || !value) onChange(''); }}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <Edit3 size={14} style={{ marginRight: '4px' }} /> Enter details
            </button>
          </div>

          {value !== 'Nothing to add' && (
            <textarea
              className="form-input"
              rows={4}
              placeholder={placeholder || "Provide any relevant details about your symptoms, onset, or medical history..."}
              value={value === 'Nothing to add' ? '' : (value || '')}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: '100%', fontSize: '0.95rem', resize: 'vertical' }}
            />
          )}
        </div>
      )}

      {/* 5. Multi-Select */}
      {type === 'multiselect' && options && (
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Select all conditions that apply in your immediate family (or choose 'None'):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {options.map((opt) => {
              const selectedList = Array.isArray(value) ? value : (value === 0 || value === 'none' ? ['none'] : []);
              const isSelected = selectedList.includes(opt.value);
              return (
                <div
                  key={String(opt.value)}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleMultiSelectToggle(opt.value)}
                  style={{ margin: 0, padding: '0.85rem 1rem' }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '4px',
                    border: isSelected ? 'none' : '2px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <Check size={14} color="white" />}
                  </div>
                  <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. BMI Calculator */}
      {type === 'bmi_calculator' && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Height (cm)
              </label>
              <input
                type="number"
                className="form-input"
                min="100"
                max="250"
                value={heightCm}
                onChange={(e) => handleBmiUpdate(Number(e.target.value), weightKg)}
                style={{ fontSize: '1.1rem', fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                className="form-input"
                min="30"
                max="250"
                value={weightKg}
                onChange={(e) => handleBmiUpdate(heightCm, Number(e.target.value))}
                style={{ fontSize: '1.1rem', fontWeight: 600 }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F0FDFA',
            border: '1.5px solid #CCFBF1',
            padding: '1rem 1.25rem',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calculator size={22} color="var(--color-primary)" />
              <div>
                <span style={{ fontSize: '0.85rem', color: '#0F766E', fontWeight: 600, textTransform: 'uppercase' }}>
                  Auto Calculated BMI
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {value || (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>kg/m²</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge" style={{
                backgroundColor: (value || 24.5) < 18.5 ? '#FEF3C7' : ((value || 24.5) <= 24.9 ? '#D1FAE5' : ((value || 24.5) <= 29.9 ? '#FED7AA' : '#FEE2E2')),
                color: (value || 24.5) < 18.5 ? '#92400E' : ((value || 24.5) <= 24.9 ? '#065F46' : ((value || 24.5) <= 29.9 ? '#9A3412' : '#991B1B')),
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px'
              }}>
                {(value || 24.5) < 18.5 ? 'Underweight' : ((value || 24.5) <= 24.9 ? 'Normal' : ((value || 24.5) <= 29.9 ? 'Overweight' : 'Obese'))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7. Select Dropdown */}
      {type === 'select' && options && (
        <div style={{ marginTop: '1rem' }}>
          <select
            className="form-select"
            value={value ?? ''}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ maxWidth: '300px', fontSize: '1.05rem' }}
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
