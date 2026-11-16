// ============================================================
// middleware/errorHandler.js
// Centralized Express error-handling middleware (4-argument form)
// Roll No: 14 | Program 4 — Bus Pass Management API
// ============================================================

/**
 * errorHandler
 * Must be registered LAST in the middleware chain (after all routes).
 *
 * Catches any error forwarded via next(err) and returns a structured
 * JSON response so the client always receives a consistent error shape.
 *
 * Response body:
 * {
 *   "success" : false,
 *   "status"  : <HTTP status code>,
 *   "message" : "<human-readable error message>",
 *   "stack"   : "<stack trace>"   // only included in NODE_ENV === 'development'
 * }
 */
const errorHandler = (err, req, res, next) => {   // eslint-disable-line no-unused-vars
  // Default to HTTP 500 if the error object doesn't carry a status
  const statusCode = err.status || err.statusCode || 500;

  // Build the base response payload
  const responseBody = {
    success : false,
    status  : statusCode,
    message : err.message || 'Internal Server Error'
  };

  // Include the stack trace only in development mode (never expose in production)
  if (process.env.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
  }

  // Log the error server-side for debugging
  console.error(`[ERROR] ${statusCode} — ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;
