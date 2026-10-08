import React from 'react';
import RiskBadge from './RiskBadge';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from 'lucide-react';

export default function ComparisonTable({ comparisonData }) {
  if (!comparisonData) return null;

  const {
    assessment_1: a1,
    assessment_2: a2,
    risk_change_label: changeLabel,
    score_difference: diff,
    changed_factors: changedFactors,
    summary_message: summaryMsg
  } = comparisonData;

  const isIncreased = changeLabel === 'Increased';
  const isDecreased = changeLabel === 'Decreased';

  return (
    <div className="card fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
          Side-by-Side Assessment Comparison
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          {summaryMsg}
        </p>
      </div>

      {/* Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Previous Assessment */}
        <div style={{
          padding: '1.25rem',
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Previous Screening
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
            {new Date(a1.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{a1.primary_category}</p>
              <RiskBadge level={a1.overall_risk_level} score={a1.risk_score} showScore />
            </div>
          </div>
        </div>

        {/* Current Assessment */}
        <div style={{
          padding: '1.25rem',
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-primary)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Current Screening
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: isIncreased ? 'var(--risk-elev)' : (isDecreased ? 'var(--risk-low)' : 'var(--color-text-muted)')
            }}>
              {isIncreased && <ArrowUpRight size={16} />}
              {isDecreased && <ArrowDownRight size={16} />}
              {!isIncreased && !isDecreased && <Minus size={16} />}
              {changeLabel} ({diff > 0 ? `+${Math.round(diff * 100)}%` : `${Math.round(diff * 100)}%`})
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            {new Date(a2.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{a2.primary_category}</p>
            <RiskBadge level={a2.overall_risk_level} score={a2.risk_score} showScore />
          </div>
        </div>
      </div>

      {/* Changed Input Factors */}
      {changedFactors && changedFactors.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} color="var(--color-primary)" />
            Identified Input Changes Between Screenings
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Health Indicator</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Previous Response</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Current Response</th>
                </tr>
              </thead>
              <tbody>
                {changedFactors.map((f, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{f.factor_name}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)' }}>{f.previous_value}</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>{f.current_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
