// src/components/ProtectedRoute.jsx
// Higher-order component that guards private pages behind authentication.
// Roll No: 14 | Program 5 — Full Stack Development

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * ──────────────
 * Wraps a component (passed as `children`) and checks whether the user
 * is authenticated.
 *
 * - Authenticated  → renders the children as normal.
 * - Not authenticated → redirects to /login, preserving the page the
 *   user tried to visit in location state so we can send them back
 *   after a successful login.
 *
 * Usage in App.jsx:
 *   <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location            = useLocation(); // current route

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace               // replaces history entry so Back button works naturally
        state={{ from: location }} // remember where the user was trying to go
      />
    );
  }

  return children;
};

export default ProtectedRoute;
