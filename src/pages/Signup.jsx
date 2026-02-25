import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const { isDark } = useTheme();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      setSuccess('✓ Account created! Signing you in...');
      
      setTimeout(() => {
        login({
          id: data.userId,
          email: data.email,
          name: data.name,
          token: data.token
        });
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);
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
  const successBg = isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)';
  const successBorder = isDark ? '#10b981' : '#10b981';
  const successText = isDark ? '#86efac' : '#059669';

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bgColor,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        backgroundColor: cardBg,
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: `1px solid ${inputBorder}`,
        margin: '20px'
      }}>
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
            <span style={{ fontSize: '32px' }}>➕</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: textColor,
            margin: '0 0 8px 0'
          }}>Create Account</h1>
          <p style={{
            color: labelColor,
            margin: '0',
            fontSize: '14px'
          }}>Start your checklist journey today</p>
        </div>

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

        {success && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: successBg,
            border: `1px solid ${successBorder}`,
            borderRadius: '6px',
            color: successText,
            fontSize: '13px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '8px',
              color: labelColor
            }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: '6px',
                color: textColor,
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

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
                boxSizing: 'border-box'
              }}
            />
          </div>

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
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '8px',
              color: labelColor
            }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                boxSizing: 'border-box'
              }}
            />
          </div>

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
              marginTop: '8px'
            }}
          >
            {loading ? '⏳ Creating Account...' : '✓ Sign Up'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: labelColor,
          fontSize: '14px'
        }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
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
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
