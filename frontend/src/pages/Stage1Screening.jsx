import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useScreening } from '../context/ScreeningContext';
import { stage1Questions } from '../data/stage1Questions';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import LoadingState from '../components/LoadingState';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Stage1Screening({ setView, setSelectedAssessmentId }) {
  const {
    stage1Answers,
    setStage1Answers,
    setStage1Results,
    setStage2TargetDisease
  } = useScreening();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(stage1Answers || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQ = stage1Questions[currentIndex];
  const totalQ = stage1Questions.length;

  // Initialize answer with default if not present
  useEffect(() => {
    if (answers[currentQ.id] === undefined) {
      if (currentQ.defaultValue !== undefined) {
        setAnswers(prev => ({ ...prev, [currentQ.id]: currentQ.defaultValue }));
      } else if (currentQ.options && currentQ.options.length > 0) {
        setAnswers(prev => ({ ...prev, [currentQ.id]: currentQ.options[0].value }));
      }
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
    setStage1Answers(answers);

    try {
      const response = await api.submitStage1(answers);
      setStage1Results(response.results);

      if (response.requires_stage2 && response.trigger_disease) {
        setStage2TargetDisease(response.trigger_disease);
        setView('stage2');
      } else {
        if (response.created_assessment_id && setSelectedAssessmentId) {
          setSelectedAssessmentId(response.created_assessment_id);
        }
        setView('results');
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze responses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Analyzing your responses across 5 ML risk pipelines..." />;
  }

  const currentValue = answers[currentQ.id];
  const isAnswered = currentValue !== undefined && currentValue !== '';

  return (
    <div className="fade-in" style={{ maxWidth: '720px', margin: '1rem auto' }}>
      <ProgressBar
        current={currentIndex + 1}
        total={totalQ}
        stageTitle="Stage 1 — Initial Risk Screening"
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

      {/* Navigation Buttons */}
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
          <span>{currentIndex === totalQ - 1 ? 'Analyze Risk Profile' : 'Next Question'}</span>
          {currentIndex === totalQ - 1 ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
