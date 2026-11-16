// src/pages/Register.jsx
// Registration page — creates a new user account
// Roll No: 14 | Program 5 — Full Stack Development

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  // Form field state
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [errorMessage,   setErrorMessage]   = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading,      setIsLoading]      = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  // ── Form submission ───────────────────────────────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Client-side validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      setSuccessMessage('Account created! Redirecting…');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setErrorMessage(serverMessage || 'Registration failed. Please try again.');
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
          <p className="auth-subtitle">Create a new account</p>
        </div>

        {/* Alerts */}
        {errorMessage   && <div className="alert alert-error"   role="alert">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success" role="status">{successMessage}</div>}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              className="form-input"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Switch to login */}
        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
