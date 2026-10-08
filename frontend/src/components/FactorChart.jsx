import React from 'react';
import { HelpCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function FactorChart({ factors = [] }) {
  if (!factors || factors.length === 0) {
    return (
      <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <CheckCircle2 size={32} color="var(--risk-low)" style={{ margin: '0 auto 0.5rem' }} />
        <p>No adverse contributing factors identified.</p>
      </div>
    );
  }

  const maxImpact = Math.max(...factors.map(f => f.impact || 10), 30);

  return (
    <div className="card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem' }}>Factors That Influenced This Screening</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <HelpCircle size={14} /> Model Explainability (SHAP)
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {factors.map((item, idx) => {
          const percent = Math.min(100, Math.round((item.impact / maxImpact) * 100));
          const isAdverse = item.direction === 'increases_risk';

          return (
            <div key={idx} className="fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                  {item.factor}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isAdverse ? 'var(--risk-elev)' : 'var(--risk-low)' }}>
                  {item.impact}% weight
                </span>
              </div>

              {/* Progress bar representing feature importance */}
              <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: '9999px',
                overflow: 'hidden',
                marginBottom: '0.35rem'
              }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  backgroundColor: isAdverse ? '#EF4444' : '#10B981',
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {item.plain_text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
