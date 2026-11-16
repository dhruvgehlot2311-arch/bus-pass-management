// middleware/auth.js
// JWT authentication middleware — protects private routes
// Roll No: 14 | Program 5 — Full Stack Development

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect
 * ───────
 * Verifies the Bearer token sent in the Authorization header.
 * On success, attaches the authenticated user object to `req.user`
 * and calls `next()` to continue the request chain.
 * On failure, responds with 401 Unauthorized.
 */
const protect = async (req, res, next) => {
  let token;

  // Check that the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // Extract the token string (everything after "Bearer ")
    token = req.headers.authorization.split(' ')[1];
  }

  // Reject the request if no token was found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify token signature and expiry using the application secret
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user record from the database (excluding the password field)
    const authenticatedUser = await User.findById(decodedPayload.id).select('-password');

    if (!authenticatedUser) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but the user no longer exists.',
      });
    }

    // Attach user to the request so downstream handlers can use it
    req.user = authenticatedUser;
    next();
  } catch (error) {
    // Handle specific JWT errors with descriptive messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authorization denied.',
    });
  }
};

module.exports = { protect };
