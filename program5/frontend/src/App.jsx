// src/App.jsx
// Root application component — defines all client-side routes
// Roll No: 14 | Program 5 — Full Stack Development

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import AddPass        from './pages/AddPass';

/**
 * App
 * ───
 * Route map:
 *
 *   /login     → Login page (public)
 *   /register  → Register page (public)
 *   /          → Dashboard (protected — redirects to /login if not authed)
 *   /add       → Add Pass form (protected)
 *   *          → Redirect unknown paths to / (which then guards itself)
 */
const App = () => {
  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────────────── */}
      <Route path="/login"    element={<Login />}    />
      <Route path="/register" element={<Register />} />

      {/* ── Protected routes ──────────────────────────────────────────── */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddPass />
          </ProtectedRoute>
        }
      />

      {/* ── Catch-all: redirect to dashboard (ProtectedRoute handles auth) ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
