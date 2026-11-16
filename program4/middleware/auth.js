// ============================================================
// middleware/auth.js
// JWT Bearer-token verification middleware
// Roll No: 14 | Program 4 — Bus Pass Management API
// ============================================================

const jwt = require('jsonwebtoken');

/**
 * verifyToken
 * Protects any route it is applied to by checking for a valid JWT.
 *
 * Expected request header:
 *   Authorization: Bearer <token>
 *
 * On success  : decodes the payload and attaches it to req.user, then calls next().
 * On failure  : responds immediately with HTTP 401 (Unauthorized).
 */
const verifyToken = (req, res, next) => {
  // --- 1. Extract the Authorization header ---
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success : false,
      message : 'Access denied. No Authorization header provided.'
    });
  }

  // --- 2. The header must follow the "Bearer <token>" format ---
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success : false,
      message : 'Invalid Authorization header format. Expected: Bearer <token>'
    });
  }

  const token = parts[1];

  // --- 3. Verify the token against the secret ---
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here');

    // Attach decoded payload (id, username, iat, exp) to the request object
    req.user = decoded;

    // Token is valid — pass control to the next handler
    next();
  } catch (err) {
    // jwt.verify throws specific errors we can distinguish:
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success : false,
        message : 'Token has expired. Please log in again.'
      });
    }

    // JsonWebTokenError, NotBeforeError, or any other JWT issue
    return res.status(401).json({
      success : false,
      message : 'Invalid token. Authentication failed.'
    });
  }
};

module.exports = { verifyToken };
