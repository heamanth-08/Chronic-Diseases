import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

export default function RiskBadge({ level, score, showScore = false, size = 'md' }) {
  const normalizedLevel = (level || 'low').toLowerCase();

  let Icon = ShieldCheck;
  let label = 'Low Risk';
  let badgeClass = 'risk-badge-low';

  if (normalizedLevel === 'elevated' || normalizedLevel === 'high') {
    Icon = AlertTriangle;
    label = 'Elevated Risk';
    badgeClass = 'risk-badge-elevated';
  } else if (normalizedLevel === 'moderate' || normalizedLevel === 'medium') {
    Icon = AlertCircle;
    label = 'Moderate Risk';
    badgeClass = 'risk-badge-moderate';
  }

  const iconSize = size === 'lg' ? 20 : (size === 'sm' ? 14 : 16);
  const scorePercent = typeof score === 'number' ? Math.round(score * 100) : null;

  return (
    <span className={`risk-badge ${badgeClass} ${size === 'lg' ? 'text-base py-1.5 px-3.5' : ''}`}>
      <Icon size={iconSize} />
      <span>{label}</span>
      {showScore && scorePercent !== null && (
        <span style={{ opacity: 0.85, fontWeight: 500 }}>({scorePercent}%)</span>
      )}
    </span>
  );
}
