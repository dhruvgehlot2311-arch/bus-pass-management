// routes/auth.js
// Authentication routes: register and login
// Roll No: 14 | Program 5 — Full Stack Development

const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Helper: generate a signed JWT for a given user ID
// ─────────────────────────────────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },          // payload stored inside the token
    process.env.JWT_SECRET,  // secret used to sign/verify
    { expiresIn: '7d' }      // token expires after 7 days
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Create a new user account.
// The password is hashed automatically by the User model's pre-save hook.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password.',
      });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create and save the new user (password hashed by pre-save hook)
    const newUser = await User.create({ username, email, password });

    // Issue a JWT for the newly created account
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id:       newUser._id,
        username: newUser.username,
        email:    newUser.email,
      },
    });
  } catch (error) {
    next(error); // forward to centralized error handler
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Authenticate an existing user and return a JWT.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Look up user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Use a generic message to avoid revealing whether the email exists
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare the submitted password against the stored hash
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Issue a fresh JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
