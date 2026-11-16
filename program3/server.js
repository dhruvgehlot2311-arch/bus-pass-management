/**
 * server.js
 * -----------------------------------------------------------------
 * Bus Pass Management System — HTTP Server
 * Subject : Full Stack Development: Web Dev
 * Roll No : 14
 * Program : 3 of 5
 *
 * Built with Node.js built-in 'http' module ONLY — no Express.
 *
 * PORT : 3001
 *
 * Routes
 * ──────
 *   GET    /passes        Return all bus passes as JSON
 *   GET    /passes/:id    Return a single pass by id, or 404
 *   POST   /passes        Parse body, validate, save, return 201
 *   DELETE /passes/:id    Delete a pass by id, return 200 or 404
 *   *                     404 Not Found for all other paths
 * -----------------------------------------------------------------
 */

'use strict';

const http        = require('http');
const fileManager = require('./fileManager');

const PORT = 3001;

// ─────────────────────────────────────────────────────────────────
// Helper: sendJSON(res, statusCode, data)
// Sets Content-Type to application/json and writes the response.
// ─────────────────────────────────────────────────────────────────
function sendJSON(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

// ─────────────────────────────────────────────────────────────────
// Helper: readRequestBody(req)
// Collects the request body chunks and returns the parsed JSON.
// Returns: Promise<Object>
// ─────────────────────────────────────────────────────────────────
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        // Handle empty body
        if (!raw.trim()) {
          resolve({});
        } else {
          resolve(JSON.parse(raw));
        }
      } catch (err) {
        reject(new Error('Invalid JSON in request body'));
      }
    });

    req.on('error', (err) => reject(err));
  });
}

// ─────────────────────────────────────────────────────────────────
// Helper: validatePassData(data)
// Returns an array of missing/invalid field names.
// ─────────────────────────────────────────────────────────────────
function validatePassData(data) {
  const required = [
    'studentName',
    'rollNo',
    'route',
    'busNo',
    'passType',
    'contactNo',
  ];
  return required.filter((field) => !data[field] || String(data[field]).trim() === '');
}

// ─────────────────────────────────────────────────────────────────
// Main request handler
// Parses URL and method, dispatches to the correct route handler.
// ─────────────────────────────────────────────────────────────────
async function requestHandler(req, res) {
  const method = req.method.toUpperCase();

  // Strip query string and trailing slash, then split into segments
  const rawPath = req.url.split('?')[0].replace(/\/$/, '') || '/';
  const segments = rawPath.split('/').filter(Boolean);
  // segments[0] should be 'passes', segments[1] is an optional :id

  console.log(`\n[${new Date().toISOString()}] ${method} ${rawPath}`);

  try {
    // ── Route: GET /passes ──────────────────────────────────────
    // Returns the full list of bus passes as a JSON array.
    if (method === 'GET' && segments[0] === 'passes' && !segments[1]) {
      const passes = await fileManager.readAllPasses();
      return sendJSON(res, 200, {
        success: true,
        count: passes.length,
        data: passes,
      });
    }

    // ── Route: GET /passes/:id ──────────────────────────────────
    // Looks up a single pass by its id.
    // Responds 404 if no pass matches.
    if (method === 'GET' && segments[0] === 'passes' && segments[1]) {
      const id   = segments[1];
      const pass = await fileManager.getPassById(id);

      if (!pass) {
        return sendJSON(res, 404, {
          success: false,
          message: `No pass found with id '${id}'`,
        });
      }

      return sendJSON(res, 200, { success: true, data: pass });
    }

    // ── Route: POST /passes ─────────────────────────────────────
    // Accepts a JSON body, validates required fields, creates and
    // saves a new pass, returns 201 Created with the new pass.
    if (method === 'POST' && segments[0] === 'passes' && !segments[1]) {
      let body;
      try {
        body = await readRequestBody(req);
      } catch (parseErr) {
        return sendJSON(res, 400, {
          success: false,
          message: parseErr.message,
        });
      }

      // Validate required fields
      const missing = validatePassData(body);
      if (missing.length > 0) {
        return sendJSON(res, 400, {
          success: false,
          message: `Missing or empty required fields: ${missing.join(', ')}`,
        });
      }

      // Persist the new pass (appendPass also emits 'pass:created')
      const newPass = await fileManager.appendPass(body);

      return sendJSON(res, 201, {
        success: true,
        message: 'Bus pass created successfully',
        data: newPass,
      });
    }

    // ── Route: DELETE /passes/:id ───────────────────────────────
    // Removes the pass with the given id from the data file.
    // Responds 404 if the pass does not exist.
    if (method === 'DELETE' && segments[0] === 'passes' && segments[1]) {
      const id      = segments[1];
      const deleted = await fileManager.deletePass(id);

      if (!deleted) {
        return sendJSON(res, 404, {
          success: false,
          message: `No pass found with id '${id}'`,
        });
      }

      return sendJSON(res, 200, {
        success: true,
        message: `Bus pass '${id}' deleted successfully`,
      });
    }

    // ── Fallback: 404 Not Found ─────────────────────────────────
    // Any route that does not match the patterns above.
    sendJSON(res, 404, {
      success: false,
      message: `Route '${method} ${rawPath}' not found`,
      availableRoutes: [
        'GET    /passes',
        'GET    /passes/:id',
        'POST   /passes',
        'DELETE /passes/:id',
      ],
    });
  } catch (err) {
    // ── Global error handler ────────────────────────────────────
    // Catches unexpected errors from file I/O or other operations
    // and returns a 500 Internal Server Error response.
    console.error('[ERROR]', err.message);
    sendJSON(res, 500, {
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// Create and start the HTTP server
// ─────────────────────────────────────────────────────────────────
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log('═'.repeat(55));
  console.log('  Bus Pass Management System — Node.js HTTP Server');
  console.log('  Roll No: 14 | Program 3 of 5');
  console.log('═'.repeat(55));
  console.log(`  Server running at http://localhost:${PORT}`);
  console.log('─'.repeat(55));
  console.log('  Available Routes:');
  console.log(`    GET    http://localhost:${PORT}/passes`);
  console.log(`    GET    http://localhost:${PORT}/passes/:id`);
  console.log(`    POST   http://localhost:${PORT}/passes`);
  console.log(`    DELETE http://localhost:${PORT}/passes/:id`);
  console.log('═'.repeat(55));
});

// Handle server errors (e.g., port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use. Stop the other process and retry.`);
  } else {
    console.error('[SERVER ERROR]', err.message);
  }
  process.exit(1);
});

module.exports = server; // Export for testing purposes
