import React from 'react';
import { HeartPulse, ArrowRight, ShieldCheck } from 'lucide-react';

export default function EmptyState({ onStart }) {
  return (
    <div className="card fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '650px', margin: '2rem auto' }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        color: 'var(--color-primary)'
      }}>
        <HeartPulse size={36} />
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Welcome to VitaScreen</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        Spot chronic health risk indicators early across 5 vital categories: Heart, Diabetes, Hypertension, Kidney, and Respiratory health.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '400px',
        margin: '0 auto 2rem',
        textAlign: 'left',
        fontSize: '0.9rem',
        color: 'var(--color-text-main)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--risk-low)" />
          <span>Stage 1: 15 general health questions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--risk-low)" />
          <span>Multi-disease machine learning risk triage</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--risk-low)" />
          <span>SHAP explainable factor analysis & PDF reports</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart} style={{ padding: '0.85rem 2rem', fontSize: '1.1rem' }}>
        <span>Start Your Initial Screening</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
