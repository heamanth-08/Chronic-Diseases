import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import ComparisonTable from '../components/ComparisonTable';
import { ArrowLeft, GitCompare, AlertCircle } from 'lucide-react';

export default function ComparisonView({ id1, id2, setView }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComparison = async () => {
      if (!id1 || !id2) {
        setError('Please select two assessments to compare.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.compareAssessments(id1, id2);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to generate comparison.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [id1, id2]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Calculating longitudinal comparison...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '850px', margin: '1rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setView('history')}
          style={{ padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to History</span>
        </button>
      </div>

      {error ? (
        <div className="alert-banner alert-banner-danger">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <ComparisonTable comparisonData={data} />
      )}
    </div>
  );
}
