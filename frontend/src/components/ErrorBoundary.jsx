import React from 'react';

/**
 * Generic React Error Boundary.
 * Catches runtime errors in child components and renders a fallback UI
 * instead of crashing the entire page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            backgroundColor: '#F8FAFC',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: 0 }}>
              ⚠️ {this.props.fallbackMessage || 'This section failed to load. Please refresh the page.'}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
