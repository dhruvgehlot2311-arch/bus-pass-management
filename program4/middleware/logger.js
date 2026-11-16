// ============================================================
// middleware/logger.js
// Custom HTTP request/response logger middleware
// Roll No: 14 | Program 4 — Bus Pass Management API
// ============================================================

/**
 * loggerMiddleware
 * - Attaches req.startTime (high-resolution timestamp) at the start of each request.
 * - Listens for the 'finish' event on the response object so it can log:
 *     [TIMESTAMP]  METHOD  URL  STATUS  Xms
 * - Color-codes the status code for readability in development.
 */
const loggerMiddleware = (req, res, next) => {
  // Record the exact moment the request arrived (ms precision)
  req.startTime = Date.now();

  // Once the response is fully sent to the client, compute elapsed time and log
  res.on('finish', () => {
    const elapsedMs = Date.now() - req.startTime;
    const timestamp = new Date().toISOString();
    const method    = req.method.padEnd(7);       // align columns
    const url       = req.originalUrl;
    const status    = res.statusCode;

    // Choose a simple prefix symbol based on HTTP status range
    let statusLabel;
    if (status >= 500) {
      statusLabel = `[ERR ${status}]`;
    } else if (status >= 400) {
      statusLabel = `[WRN ${status}]`;
    } else if (status >= 300) {
      statusLabel = `[RDR ${status}]`;
    } else {
      statusLabel = `[OK  ${status}]`;
    }

    // Final log line format:
    // [2026-11-16T14:05:00.000Z] [OK  200] GET     /api/passes  12ms
    console.log(`[${timestamp}] ${statusLabel} ${method} ${url}  ${elapsedMs}ms`);
  });

  // Pass control to the next middleware / route handler
  next();
};

module.exports = loggerMiddleware;
