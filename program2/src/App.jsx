// src/App.jsx
// Root component — sets up React Router routes and the navigation bar

import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import PassList from './components/PassList.jsx';
import PassForm from './components/PassForm.jsx';
import './App.css';

// ── Helper: render PassForm in "add" mode ─────────────────────────────────────
function AddPassPage() {
  return <PassForm mode="add" />;
}

// ── Helper: render PassForm in "edit" mode (reads :id from URL params) ────────
function EditPassPage() {
  return <PassForm mode="edit" />;
}

// ── App component ─────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="app-wrapper">

      {/* ── Navigation Bar ──────────────────────────────────────────────── */}
      <header className="navbar">
        <div className="navbar-brand">
          {/* Bus icon + title */}
          <span className="navbar-icon" aria-hidden="true">🚌</span>
          <span className="navbar-title">Bus Pass Management</span>
        </div>

        <nav className="navbar-links" aria-label="Main navigation">
          {/* NavLink automatically adds the "active" class when the route matches */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            All Passes
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            + New Pass
          </NavLink>
        </nav>
      </header>

      {/* ── Page subtitle / meta info ───────────────────────────────────── */}
      <div className="page-meta">
        <span>Roll No: 14 &nbsp;|&nbsp; Full Stack Development: Web Dev</span>
      </div>

      {/* ── Main content area with route definitions ────────────────────── */}
      <main className="main-content">
        <Routes>
          {/* Home — list all passes */}
          <Route path="/" element={<PassList />} />

          {/* Add a new pass */}
          <Route path="/add" element={<AddPassPage />} />

          {/* Edit an existing pass identified by :id */}
          <Route path="/edit/:id" element={<EditPassPage />} />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="not-found">
                <h2>404 — Page Not Found</h2>
                <NavLink to="/" className="btn btn-primary">Go Home</NavLink>
              </div>
            }
          />
        </Routes>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="footer">
        <span>Bus Pass Management System &copy; 2026 &mdash; Program 2 of 5</span>
      </footer>

    </div>
  );
}

export default App;
