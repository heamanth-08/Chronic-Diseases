import React, { useState, useEffect } from 'react';
import { Watch, HeartPulse, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function SmartwatchWidget() {
  const [connected, setConnected] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [hrv, setHrv] = useState(45);

  useEffect(() => {
    let interval;
    if (connected) {
      interval = setInterval(() => {
        // Mock live data variations
        setBpm(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3));
        setSpo2(prev => Math.min(100, Math.max(90, prev + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
        setHrv(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [connected]);

  const handleConnect = () => {
    setConnected(true);
  };

  return (
    <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Watch size={24} color="#3B82F6" />
          Smartwatch Integration
        </h3>
        {!connected ? (
          <button className="btn btn-primary" onClick={handleConnect} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Connect Device
          </button>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10B981', fontSize: '0.9rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Connected
          </span>
        )}
      </div>

      {connected ? (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, backgroundColor: '#EFF6FF', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <HeartPulse size={32} color="#EF4444" />
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Live BPM</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>{bpm} <span style={{ fontSize: '1rem', fontWeight: 500 }}>bpm</span></div>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#EFF6FF', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Activity size={32} color="#3B82F6" />
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>SpO2 Level</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>{spo2}%</div>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#EFF6FF', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Zap size={32} color="#F59E0B" />
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Heart Rate Var.</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>{hrv} <span style={{ fontSize: '1rem', fontWeight: 500 }}>ms</span></div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Connect your smartwatch to stream live health data such as BPM, SpO2, and Heart Rate Variability directly into your health dashboard.
        </p>
      )}
    </div>
  );
}
