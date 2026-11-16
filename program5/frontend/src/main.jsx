// src/main.jsx
// Application entry point — mounts React into the DOM
// Roll No: 14 | Program 5 — Full Stack Development

import React            from 'react';
import ReactDOM         from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App                      from './App';
import { AuthProvider }         from './context/AuthContext';

import './App.css'; // global styles

/**
 * Render the root React application.
 *
 * Hierarchy:
 *   BrowserRouter   — provides the client-side routing context
 *     AuthProvider  — provides authentication state/actions to all components
 *       App         — defines the route structure
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
