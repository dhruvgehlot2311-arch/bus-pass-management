// models/User.js
// Mongoose schema for an authenticated User
// Roll No: 14 | Program 5 — Full Stack Development

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * UserSchema stores credentials for each registered user.
 * Passwords are automatically hashed before saving via a pre-save hook.
 */
const UserSchema = new mongoose.Schema(
  {
    // Display name chosen by the user at registration
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },

    // Email address (used as the login identifier)
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    // Hashed password — never stored in plain text
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware:
 * Hash the password with bcrypt whenever it is new or has been modified.
 * This ensures we never persist a plain-text password to the database.
 */
UserSchema.pre('save', async function hashPassword(next) {
  // Only hash if the password field was actually changed
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10; // cost factor for bcrypt
    const salt       = await bcrypt.genSalt(saltRounds);
    this.password    = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: compare a plain-text password against the stored hash.
 * Used in the login route.
 */
UserSchema.methods.comparePassword = async function comparePassword(plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
