// ============================================================
// server.js
// Entry point — Express app setup for Bus Pass Management API
// Roll No: 14 | Program 4 | Subject: Full Stack Web Dev
// ============================================================

// Load environment variables from .env file if present.
// In production these are set at the OS/cloud level instead.
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');

// ---- Custom middleware ----
const loggerMiddleware = require('./middleware/logger');
const errorHandler     = require('./middleware/errorHandler');

// ---- Route modules ----
const authRoutes  = require('./routes/auth');
const passRoutes  = require('./routes/passes');

// ================================================================
// App Initialization
// ================================================================
const app  = express();
const PORT = process.env.PORT || 3000;

// ================================================================
// Global Middleware
// (Order matters: these run before every route handler)
// ================================================================

// 1. CORS — allow all origins in development; restrict in production
app.use(cors({
  origin      : process.env.NODE_ENV === 'production' ? false : '*',
  methods     : ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. JSON body parser — parse incoming request bodies as JSON
//    Rejects payloads larger than 10 kb (basic DoS protection)
app.use(express.json({ limit: '10kb' }));

// 3. URL-encoded body parser — for form-data submissions
app.use(express.urlencoded({ extended: true }));

// 4. Custom logger — logs method, URL, status, and response time
app.use(loggerMiddleware);

// ================================================================
// Routes
// ================================================================

// Health-check endpoint — no auth required
app.get('/', (req, res) => {
  res.json({
    success : true,
    message : 'Bus Pass Management API is running.',
    version : '1.0.0',
    endpoints: {
      auth  : '/api/auth (register, login)',
      passes: '/api/passes (CRUD — JWT protected)'
    }
  });
});

// Authentication routes: /api/auth/register  &  /api/auth/login
app.use('/api/auth', authRoutes);

// Bus pass CRUD routes: /api/passes (all protected by JWT inside the router)
app.use('/api/passes', passRoutes);

// ================================================================
// 404 Handler — catch requests to undefined routes
// ================================================================
app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : `Route '${req.method} ${req.originalUrl}' not found.`
  });
});

// ================================================================
// Centralized Error Handler
// MUST be registered last, after all routes and other middleware.
// Receives errors forwarded via next(err).
// ================================================================
app.use(errorHandler);

// ================================================================
// Start Server
// ================================================================
app.listen(PORT, () => {
  console.log('============================================================');
  console.log(' Bus Pass Management REST API');
  console.log(` Roll No : 14 | Program 4 of 5`);
  console.log(`------------------------------------------------------------`);
  console.log(` Server running on : http://localhost:${PORT}`);
  console.log(` Environment       : ${process.env.NODE_ENV || 'development'}`);
  console.log('============================================================');
  console.log(' Endpoints:');
  console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET    http://localhost:${PORT}/api/passes        [JWT]`);
  console.log(`   GET    http://localhost:${PORT}/api/passes/:id    [JWT]`);
  console.log(`   POST   http://localhost:${PORT}/api/passes        [JWT]`);
  console.log(`   PUT    http://localhost:${PORT}/api/passes/:id    [JWT]`);
  console.log(`   DELETE http://localhost:${PORT}/api/passes/:id    [JWT]`);
  console.log('============================================================');
});

module.exports = app; // Export for testing purposes
