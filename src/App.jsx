import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ef4444',
          fontFamily: 'system-ui'
        }}>
          <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            <h1>⚠️ Application Error</h1>
            <p>{this.state.error?.message}</p>
            <p style={{ fontSize: '12px', marginTop: '20px', opacity: 0.8 }}>Check browser console for details</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return <AppContent />;
  }
}

function AppContent() {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const [authPage, setAuthPage] = useState('login');

  useEffect(() => {
    console.log('App: user changed -', user, 'loading -', loading, 'isDark -', isDark);
  }, [user, loading, isDark]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? '#0f172a' : '#fffbeb',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid ' + (isDark ? '#fbbf24' : '#f59e0b'),
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: isDark ? '#94a3b8' : '#78716c', marginTop: '20px', fontSize: '14px' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // No user - show auth pages
  if (!user) {
    console.log('App: Rendering auth page -', authPage);
    return authPage === 'login' ? (
      <Login onSwitchToSignup={() => setAuthPage('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthPage('login')} />
    );
  }

  // User logged in - show dashboard
  console.log('App: Rendering dashboard');
  return <Dashboard />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
