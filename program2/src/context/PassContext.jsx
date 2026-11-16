// src/context/PassContext.jsx
// Global context for bus pass data — provides CRUD operations and localStorage persistence

import React, { createContext, useContext, useState, useEffect } from 'react';

// ── Context creation ──────────────────────────────────────────────────────────
const PassContext = createContext(null);

// Key used to persist passes in localStorage
const STORAGE_KEY = 'busPassManagement_passes';

// ── Provider component ────────────────────────────────────────────────────────
/**
 * PassProvider wraps the application and supplies:
 *   passes      — array of all saved bus pass objects
 *   addPass     — function to add a new pass
 *   updatePass  — function to update an existing pass by id
 *   deletePass  — function to remove a pass by id
 */
export function PassProvider({ children }) {
  // Initialise passes from localStorage (if available) or use an empty array
  const [passes, setPasses] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      // If parsing fails (corrupted data) start fresh
      return [];
    }
  });

  // ── Persistence effect ──────────────────────────────────────────────────────
  // Runs every time `passes` changes — keeps localStorage in sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
  }, [passes]);

  // ── CRUD helpers ────────────────────────────────────────────────────────────

  /**
   * addPass — Appends a new pass with a unique timestamp-based id
   * @param {object} passData  — form data (without id)
   */
  function addPass(passData) {
    const newPass = {
      ...passData,
      id: Date.now().toString(), // Simple unique id using current timestamp
    };
    setPasses((prev) => [...prev, newPass]);
  }

  /**
   * updatePass — Replaces the pass matching `id` with updated data
   * @param {string} id        — id of the pass to update
   * @param {object} passData  — updated field values
   */
  function updatePass(id, passData) {
    setPasses((prev) =>
      prev.map((pass) => (pass.id === id ? { ...pass, ...passData, id } : pass))
    );
  }

  /**
   * deletePass — Removes the pass with the given id
   * @param {string} id — id of the pass to delete
   */
  function deletePass(id) {
    setPasses((prev) => prev.filter((pass) => pass.id !== id));
  }

  // ── Context value ───────────────────────────────────────────────────────────
  const contextValue = {
    passes,
    addPass,
    updatePass,
    deletePass,
  };

  return (
    <PassContext.Provider value={contextValue}>
      {children}
    </PassContext.Provider>
  );
}

// ── Custom hook ───────────────────────────────────────────────────────────────
/**
 * usePassContext — convenience hook; throws if used outside PassProvider
 */
export function usePassContext() {
  const context = useContext(PassContext);
  if (!context) {
    throw new Error('usePassContext must be used within a PassProvider');
  }
  return context;
}

export default PassContext;
