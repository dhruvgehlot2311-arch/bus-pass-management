// ============================================================
// middleware/validate.js
// Request body validation middleware for passes and users
// Roll No: 14 | Program 4 — Bus Pass Management API
// ============================================================

// Allowed values for the passType field
const VALID_PASS_TYPES = ['monthly', 'quarterly', 'yearly'];

/**
 * validatePass
 * Ensures the request body for creating/updating a bus pass is correct.
 *
 * Required fields : studentName, rollNo, route, busNo, passType, contactNo
 * Rules           :
 *   - contactNo must be exactly 10 digits
 *   - passType   must be one of: monthly | quarterly | yearly
 */
const validatePass = (req, res, next) => {
  const { studentName, rollNo, route, busNo, passType, contactNo } = req.body;

  // --- 1. Check all required fields are present and non-empty ---
  const requiredFields = { studentName, rollNo, route, busNo, passType, contactNo };
  const missingFields  = Object.keys(requiredFields).filter(
    (key) => !requiredFields[key] || String(requiredFields[key]).trim() === ''
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required field(s): ${missingFields.join(', ')}`
    });
  }

  // --- 2. Validate contactNo — must be exactly 10 numeric digits ---
  const contactStr = String(contactNo).trim();
  if (!/^\d{10}$/.test(contactStr)) {
    return res.status(400).json({
      success: false,
      message: 'contactNo must be exactly 10 digits (numbers only).'
    });
  }

  // --- 3. Validate passType enum ---
  if (!VALID_PASS_TYPES.includes(passType)) {
    return res.status(400).json({
      success: false,
      message: `passType must be one of: ${VALID_PASS_TYPES.join(', ')}.`
    });
  }

  // All validations passed — continue to the route handler
  next();
};

/**
 * validateUser
 * Ensures the request body for registration/login contains the required fields.
 *
 * Required fields : username, password
 * Rules           :
 *   - password must be at least 6 characters long
 */
const validateUser = (req, res, next) => {
  const { username, password } = req.body;

  // --- 1. Both fields must be present ---
  if (!username || String(username).trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'username is required.'
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'password is required.'
    });
  }

  // --- 2. Password minimum length check ---
  if (String(password).length < 6) {
    return res.status(400).json({
      success: false,
      message: 'password must be at least 6 characters long.'
    });
  }

  // All validations passed — continue to the route handler
  next();
};

module.exports = { validatePass, validateUser };
