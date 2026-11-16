// ============================================================
// routes/passes.js
// Bus Pass CRUD routes — all protected by JWT verifyToken
// Roll No: 14 | Program 4 — Bus Pass Management API
// ============================================================

const express  = require('express');
const fs       = require('fs');
const path     = require('path');
const { v4: uuidv4 } = require('uuid');

const { verifyToken }  = require('../middleware/auth');
const { validatePass } = require('../middleware/validate');

const router = express.Router();

// Path to the passes data file
const PASSES_FILE = path.join(__dirname, '..', 'data', 'passes.json');

// ----------------------------------------------------------------
// Helper: read passes array from disk
// ----------------------------------------------------------------
const readPasses = () => {
  try {
    const raw = fs.readFileSync(PASSES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

// ----------------------------------------------------------------
// Helper: write updated passes array back to disk
// ----------------------------------------------------------------
const writePasses = (passes) => {
  fs.writeFileSync(PASSES_FILE, JSON.stringify(passes, null, 2), 'utf8');
};

// Apply verifyToken to ALL routes in this router
// Any request without a valid JWT will be rejected with HTTP 401
router.use(verifyToken);

// ----------------------------------------------------------------
// GET /api/passes
// Returns the full list of bus passes
// ----------------------------------------------------------------
router.get('/', (req, res, next) => {
  try {
    const passes = readPasses();
    return res.status(200).json({
      success : true,
      count   : passes.length,
      data    : passes
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------
// GET /api/passes/:id
// Returns a single bus pass by its UUID, or 404 if not found
// ----------------------------------------------------------------
router.get('/:id', (req, res, next) => {
  try {
    const passes = readPasses();
    const pass   = passes.find((p) => p.id === req.params.id);

    if (!pass) {
      return res.status(404).json({
        success : false,
        message : `Bus pass with id '${req.params.id}' not found.`
      });
    }

    return res.status(200).json({
      success : true,
      data    : pass
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------
// POST /api/passes
// Creates a new bus pass after validation
// Body: { studentName, rollNo, route, busNo, passType, contactNo, isActive? }
// ----------------------------------------------------------------
router.post('/', validatePass, (req, res, next) => {
  try {
    const passes = readPasses();

    const { studentName, rollNo, route, busNo, passType, contactNo, isActive } = req.body;

    // Build the new pass record with a generated UUID
    const newPass = {
      id          : uuidv4(),
      studentName : studentName.trim(),
      rollNo      : String(rollNo).trim(),
      route       : route.trim(),
      busNo       : busNo.trim(),
      passType,
      contactNo   : String(contactNo).trim(),
      isActive    : isActive !== undefined ? Boolean(isActive) : true, // default active
      createdAt   : new Date().toISOString()
    };

    // Save to disk
    passes.push(newPass);
    writePasses(passes);

    return res.status(201).json({
      success : true,
      message : 'Bus pass created successfully.',
      data    : newPass
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------
// PUT /api/passes/:id
// Updates an existing bus pass after validation
// Body: any subset of pass fields (all required fields still validated)
// ----------------------------------------------------------------
router.put('/:id', validatePass, (req, res, next) => {
  try {
    const passes = readPasses();
    const index  = passes.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success : false,
        message : `Bus pass with id '${req.params.id}' not found.`
      });
    }

    const { studentName, rollNo, route, busNo, passType, contactNo, isActive } = req.body;

    // Merge updated fields over the existing record (preserve id and createdAt)
    const updatedPass = {
      ...passes[index],           // keep existing fields (id, createdAt, etc.)
      studentName : studentName.trim(),
      rollNo      : String(rollNo).trim(),
      route       : route.trim(),
      busNo       : busNo.trim(),
      passType,
      contactNo   : String(contactNo).trim(),
      isActive    : isActive !== undefined ? Boolean(isActive) : passes[index].isActive,
      updatedAt   : new Date().toISOString()
    };

    passes[index] = updatedPass;
    writePasses(passes);

    return res.status(200).json({
      success : true,
      message : 'Bus pass updated successfully.',
      data    : updatedPass
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------
// DELETE /api/passes/:id
// Deletes a bus pass by UUID, or returns 404 if not found
// ----------------------------------------------------------------
router.delete('/:id', (req, res, next) => {
  try {
    const passes  = readPasses();
    const index   = passes.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success : false,
        message : `Bus pass with id '${req.params.id}' not found.`
      });
    }

    // Remove the pass from the array
    const [deletedPass] = passes.splice(index, 1);
    writePasses(passes);

    return res.status(200).json({
      success : true,
      message : 'Bus pass deleted successfully.',
      data    : deletedPass
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
