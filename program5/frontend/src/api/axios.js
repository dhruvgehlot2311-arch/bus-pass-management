// src/api/axios.js
// Pre-configured Axios instance for all API calls
// Roll No: 14 | Program 5 — Full Stack Development

import axios from 'axios';

/**
 * Create a custom Axios instance with the backend base URL.
 *
 * VITE_API_URL is set in .env (or .env.example) and injected by Vite
 * at build time. Falls back to localhost:5000 if the variable is missing.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // abort requests that take more than 15 seconds
});

// ─────────────────────────────────────────────────────────────────────────────
// Request Interceptor
// Runs before every outgoing request and attaches the JWT Bearer token
// (if one is stored in localStorage) to the Authorization header.
// ─────────────────────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('busPassToken');

    if (token) {
      // Attach the token so the Express auth middleware can verify it
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config; // must return the modified config
  },
  (requestError) => {
    // Let the caller handle request setup errors
    return Promise.reject(requestError);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Response Interceptor
// Globally handle 401 Unauthorized responses (expired / invalid token).
// ─────────────────────────────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response, // pass successful responses through unchanged

  (responseError) => {
    if (responseError.response?.status === 401) {
      // Token is expired or invalid — clear storage and redirect to login
      localStorage.removeItem('busPassToken');
      localStorage.removeItem('busPassUser');

      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(responseError);
  }
);

export default axiosInstance;
