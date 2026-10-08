import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CATEGORY_COLORS = {
  heart: { label: 'Heart', border: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
  diabetes: { label: 'Diabetes', border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  hypertension: { label: 'Hypertension', border: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  kidney: { label: 'Kidney', border: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
  respiratory: { label: 'Respiratory', border: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' }
};

export default function TrendChart({ history = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!history || history.length === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <Activity size={36} color="var(--color-text-light)" style={{ margin: '0 auto 0.5rem' }} />
        <p style={{ fontWeight: 600 }}>No historical assessments recorded yet.</p>
        <p style={{ fontSize: '0.875rem' }}>Complete your first risk screening to start tracking longitudinal trends.</p>
      </div>
    );
  }

  const labels = history.map((item) => item.date || 'Assessment');

  let datasets = [];
  if (selectedCategory === 'all') {
    datasets = Object.keys(CATEGORY_COLORS).map((key) => {
      const meta = CATEGORY_COLORS[key];
      return {
        label: meta.label,
        data: history.map((h) => (h[key] !== undefined ? h[key] : (h.overall_score ? Math.round(h.overall_score * 100) : 20))),
        borderColor: meta.border,
        backgroundColor: meta.bg,
        tension: 0.35,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });
  } else {
    const meta = CATEGORY_COLORS[selectedCategory];
    datasets = [
      {
        label: meta.label,
        data: history.map((h) => (h[selectedCategory] !== undefined ? h[selectedCategory] : (h.overall_score ? Math.round(h.overall_score * 100) : 20))),
        borderColor: meta.border,
        backgroundColor: meta.bg,
        tension: 0.35,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ];
  }

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 },
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}% Risk Index`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => {
            if (value === 20) return 'Low (<30%)';
            if (value === 50) return 'Moderate (30-60%)';
            if (value === 80) return 'Elevated (>60%)';
            return `${value}%`;
          },
          font: { family: 'Plus Jakarta Sans', size: 11 }
        },
        grid: { color: 'rgba(226, 232, 240, 0.6)' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 12, weight: 500 } }
      }
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--color-primary)" />
            Longitudinal Risk Trend
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Track risk evolution across past screening evaluations
          </p>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          <button
            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '9999px' }}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_COLORS).map(([key, meta]) => (
            <button
              key={key}
              className={`btn ${selectedCategory === key ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '9999px',
                borderColor: selectedCategory === key ? meta.border : undefined
              }}
              onClick={() => setSelectedCategory(key)}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '280px', position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.75rem', textAlign: 'center' }}>
        * Refers to screening risk model output across assessments, not clinical diagnostic confirmation.
      </p>
    </div>
  );
}
