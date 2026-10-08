import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DisclaimerFooter() {
  return (
    <footer className="disclaimer-box" role="contentinfo">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.35rem', color: '#475569', fontWeight: 600 }}>
        <ShieldAlert size={15} color="#0F9D9A" />
        <span>Medical Screening Boundary & Disclaimer</span>
      </div>
      <p style={{ margin: 0 }}>
        This system provides an AI-based risk assessment for early awareness and does not provide a medical diagnosis.
        The results should not replace professional medical advice. If you have concerns about your health, please consult a qualified healthcare professional.
      </p>
    </footer>
  );
}
