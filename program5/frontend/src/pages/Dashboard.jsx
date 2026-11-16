// src/pages/Dashboard.jsx
// Main dashboard — displays all bus passes belonging to the logged-in user
// Roll No: 14 | Program 5 — Full Stack Development

import React, { useEffect, useState } from 'react';
import { Link, useNavigate }           from 'react-router-dom';
import axiosInstance                   from '../api/axios';
import { useAuth }                     from '../context/AuthContext';

const Dashboard = () => {
  const [passes,       setPasses]       = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // id being confirmed for deletion

  const { currentUser, logout } = useAuth();
  const navigate                = useNavigate();

  // ── Fetch passes on component mount ──────────────────────────────────────
  useEffect(() => {
    const fetchPasses = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/api/passes');
        setPasses(response.data.data);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to load passes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPasses();
  }, []); // empty dependency array → run once on mount

  // ── Delete a pass ─────────────────────────────────────────────────────────
  const handleDelete = async (passId) => {
    try {
      await axiosInstance.delete(`/api/passes/${passId}`);
      // Remove the deleted pass from local state without refetching
      setPasses((currentPasses) => currentPasses.filter((p) => p._id !== passId));
      setDeleteConfirmId(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete pass.');
    }
  };

  // ── Logout handler ────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-page">
      {/* ── Top navigation bar ─────────────────────────────────────────── */}
      <header className="navbar">
        <div className="navbar-brand">
          <span className="navbar-icon">🚌</span>
          <span className="navbar-title">Bus Pass Management</span>
        </div>
        <div className="navbar-actions">
          <span className="navbar-user">👤 {currentUser?.username}</span>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            Logout
          </button>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">My Bus Passes</h2>
            <p className="dashboard-subtitle">
              {passes.length} pass{passes.length !== 1 ? 'es' : ''} found
            </p>
          </div>
          <Link to="/add" className="btn btn-primary">
            + Add New Pass
          </Link>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner" aria-label="Loading…" />
            <p>Loading passes…</p>
          </div>
        ) : passes.length === 0 ? (
          /* Empty state */
          <div className="empty-state">
            <span className="empty-icon">🎫</span>
            <h3>No bus passes yet</h3>
            <p>Click "Add New Pass" to create your first bus pass.</p>
          </div>
        ) : (
          /* Passes table */
          <div className="table-container">
            <table className="passes-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Route</th>
                  <th>Bus No</th>
                  <th>Pass Type</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((pass, index) => (
                  <tr key={pass._id}>
                    <td>{index + 1}</td>
                    <td className="td-name">{pass.studentName}</td>
                    <td>{pass.rollNo}</td>
                    <td>{pass.route}</td>
                    <td>{pass.busNo}</td>
                    <td>
                      <span className={`badge badge-${pass.passType.toLowerCase()}`}>
                        {pass.passType}
                      </span>
                    </td>
                    <td>{pass.contactNo}</td>
                    <td>
                      <span className={`badge ${pass.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {pass.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td-actions">
                      {/* Edit button — navigates to /edit/:id */}
                      <Link
                        to={`/edit/${pass._id}`}
                        className="btn btn-warning btn-sm"
                        title="Edit pass"
                      >
                        ✏️ Edit
                      </Link>

                      {/* Delete button with inline confirmation */}
                      {deleteConfirmId === pass._id ? (
                        <span className="confirm-delete">
                          <span className="confirm-text">Sure?</span>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(pass._id)}
                          >
                            Yes
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            No
                          </button>
                        </span>
                      ) : (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteConfirmId(pass._id)}
                          title="Delete pass"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Bus Pass Management System &mdash; Roll No: 14 &mdash; Full Stack Development</p>
      </footer>
    </div>
  );
};

export default Dashboard;
