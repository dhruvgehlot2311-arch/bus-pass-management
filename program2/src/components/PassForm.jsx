// src/components/PassForm.jsx
// Reusable controlled form for adding and editing bus passes.
// Props:
//   mode — "add" (default) | "edit"

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePassContext } from '../context/PassContext.jsx';

// ── Blank / default field values ───────────────────────────────────────────────
const EMPTY_FORM = {
  studentName : '',
  rollNo      : '',
  route       : '',
  busNo       : '',
  passType    : 'Monthly',   // sensible default
  contactNo   : '',
};

// ── PassForm component ─────────────────────────────────────────────────────────
function PassForm({ mode = 'add' }) {
  const navigate                        = useNavigate();
  const { id }                          = useParams();           // present only in edit mode
  const { passes, addPass, updatePass } = usePassContext();

  // ── Controlled field states ────────────────────────────────────────────────
  const [studentName, setStudentName] = useState('');
  const [rollNo,      setRollNo]      = useState('');
  const [route,       setRoute]       = useState('');
  const [busNo,       setBusNo]       = useState('');
  const [passType,    setPassType]    = useState('Monthly');
  const [contactNo,   setContactNo]   = useState('');

  // ── UI feedback states ─────────────────────────────────────────────────────
  const [errors,         setErrors]         = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage,   setErrorMessage]   = useState('');

  // ── Load existing pass data in edit mode ───────────────────────────────────
  useEffect(() => {
    if (mode === 'edit' && id) {
      const existingPass = passes.find((p) => p.id === id);
      if (existingPass) {
        setStudentName(existingPass.studentName || '');
        setRollNo     (existingPass.rollNo      || '');
        setRoute      (existingPass.route       || '');
        setBusNo      (existingPass.busNo       || '');
        setPassType   (existingPass.passType    || 'Monthly');
        setContactNo  (existingPass.contactNo   || '');
      } else {
        // Pass not found — redirect home
        navigate('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  // ── Validation ─────────────────────────────────────────────────────────────
  /**
   * validate — checks all fields and returns an errors object.
   * Returns an empty object when the form is valid.
   */
  function validate() {
    const newErrors = {};

    if (!studentName.trim())
      newErrors.studentName = 'Student name is required.';

    if (!rollNo.trim())
      newErrors.rollNo = 'Roll number is required.';

    if (!route.trim())
      newErrors.route = 'Route is required.';

    if (!busNo.trim())
      newErrors.busNo = 'Bus number is required.';

    if (!passType)
      newErrors.passType = 'Pass type is required.';

    if (!contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required.';
    } else if (!/^\d{10}$/.test(contactNo.trim())) {
      newErrors.contactNo = 'Contact number must be exactly 10 digits.';
    }

    return newErrors;
  }

  // ── Form submit handler ────────────────────────────────────────────────────
  function handleSubmit(event) {
    event.preventDefault();

    // Clear previous feedback
    setSuccessMessage('');
    setErrorMessage('');

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setErrorMessage('Please fix the errors below and try again.');
      return;
    }

    // Build the data object from individual field states
    const formData = {
      studentName : studentName.trim(),
      rollNo      : rollNo.trim(),
      route       : route.trim(),
      busNo       : busNo.trim(),
      passType,
      contactNo   : contactNo.trim(),
    };

    try {
      if (mode === 'edit') {
        updatePass(id, formData);
        setSuccessMessage('Bus pass updated successfully!');
      } else {
        addPass(formData);
        setSuccessMessage('Bus pass added successfully!');
        // Reset form to empty after successful add
        setStudentName('');
        setRollNo('');
        setRoute('');
        setBusNo('');
        setPassType('Monthly');
        setContactNo('');
      }
      setErrors({});

      // Redirect to list after a short delay so the user sees the success message
      setTimeout(() => navigate('/'), 1200);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="form-container">
      <h2 className="form-title">
        {mode === 'edit' ? '✏️ Edit Bus Pass' : '➕ Add New Bus Pass'}
      </h2>

      {/* Global success / error banners */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-error" role="alert">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="pass-form">

        {/* Student Name */}
        <div className="form-group">
          <label htmlFor="studentName">Student Name <span className="required">*</span></label>
          <input
            id="studentName"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Dhruv Sharma"
            className={errors.studentName ? 'input-error' : ''}
          />
          {errors.studentName && <span className="field-error">{errors.studentName}</span>}
        </div>

        {/* Roll Number */}
        <div className="form-group">
          <label htmlFor="rollNo">Roll Number <span className="required">*</span></label>
          <input
            id="rollNo"
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="e.g. 14"
            className={errors.rollNo ? 'input-error' : ''}
          />
          {errors.rollNo && <span className="field-error">{errors.rollNo}</span>}
        </div>

        {/* Route */}
        <div className="form-group">
          <label htmlFor="route">Route <span className="required">*</span></label>
          <input
            id="route"
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="e.g. City Center – College Road"
            className={errors.route ? 'input-error' : ''}
          />
          {errors.route && <span className="field-error">{errors.route}</span>}
        </div>

        {/* Bus Number */}
        <div className="form-group">
          <label htmlFor="busNo">Bus Number <span className="required">*</span></label>
          <input
            id="busNo"
            type="text"
            value={busNo}
            onChange={(e) => setBusNo(e.target.value)}
            placeholder="e.g. MH-04-AB-1234"
            className={errors.busNo ? 'input-error' : ''}
          />
          {errors.busNo && <span className="field-error">{errors.busNo}</span>}
        </div>

        {/* Pass Type */}
        <div className="form-group">
          <label htmlFor="passType">Pass Type <span className="required">*</span></label>
          <select
            id="passType"
            value={passType}
            onChange={(e) => setPassType(e.target.value)}
            className={errors.passType ? 'input-error' : ''}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Annual">Annual</option>
          </select>
          {errors.passType && <span className="field-error">{errors.passType}</span>}
        </div>

        {/* Contact Number */}
        <div className="form-group">
          <label htmlFor="contactNo">Contact Number <span className="required">*</span></label>
          <input
            id="contactNo"
            type="tel"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            placeholder="10-digit mobile number"
            maxLength={10}
            className={errors.contactNo ? 'input-error' : ''}
          />
          {errors.contactNo && <span className="field-error">{errors.contactNo}</span>}
        </div>

        {/* Action buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {mode === 'edit' ? 'Update Pass' : 'Add Pass'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

export default PassForm;
