// src/pages/Login.jsx
// Login page — authenticates an existing user and redirects to dashboard
// Roll No: 14 | Program 5 — Full Stack Development

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  // Form field state
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading,    setIsLoading]    = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  // If the user was redirected from a protected route, send them back there
  const redirectTo = location.state?.from?.pathname || '/';

  // ── Form submission ───────────────────────────────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setErrorMessage(serverMessage || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-icon">🚌</span>
          <h1 className="auth-title">Bus Pass Management</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Switch to register */}
        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
