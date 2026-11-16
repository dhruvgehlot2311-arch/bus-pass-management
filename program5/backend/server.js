// server.js
// Entry point for the Bus Pass Management Express application
// Roll No: 14 | Program 5 — Full Stack Development

// Load environment variables from .env BEFORE anything else
require('dotenv').config();

const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');

// Route modules
const authRoutes  = require('./routes/auth');
const passRoutes  = require('./routes/passes');

// Centralized error handler (must be imported after routes)
const { errorHandler } = require('./middleware/errorHandler');

// ─────────────────────────────────────────────────────────────────────────────
// Application Setup
// ─────────────────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

// Allow JSON request bodies
app.use(express.json());

// Allow URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// CORS — only accept requests from the configured frontend origin
app.use(
  cors({
    origin:      process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,                          // allow cookies / auth headers
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Health-check route — useful for Render's uptime ping
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bus Pass Management API is running.',
    environment: process.env.NODE_ENV,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Route Mounting
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);   // POST /api/auth/register | /api/auth/login
app.use('/api/passes', passRoutes);   // GET/POST/PUT/DELETE /api/passes

// 404 handler — catch requests to undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Centralized Error Handler (must be registered last)
// ─────────────────────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Database Connection → Server Start
// ─────────────────────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });

    console.log('✅  MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`🚀  Server is running on http://localhost:${PORT}`);
      console.log(`🌍  Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗  CORS origin:  ${process.env.CLIENT_URL}`);
    });
  } catch (connectionError) {
    console.error('❌  MongoDB connection failed:', connectionError.message);
    process.exit(1); // Exit with failure code so Render/PM2 can restart
  }
};

// Handle unhandled promise rejections (e.g., mongoose connect after server start)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
