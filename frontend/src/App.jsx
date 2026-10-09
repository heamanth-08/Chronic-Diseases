import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScreeningProvider } from './context/ScreeningContext';
import Navbar from './components/Navbar';
import DisclaimerFooter from './components/DisclaimerFooter';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Stage1Screening from './pages/Stage1Screening';
import Stage2Screening from './pages/Stage2Screening';
import ResultsView from './pages/ResultsView';
import HistoryView from './pages/HistoryView';
import ComparisonView from './pages/ComparisonView';
import ProfileSettings from './pages/ProfileSettings';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setView] = useState('dashboard');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [compareId1, setCompareId1] = useState(null);
  const [compareId2, setCompareId2] = useState(null);

  const setCompareIds = (id1, id2) => {
    setCompareId1(id1);
    setCompareId2(id2);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-page)'
      }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          Initializing VitaScreen...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="app-layout">
        <Navbar currentView={currentView} setView={setView} />
        <main className="main-content">
          {currentView === 'register' ? (
            <Register setView={setView} />
          ) : (
            <Login setView={setView} />
          )}
        </main>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 1.5rem' }}>
          <DisclaimerFooter />
        </div>
      </div>
    );
  }

  // Needs onboarding
  if (!user.has_profile && currentView !== 'profile') {
    return (
      <div className="app-layout">
        <Navbar currentView="onboarding" setView={setView} />
        <main className="main-content">
          <Onboarding setView={setView} />
        </main>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 1.5rem' }}>
          <DisclaimerFooter />
        </div>
      </div>
    );
  }

  // Ensure view is valid for logged-in session
  const validViews = ['dashboard', 'onboarding', 'stage1', 'stage2', 'results', 'history', 'comparison', 'profile'];
  const activeView = validViews.includes(currentView) ? currentView : 'dashboard';

  return (
    <div className="app-layout">
      <Navbar currentView={activeView} setView={setView} />
      <main className="main-content">
        {activeView === 'dashboard' && (
          <Dashboard setView={setView} setSelectedAssessmentId={setSelectedAssessmentId} />
        )}
        {activeView === 'onboarding' && (
          <Onboarding setView={setView} />
        )}
        {activeView === 'stage1' && (
          <Stage1Screening setView={setView} setSelectedAssessmentId={setSelectedAssessmentId} />
        )}
        {activeView === 'stage2' && (
          <Stage2Screening setView={setView} setSelectedAssessmentId={setSelectedAssessmentId} />
        )}
        {activeView === 'results' && (
          <ResultsView assessmentId={selectedAssessmentId} setView={setView} />
        )}
        {activeView === 'history' && (
          <HistoryView setView={setView} setSelectedAssessmentId={setSelectedAssessmentId} setCompareIds={setCompareIds} />
        )}
        {activeView === 'comparison' && (
          <ComparisonView id1={compareId1} id2={compareId2} setView={setView} />
        )}
        {activeView === 'profile' && (
          <ProfileSettings setView={setView} />
        )}
      </main>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 1.5rem' }}>
        <DisclaimerFooter />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScreeningProvider>
        <AppContent />
      </ScreeningProvider>
    </AuthProvider>
  );
}
