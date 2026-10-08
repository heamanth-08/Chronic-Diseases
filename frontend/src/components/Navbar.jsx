import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, PlusCircle, History, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  const { user, logout } = useAuth();

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div
          onClick={() => setView('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(15, 157, 154, 0.35)'
          }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              VitaScreen
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Spot health risks early.
            </span>
          </div>
        </div>

        {/* Navigation Links (when authenticated) */}
        {user && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.9rem' }}
              onClick={() => setView('dashboard')}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            <button
              className={`btn ${currentView === 'stage1' || currentView === 'stage2' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.9rem' }}
              onClick={() => setView('stage1')}
            >
              <PlusCircle size={16} />
              <span>New Screening</span>
            </button>

            <button
              className={`btn ${currentView === 'history' || currentView === 'comparison' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.9rem' }}
              onClick={() => setView('history')}
            >
              <History size={16} />
              <span>History</span>
            </button>

            <button
              className={`btn ${currentView === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.9rem' }}
              onClick={() => setView('profile')}
              title="Health Profile Settings"
            >
              <User size={16} />
              <span>Profile</span>
            </button>

            <button
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', color: '#EF4444' }}
              onClick={logout}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
