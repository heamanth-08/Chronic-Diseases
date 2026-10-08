import React from 'react';
import { Info, Check } from 'lucide-react';

export default function QuestionCard({ question, value, onChange }) {
  const { id, question: text, why, type, options, min, max, step, unit } = question;

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

      {/* Render input by type */}
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
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && <Check size={18} color="var(--color-primary)" />}
              </div>
            );
          })}
        </div>
      )}

      {type === 'number' && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="number"
              className="form-input"
              value={value ?? ''}
              min={min}
              max={max}
              step={step || 1}
              onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
              style={{ maxWidth: '200px', fontSize: '1.25rem', fontWeight: 600 }}
            />
            {unit && <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{unit}</span>}
          </div>
          {min && max && (
            <p className="helper-text" style={{ marginTop: '0.5rem' }}>
              Valid range: {min} – {max} {unit || ''}
            </p>
          )}
        </div>
      )}

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
