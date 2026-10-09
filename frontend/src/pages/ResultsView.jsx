import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import RiskBadge from '../components/RiskBadge';
import FactorChart from '../components/FactorChart';
import DoctorMap from '../components/DoctorMap';
import {
  Download, ArrowLeft, Heart, Droplets, Gauge, ShieldAlert,
  Wind, UserCheck, AlertCircle, CheckCircle2, FileText, Share2
} from 'lucide-react';

const ICON_MAP = {
  heart: Heart,
  diabetes: Droplets,
  hypertension: Gauge,
  kidney: ShieldAlert,
  respiratory: Wind
};

export default function ResultsView({ assessmentId, setView }) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        if (assessmentId) {
          const data = await api.getAssessment(assessmentId);
          setAssessment(data);
        } else {
          // If no specific ID, load latest from history
          const history = await api.getHistory();
          if (history && history.length > 0) {
            const latest = await api.getAssessment(history[0].id);
            setAssessment(latest);
          } else {
            setError('No assessment results found.');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load assessment report.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [assessmentId]);

  const handleDownloadPdf = async () => {
    if (!assessment) return;
    try {
      setDownloading(true);
      await api.downloadPdf(assessment.id);
    } catch (err) {
      alert('Could not generate PDF report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Loading assessment report...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="alert-banner alert-banner-danger" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <AlertCircle size={20} />
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>{error || 'Assessment not found.'}</p>
          <button className="btn btn-secondary" style={{ marginTop: '0.75rem' }} onClick={() => setView('dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isElevated = assessment.overall_risk_level === 'Elevated';
  const isMod = assessment.overall_risk_level === 'Moderate';

  return (
    <div className="fade-in" style={{ maxWidth: '900px', margin: '1rem auto' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setView('dashboard')}
          style={{ padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleDownloadPdf}
            disabled={downloading}
            style={{ padding: '0.6rem 1.25rem' }}
          >
            <Download size={16} />
            <span>{downloading ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="card" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        borderLeft: isElevated ? '6px solid #EF4444' : (isMod ? '6px solid #F59E0B' : '6px solid #10B981')
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Personal Health Risk Assessment Result
            </span>
            <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              {assessment.primary_category} Risk Screening
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Assessed on {new Date(assessment.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Model Pipeline v{assessment.model_version}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <RiskBadge level={assessment.overall_risk_level} score={assessment.risk_score} showScore size="lg" />
          </div>
        </div>

        {/* Plain Language Interpretation */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--color-text-main)' }}>
            Plain-Language Screening Summary
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
            {isElevated ? (
              <>Your screening indicators reflect an <strong>elevated risk pattern</strong> for {assessment.primary_category.toLowerCase()}. While this is not a diagnostic confirmation, having this awareness allows you to consult with a medical professional promptly for validation.</>
            ) : (isMod ? (
              <>Your screening indicates a <strong>moderate risk category</strong>. Certain health markers suggest increased susceptibility that is worthwhile to monitor proactively with routine healthy lifestyle adjustments.</>
            ) : (
              <>Your responses reflect a <strong>low risk profile</strong> across the evaluated parameters. Continuing your healthy lifestyle routines and attending periodic check-ups is recommended.</>
            ))}
          </p>
        </div>

        {/* Specialist Referral Box */}
        <div style={{
          backgroundColor: isElevated ? '#FEF2F2' : 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          border: isElevated ? '1px solid #FECACA' : '1px solid var(--color-primary)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <UserCheck size={24} color={isElevated ? '#DC2626' : 'var(--color-primary)'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '1rem', color: isElevated ? '#991B1B' : 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>
              Specialist Consultation Recommendation: {assessment.specialist_referral || 'General Physician'}
            </strong>
            <p style={{ fontSize: '0.9rem', color: isElevated ? '#7F1D1D' : 'var(--color-text-main)', margin: 0 }}>
              {assessment.consultation_recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* SHAP Contributing Factors Breakdown */}
      <div style={{ marginBottom: '2rem' }}>
        <FactorChart factors={assessment.top_contributing_factors} />
      </div>

      {/* Multi-Category 5 Disease Breakdown */}
      {assessment.stage1_results && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
            Multi-Category Risk Overview (All 5 Categories)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(assessment.stage1_results).map(([catKey, catVal]) => {
              const IconComp = ICON_MAP[catKey] || Heart;
              return (
                <div
                  key={catKey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.25rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)'
                    }}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{catVal.category_name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        {catVal.summary}
                      </p>
                    </div>
                  </div>

                  <RiskBadge level={catVal.level} score={catVal.score} showScore />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Doctors Live Map */}
      <DoctorMap recommendedSpecialty={assessment.specialist_referral} />
    </div>
  );
}
