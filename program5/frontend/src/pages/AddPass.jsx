// src/pages/AddPass.jsx
// Form page to create a new bus pass
// Roll No: 14 | Program 5 — Full Stack Development

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance         from '../api/axios';

// Initial blank state for the form
const INITIAL_FORM_STATE = {
  studentName: '',
  rollNo:      '',
  route:       '',
  busNo:       '',
  passType:    'Monthly',
  contactNo:   '',
  isActive:    true,
};

const AddPass = () => {
  const [formData,     setFormData]     = useState(INITIAL_FORM_STATE);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // ── Generic field change handler ──────────────────────────────────────────
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      // Use `checked` for checkboxes, `value` for all other inputs
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ── Form submission — POST to /api/passes ─────────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Basic client-side validation for contact number
    if (!/^\d{10}$/.test(formData.contactNo)) {
      setErrorMessage('Contact number must be exactly 10 digits.');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/api/passes', formData);
      navigate('/'); // redirect to dashboard on success
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setErrorMessage(serverMessage || 'Failed to create pass. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="form-page">
      <div className="form-card">
        {/* Page heading */}
        <div className="form-page-header">
          <h2 className="form-page-title">🎫 Add New Bus Pass</h2>
          <Link to="/" className="btn btn-outline btn-sm">← Back to Dashboard</Link>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Add Pass form */}
        <form onSubmit={handleSubmit} className="pass-form" noValidate>
          <div className="form-grid">
            {/* Student Name */}
            <div className="form-group">
              <label htmlFor="studentName" className="form-label">Student Name *</label>
              <input
                id="studentName"
                name="studentName"
                type="text"
                className="form-input"
                placeholder="e.g. Ravi Kumar"
                value={formData.studentName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Roll Number */}
            <div className="form-group">
              <label htmlFor="rollNo" className="form-label">Roll Number *</label>
              <input
                id="rollNo"
                name="rollNo"
                type="text"
                className="form-input"
                placeholder="e.g. CS2024001"
                value={formData.rollNo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Route */}
            <div className="form-group">
              <label htmlFor="route" className="form-label">Route *</label>
              <input
                id="route"
                name="route"
                type="text"
                className="form-input"
                placeholder="e.g. Route 7 – City Centre"
                value={formData.route}
                onChange={handleChange}
                required
              />
            </div>

            {/* Bus Number */}
            <div className="form-group">
              <label htmlFor="busNo" className="form-label">Bus Number *</label>
              <input
                id="busNo"
                name="busNo"
                type="text"
                className="form-input"
                placeholder="e.g. MH-01-AB-1234"
                value={formData.busNo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Pass Type */}
            <div className="form-group">
              <label htmlFor="passType" className="form-label">Pass Type *</label>
              <select
                id="passType"
                name="passType"
                className="form-input form-select"
                value={formData.passType}
                onChange={handleChange}
                required
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label htmlFor="contactNo" className="form-label">Contact Number * (10 digits)</label>
              <input
                id="contactNo"
                name="contactNo"
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={formData.contactNo}
                onChange={handleChange}
                pattern="\d{10}"
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Active status toggle */}
          <div className="form-group form-group-inline">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              className="form-checkbox"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive" className="form-label form-label-inline">
              Pass is Active
            </label>
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating…' : '✅ Create Pass'}
            </button>
            <Link to="/" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPass;
