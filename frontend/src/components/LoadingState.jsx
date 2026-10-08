import React from 'react';
import { Activity } from 'lucide-react';

export default function LoadingState({ message = "Analyzing your responses..." }) {
  return (
    <div className="card fade-in" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '3rem auto' }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        animation: 'spin 2s linear infinite'
      }}>
        <Activity size={32} />
      </div>

      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{message}</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Evaluating indicators across multi-disease machine learning pipelines...
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
