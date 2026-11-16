// middleware/errorHandler.js
// Centralized error-handling middleware for the Express application
// Roll No: 14 | Program 5 — Full Stack Development

/**
 * errorHandler
 * ────────────
 * Catches all errors forwarded via next(err) and returns a structured
 * JSON response instead of the default Express HTML error page.
 *
 * Must be registered as the LAST middleware in server.js so that it
 * intercepts errors from all preceding routes and middleware.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Start with the status code the error carries, or fall back to 500
  let statusCode = err.statusCode || res.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // ── Mongoose: CastError (bad ObjectId format) ───────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message    = `Resource not found. Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose: Duplicate key (unique index violation) ─────────────────────
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field "${duplicatedField}". Please use a different value.`;
  }

  // ── Mongoose: Validation errors ──────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Collect all validation messages into a single readable string
    message = Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join('. ');
  }

  // ── JWT errors ───────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token has expired. Please log in again.';
  }

  // Build the response payload
  const errorResponse = {
    success: false,
    message,
    // Include stack trace only in development for easier debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };
