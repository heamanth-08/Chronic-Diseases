import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useScreening } from '../context/ScreeningContext';
import RiskBadge from '../components/RiskBadge';
import TrendChart from '../components/TrendChart';
import EmptyState from '../components/EmptyState';
import {
  Heart, Droplets, Gauge, ShieldAlert, Wind,
  AlertTriangle, PlusCircle, ArrowRight, FileText,
  TrendingUp, TrendingDown, Minus, Calendar, Activity
} from 'lucide-react';

import SmartwatchWidget from '../components/SmartwatchWidget';

const ICON_MAP = {
  Heart: Heart,
  Droplets: Droplets,
  Gauge: Gauge,
  Activity: ShieldAlert,
  Wind: Wind
};

export default function Dashboard({ setView, setSelectedAssessmentId }) {
  const { resetScreening } = useScreening();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardSummary();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStartAnalysis = () => {
    resetScreening();
    setView('stage1');
  };

  const handleViewAssessment = (id) => {
    if (setSelectedAssessmentId) {
      setSelectedAssessmentId(id);
    }
    setView('results');
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Loading your health dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-banner alert-banner-danger" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  if (!data || data.total_assessments === 0) {
    return (
      <div className="fade-in">
        <SmartwatchWidget />
        <EmptyState onStart={handleStartAnalysis} />
      </div>
    );
  }

  const lastDateFormatted = data.last_analysis_date
    ? new Date(data.last_analysis_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not yet assessed';

  return (
    <div className="fade-in">
      {/* Top Welcome & Actions Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
            Hello, {data.user_name}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Age: {data.age}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} /> Last screening: {lastDateFormatted}
            </span>
          </p>
        </div>

        <button
          className="btn btn-primary"
          style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}
          onClick={handleStartAnalysis}
        >
          <PlusCircle size={18} />
          <span>Start New Analysis</span>
        </button>
      </div>

      {/* Elevated Risk Alert Banner if any category is elevated */}
      {data.has_elevated_risk && (
        <div className="alert-banner alert-banner-danger fade-in">
          <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.25rem' }}>
              Elevated Risk Identified in Screening: {data.elevated_categories.join(', ')}
            </strong>
            <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.9 }}>
              Your latest screening responses indicate elevated risk indicators. We recommend consulting an appropriate specialist for a comprehensive clinical evaluation.
            </p>
          </div>
        </div>
      )}

      {/* Smartwatch Integration Widget */}
      <SmartwatchWidget />

      {/* 5 Disease Categories Overview Cards */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>
          Current Health Risk Overview (5 Chronic Categories)
        </h2>

        <div className="grid-5">
          {data.categories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Activity;
            const isElevated = cat.current_level === 'Elevated';
            const isMod = cat.current_level === 'Moderate';

            let TrendIcon = Minus;
            let trendColor = 'var(--color-text-muted)';
            if (cat.trend_status === 'Improving') {
              TrendIcon = TrendingDown;
              trendColor = 'var(--risk-low)';
            } else if (cat.trend_status === 'Increased') {
              TrendIcon = TrendingUp;
              trendColor = 'var(--risk-elev)';
            }

            return (
              <div
                key={cat.category_id}
                className={`card ${isElevated ? 'pulse-card' : ''}`}
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isElevated ? '4px solid #EF4444' : (isMod ? '4px solid #F59E0B' : '4px solid #10B981')
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      backgroundColor: isElevated ? '#FEE2E2' : (isMod ? '#FEF3C7' : '#ECFDF5'),
                      color: isElevated ? '#EF4444' : (isMod ? '#F59E0B' : '#10B981'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComp size={20} />
                    </div>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      color: trendColor
                    }}>
                      <TrendIcon size={14} />
                      {cat.trend_status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                    {cat.category_name}
                  </h3>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <RiskBadge level={cat.current_level} score={cat.current_score} showScore />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Longitudinal Trend Chart */}
      <div style={{ marginBottom: '2.5rem' }}>
        <TrendChart history={data.trend_history} />
      </div>

      {/* Recent Assessments List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem' }}>Recent Assessments</h2>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            onClick={() => setView('history')}
          >
            <span>View All History</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.recent_assessments.map((a) => (
            <div
              key={a.id}
              className="card-interactive"
              onClick={() => handleViewAssessment(a.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)'
                }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>
                    {a.primary_category} Assessment
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <RiskBadge level={a.overall_risk_level} score={a.risk_score} showScore />
                <ArrowRight size={16} color="var(--color-text-muted)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
