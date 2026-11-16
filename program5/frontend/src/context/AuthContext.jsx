// src/context/AuthContext.jsx
// Global authentication context — provides login, register, logout, and
// isAuthenticated to every component in the tree.
// Roll No: 14 | Program 5 — Full Stack Development

import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';

// ─────────────────────────────────────────────────────────────────────────────
// Context creation
// ─────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// AuthProvider
// Wraps the app and exposes authentication state + actions.
// ─────────────────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  // Initialise token from localStorage so the user stays logged in on refresh
  const [token, setToken] = useState(() => localStorage.getItem('busPassToken') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('busPassUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ── Computed property ────────────────────────────────────────────────────
  // isAuthenticated is true whenever a valid token exists in state
  const isAuthenticated = Boolean(token);

  // ── login ────────────────────────────────────────────────────────────────
  /**
   * Sends credentials to the backend, stores the returned JWT, and
   * updates authentication state.
   *
   * @param {string} email
   * @param {string} password
   * @returns {object} user data returned by the server
   */
  const login = useCallback(async (email, password) => {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    const { token: receivedToken, user } = response.data;

    // Persist to localStorage so the token survives page refreshes
    localStorage.setItem('busPassToken', receivedToken);
    localStorage.setItem('busPassUser',  JSON.stringify(user));

    setToken(receivedToken);
    setCurrentUser(user);

    return user;
  }, []);

  // ── register ─────────────────────────────────────────────────────────────
  /**
   * Creates a new user account and logs them in immediately.
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {object} user data returned by the server
   */
  const register = useCallback(async (username, email, password) => {
    const response = await axiosInstance.post('/api/auth/register', {
      username,
      email,
      password,
    });
    const { token: receivedToken, user } = response.data;

    localStorage.setItem('busPassToken', receivedToken);
    localStorage.setItem('busPassUser',  JSON.stringify(user));

    setToken(receivedToken);
    setCurrentUser(user);

    return user;
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────
  /**
   * Clears the JWT and user info from both state and localStorage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('busPassToken');
    localStorage.removeItem('busPassUser');
    setToken(null);
    setCurrentUser(null);
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────
  const contextValue = {
    token,
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Custom hook for consuming the auth context
// Usage: const { login, isAuthenticated } = useAuth();
// ─────────────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
};

export default AuthContext;
