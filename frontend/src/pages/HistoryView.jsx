import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import RiskBadge from '../components/RiskBadge';
import { History, FileText, ArrowRight, GitCompare, AlertCircle, PlusCircle } from 'lucide-react';

export default function HistoryView({ setView, setSelectedAssessmentId, setCompareIds }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await api.getHistory();
        setHistory(data);
      } catch (err) {
        setError(err.message || 'Failed to load assessment history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleToggleCompare = (id) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleRunComparison = () => {
    if (selectedForCompare.length === 2 && setCompareIds) {
      setCompareIds(selectedForCompare[0], selectedForCompare[1]);
      setView('comparison');
    }
  };

  const handleOpenAssessment = (id) => {
    if (setSelectedAssessmentId) {
      setSelectedAssessmentId(id);
    }
    setView('results');
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Loading assessment history...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '850px', margin: '1rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={26} color="var(--color-primary)" />
            Health Screening History
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Select any two assessments to view a longitudinal side-by-side comparison
          </p>
        </div>

        {selectedForCompare.length === 2 && (
          <button
            className="btn btn-primary fade-in"
            onClick={handleRunComparison}
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <GitCompare size={18} />
            <span>Compare Selected (2)</span>
          </button>
        )}
      </div>

      {error && (
        <div className="alert-banner alert-banner-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {history.length === 0 ? (
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            You haven't completed any health risk screenings yet.
          </p>
          <button className="btn btn-primary" onClick={() => setView('stage1')}>
            <PlusCircle size={18} />
            <span>Start Your First Screening</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {history.map((a) => {
            const isSelected = selectedForCompare.includes(a.id);
            return (
              <div
                key={a.id}
                className="card card-interactive"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-primary-light)' : 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleCompare(a.id)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                    title="Select for comparison"
                  />

                  <div onClick={() => handleOpenAssessment(a.id)} style={{ cursor: 'pointer' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                      {a.primary_category} Assessment
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      {new Date(a.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Trend: <strong>{a.trend_status}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <RiskBadge level={a.overall_risk_level} score={a.risk_score} showScore />
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenAssessment(a.id)}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                  >
                    <span>View Report</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: '0.775rem', color: 'var(--color-text-light)', textAlign: 'center', marginTop: '1.5rem' }}>
        Note: These labels describe screening results, not your medical condition.
      </p>
    </div>
  );
}
