// src/components/PassCard.jsx
// Displays a single bus pass in a card layout.
// Props:
//   pass     — the pass object (all fields)
//   onEdit   — callback when the Edit button is clicked
//   onDelete — callback when the Delete button is clicked

import React from 'react';

function PassCard({ pass, onEdit, onDelete }) {
  // Destructure all expected pass fields (with safe fallbacks)
  const {
    studentName = '—',
    rollNo      = '—',
    route       = '—',
    busNo       = '—',
    passType    = '—',
    contactNo   = '—',
    id,
  } = pass;

  // Map pass type to a badge colour class
  const typeColourMap = {
    Monthly     : 'badge-blue',
    Quarterly   : 'badge-green',
    'Half-Yearly': 'badge-orange',
    Annual      : 'badge-purple',
  };
  const badgeClass = typeColourMap[passType] || 'badge-blue';

  return (
    <article className="pass-card" aria-label={`Bus pass for ${studentName}`}>

      {/* ── Card header ───────────────────────────────────────────────── */}
      <div className="card-header">
        <div className="card-avatar" aria-hidden="true">
          {/* Show the first letter of the student's name as an avatar */}
          {studentName.charAt(0).toUpperCase()}
        </div>
        <div className="card-header-info">
          <h3 className="card-name">{studentName}</h3>
          <span className="card-roll">Roll No: {rollNo}</span>
        </div>
        {/* Pass-type badge in the top-right corner */}
        <span className={`badge ${badgeClass}`}>{passType}</span>
      </div>

      {/* ── Card body — pass details ───────────────────────────────────── */}
      <div className="card-body">
        <div className="card-row">
          <span className="card-label">🛣️ Route</span>
          <span className="card-value">{route}</span>
        </div>
        <div className="card-row">
          <span className="card-label">🚌 Bus No</span>
          <span className="card-value">{busNo}</span>
        </div>
        <div className="card-row">
          <span className="card-label">📞 Contact</span>
          <span className="card-value">{contactNo}</span>
        </div>
        <div className="card-row">
          <span className="card-label">🆔 Pass ID</span>
          <span className="card-value card-id">#{id}</span>
        </div>
      </div>

      {/* ── Card footer — action buttons ───────────────────────────────── */}
      <div className="card-footer">
        <button
          className="btn btn-edit"
          onClick={onEdit}
          aria-label={`Edit pass for ${studentName}`}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-delete"
          onClick={onDelete}
          aria-label={`Delete pass for ${studentName}`}
        >
          🗑️ Delete
        </button>
      </div>

    </article>
  );
}

export default PassCard;
