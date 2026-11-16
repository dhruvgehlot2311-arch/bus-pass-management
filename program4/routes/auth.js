// ============================================================
// routes/auth.js
// Authentication routes: Register & Login
// Roll No: 14 | Program 4 — Bus Pass Management API
// ============================================================

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');

const { validateUser } = require('../middleware/validate');

const router   = express.Router();

// Path to the users data file
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// ----------------------------------------------------------------
// Helper: read users array from disk
// ----------------------------------------------------------------
const readUsers = () => {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

// ----------------------------------------------------------------
// Helper: write updated users array back to disk
// ----------------------------------------------------------------
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

// ----------------------------------------------------------------
// POST /api/auth/register
// Body: { username, password }
// - Validates input (via validateUser middleware)
// - Checks for duplicate usernames
// - Hashes the password with bcryptjs (salt rounds = 10)
// - Saves the new user to users.json
// - Returns HTTP 201 with a success message
// ----------------------------------------------------------------
router.post('/register', validateUser, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Load existing users
    const users = readUsers();

    // Check if username already exists (case-insensitive)
    const exists = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      return res.status(409).json({
        success : false,
        message : `Username '${username}' is already taken. Please choose another.`
      });
    }

    // Hash the password — salt rounds = 10 (good balance of security & speed)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build the new user record (do NOT store plain-text password)
    const newUser = {
      id        : require('uuid').v4(),
      username  : username.trim(),
      password  : hashedPassword,
      createdAt : new Date().toISOString()
    };

    // Persist to disk
    users.push(newUser);
    writeUsers(users);

    // Return 201 Created — never return the password hash
    return res.status(201).json({
      success : true,
      message : 'User registered successfully.',
      user    : { id: newUser.id, username: newUser.username, createdAt: newUser.createdAt }
    });
  } catch (err) {
    next(err); // Forward to centralized error handler
  }
});

// ----------------------------------------------------------------
// POST /api/auth/login
// Body: { username, password }
// - Validates input (via validateUser middleware)
// - Looks up the user by username
// - Compares the submitted password against the stored bcrypt hash
// - On success, signs and returns a JWT (expires in 1 hour)
// ----------------------------------------------------------------
router.post('/login', validateUser, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Load existing users
    const users = readUsers();

    // Find user by username (case-insensitive)
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      // Generic message — avoids revealing which field is wrong (security best practice)
      return res.status(401).json({
        success : false,
        message : 'Invalid credentials. Please check your username and password.'
      });
    }

    // Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success : false,
        message : 'Invalid credentials. Please check your username and password.'
      });
    }

    // Sign a JWT containing non-sensitive user info
    const payload = { id: user.id, username: user.username };
    const secret  = process.env.JWT_SECRET || 'your_super_secret_key_here';
    const token   = jwt.sign(payload, secret, { expiresIn: '1h' });

    return res.status(200).json({
      success  : true,
      message  : 'Login successful.',
      token,                          // Client should store this and send as Bearer token
      expiresIn: '1h',
      user     : { id: user.id, username: user.username }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
