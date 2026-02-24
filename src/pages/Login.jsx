import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDark } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      login({
        id: data.userId,
        email: data.email,
        name: data.name,
        token: data.token
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Make sure backend is running on port 5000');
      setLoading(false);
    }
  };

  const bgColor = isDark ? '#0f172a' : '#fffbeb';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1e293b';
  const labelColor = isDark ? '#cbd5e1' : '#334155';
  const inputBg = isDark ? '#334155' : '#fef3c7';
  const inputBorder = isDark ? '#475569' : '#fcd34d';
  const buttonBg = isDark ? '#b45309' : '#f59e0b';
  const errorBg = isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  const errorBorder = isDark ? '#dc2626' : '#dc2626';
  const errorText = isDark ? '#fca5a5' : '#b91c1c';

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bgColor,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        backgroundColor: cardBg,
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: `1px solid ${inputBorder}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: isDark ? 'rgba(180, 83, 9, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ fontSize: '32px' }}>👤</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: textColor,
            margin: '0 0 8px 0'
          }}>Welcome Back</h1>
          <p style={{
            color: labelColor,
            margin: '0',
            fontSize: '14px'
          }}>Sign in to your checklist dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: errorBg,
            border: `1px solid ${errorBorder}`,
            borderRadius: '6px',
            color: errorText,
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '8px',
              color: labelColor
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: '6px',
                color: textColor,
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = isDark ? '#fbbf24' : '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = inputBorder}
            />
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '8px',
              color: labelColor
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: '6px',
                color: textColor,
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = isDark ? '#fbbf24' : '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = inputBorder}
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: buttonBg,
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              marginTop: '8px'
            }}
            onMouseOver={(e) => !loading && (e.target.style.opacity = '0.9')}
            onMouseOut={(e) => !loading && (e.target.style.opacity = '1')}
          >
            {loading ? '⏳ Signing In...' : '✓ Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: labelColor,
          fontSize: '14px',
          margin: '24px 0 0 0'
        }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: buttonBg,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
