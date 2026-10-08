import React from 'react';

export default function ProgressBar({ current, total, stageTitle }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
          {stageTitle || 'Risk Screening'}
        </span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          Question {current} of {total} ({percentage}%)
        </span>
      </div>
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
