// models/Pass.js
// Mongoose schema for a Bus Pass document
// Roll No: 14 | Program 5 — Full Stack Development

const mongoose = require('mongoose');

/**
 * PassSchema defines the structure for each bus pass record.
 * Each pass is linked to an authenticated user via the `owner` field.
 */
const PassSchema = new mongoose.Schema(
  {
    // Full name of the student holding the pass
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },

    // Unique roll number of the student
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
    },

    // Bus route the student travels on (e.g., "Route 7 – City Centre")
    route: {
      type: String,
      required: [true, 'Route is required'],
    },

    // Bus number assigned to this pass (e.g., "MH-01-AB-1234")
    busNo: {
      type: String,
      required: [true, 'Bus number is required'],
    },

    // Validity period of the pass
    passType: {
      type: String,
      enum: {
        values: ['Monthly', 'Quarterly', 'Annual'],
        message: 'Pass type must be Monthly, Quarterly, or Annual',
      },
      required: [true, 'Pass type is required'],
    },

    // 10-digit mobile number of the student
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
      match: [/^\d{10}$/, 'Contact number must be exactly 10 digits'],
    },

    // Whether the pass is currently valid/active
    isActive: {
      type: Boolean,
      default: true,
    },

    // Timestamp when the pass was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Reference to the User who created/owns this pass
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // Automatically manage `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model('Pass', PassSchema);
