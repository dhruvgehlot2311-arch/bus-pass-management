// src/components/PassList.jsx
// Displays all bus passes fetched from PassContext.
// Handles three render states: loading, empty list, and populated list.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePassContext } from '../context/PassContext.jsx';
import PassCard from './PassCard.jsx';

function PassList() {
  const { passes, deletePass } = usePassContext();
  const navigate = useNavigate();

  // ── Local UI states ──────────────────────────────────────────────────────
  // Simulate a brief loading phase so the loading state is demonstrable
  const [isLoading, setIsLoading] = useState(true);

  // ── Simulate async data load on mount ───────────────────────────────────
  useEffect(() => {
    // In a real app this would be a fetch call; here we just delay briefly
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);   // cleanup on unmount
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  /**
   * handleDelete — asks for confirmation then removes the pass
   * @param {string} id — id of the pass to delete
   * @param {string} name — student name shown in the confirmation dialog
   */
  function handleDelete(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the pass for "${name}"?`
    );
    if (confirmed) {
      deletePass(id);
    }
  }

  /**
   * handleEdit — navigates to the edit route for the given pass id
   * @param {string} id — id of the pass to edit
   */
  function handleEdit(id) {
    navigate(`/edit/${id}`);
  }

  // ── Render: Loading ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="state-container">
        <div className="spinner" aria-label="Loading passes…"></div>
        <p className="state-text">Loading bus passes…</p>
      </div>
    );
  }

  // ── Render: Empty state ───────────────────────────────────────────────────
  if (passes.length === 0) {
    return (
      <div className="state-container">
        <div className="empty-icon" aria-hidden="true">🎫</div>
        <h3 className="state-text">No bus passes found.</h3>
        <p className="state-subtext">Click <strong>+ New Pass</strong> in the navbar to issue the first pass.</p>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          + Add First Pass
        </button>
      </div>
    );
  }

  // ── Render: Pass list ─────────────────────────────────────────────────────
  return (
    <div className="list-container">
      <div className="list-header">
        <h2 className="list-title">🎫 All Bus Passes</h2>
        <span className="pass-count">{passes.length} pass{passes.length !== 1 ? 'es' : ''}</span>
      </div>

      <div className="cards-grid">
        {passes.map((pass) => (
          <PassCard
            key={pass.id}
            pass={pass}
            onEdit={() => handleEdit(pass.id)}
            onDelete={() => handleDelete(pass.id, pass.studentName)}
          />
        ))}
      </div>
    </div>
  );
}

export default PassList;
