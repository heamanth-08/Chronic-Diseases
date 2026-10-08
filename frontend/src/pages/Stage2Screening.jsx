import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useScreening } from '../context/ScreeningContext';
import { stage2QuestionsByDisease } from '../data/stage2Questions';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import LoadingState from '../components/LoadingState';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function Stage2Screening({ setView, setSelectedAssessmentId }) {
  const {
    stage1Answers,
    stage1Results,
    stage2TargetDisease,
    stage2Answers,
    setStage2Answers,
    setFinalAssessment
  } = useScreening();

  const diseaseKey = stage2TargetDisease || 'heart';
  const diseaseConfig = stage2QuestionsByDisease[diseaseKey] || stage2QuestionsByDisease.heart;
  const questions = diseaseConfig.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(stage2Answers || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;

  useEffect(() => {
    if (answers[currentQ.id] === undefined && currentQ.options && currentQ.options.length > 0) {
      setAnswers(prev => ({ ...prev, [currentQ.id]: currentQ.options[0].value }));
    }
  }, [currentIndex, currentQ]);

  const handleAnswerChange = (val) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: val
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setStage2Answers(answers);

    try {
      const response = await api.submitStage2({
        disease_category: diseaseKey,
        stage1_answers: stage1Answers,
        stage1_results: stage1Results,
        answers: answers
      });

      setFinalAssessment(response);
      if (response.assessment_id && setSelectedAssessmentId) {
        setSelectedAssessmentId(response.assessment_id);
      }
      setView('results');
    } catch (err) {
      setError(err.message || 'Failed to complete detailed assessment.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message={`Computing detailed ${diseaseConfig.title} & SHAP factor weights...`} />;
  }

  const currentValue = answers[currentQ.id];
  const isAnswered = currentValue !== undefined;

  return (
    <div className="fade-in" style={{ maxWidth: '720px', margin: '1rem auto' }}>
      {/* Category Alert Chip Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: '#FFFBEB',
        border: '1px solid #FDE68A',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.25rem'
      }}>
        <AlertTriangle size={18} color="#D97706" />
        <span style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 600 }}>
          Initial screening flagged increased indicators for <strong>{diseaseConfig.title}</strong>. Stage 2 evaluates 10 targeted factors.
        </span>
      </div>

      <ProgressBar
        current={currentIndex + 1}
        total={totalQ}
        stageTitle={`Stage 2 — Detailed Risk Assessment (${diseaseConfig.title})`}
      />

      {error && (
        <div className="alert-banner alert-banner-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <QuestionCard
        question={currentQ}
        value={currentValue}
        onChange={handleAnswerChange}
      />

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
        >
          <ArrowLeft size={18} />
          <span>Previous Question</span>
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!isAnswered}
          style={{ padding: '0.85rem 2rem' }}
        >
          <span>{currentIndex === totalQ - 1 ? 'Finalize & Generate Report' : 'Next Question'}</span>
          {currentIndex === totalQ - 1 ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
