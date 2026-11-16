// routes/passes.js
// CRUD routes for Bus Pass management — all routes are protected by JWT auth
// Roll No: 14 | Program 5 — Full Stack Development

const express      = require('express');
const Pass         = require('../models/Pass');
const { protect }  = require('../middleware/auth');

const router = express.Router();

// Apply the auth middleware to every route in this file
router.use(protect);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/passes
// Fetch all bus passes that belong to the currently authenticated user.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    // Filter passes by the owner field so users only see their own records
    const passes = await Pass.find({ owner: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   passes.length,
      data:    passes,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/passes/:id
// Fetch a single bus pass by its MongoDB ObjectId.
// Ensures the pass belongs to the requesting user.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const pass = await Pass.findOne({
      _id:   req.params.id,
      owner: req.user.id,   // ownership check
    });

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Bus pass not found or you do not have permission to view it.',
      });
    }

    res.status(200).json({
      success: true,
      data:    pass,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/passes
// Create a new bus pass and associate it with the authenticated user.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { studentName, rollNo, route, busNo, passType, contactNo, isActive } = req.body;

    // Create the pass with owner set to the current user's ID
    const newPass = await Pass.create({
      studentName,
      rollNo,
      route,
      busNo,
      passType,
      contactNo,
      isActive,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Bus pass created successfully.',
      data:    newPass,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/passes/:id
// Update an existing bus pass.
// Only the owner may update their pass.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    // { new: true } returns the updated document instead of the old one
    const updatedPass = await Pass.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },  // filter: id + ownership
      req.body,                                      // fields to update
      { new: true, runValidators: true }             // options
    );

    if (!updatedPass) {
      return res.status(404).json({
        success: false,
        message: 'Bus pass not found or you do not have permission to update it.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus pass updated successfully.',
      data:    updatedPass,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/passes/:id
// Permanently remove a bus pass record.
// Only the owner may delete their pass.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedPass = await Pass.findOneAndDelete({
      _id:   req.params.id,
      owner: req.user.id,  // ownership check
    });

    if (!deletedPass) {
      return res.status(404).json({
        success: false,
        message: 'Bus pass not found or you do not have permission to delete it.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus pass deleted successfully.',
      data:    {},
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
