/**
 * fileManager.js
 * -----------------------------------------------------------------
 * File I/O layer for the Bus Pass Management System.
 * Uses Node.js built-in modules ONLY: fs, path, stream.
 * No Express or third-party packages.
 *
 * All reads use fs.createReadStream (chunks → Buffer → JSON.parse).
 * All writes use fs.createWriteStream (JSON.stringify → stream).
 * Every operation emits the appropriate event on the shared eventBus.
 * -----------------------------------------------------------------
 */

'use strict';

const fs       = require('fs');
const path     = require('path');
const { Readable } = require('stream');

const eventBus = require('./eventBus');

// Absolute path to the JSON data file
const DATA_FILE = path.join(__dirname, 'passes.json');

// ─────────────────────────────────────────────────────────────────
// readAllPasses()
// Reads passes.json using a ReadStream, concatenates chunks, and
// returns a parsed Array of pass objects.
// Returns: Promise<Array>
// ─────────────────────────────────────────────────────────────────
function readAllPasses() {
  return new Promise((resolve, reject) => {
    const chunks = [];

    // Create a readable stream pointing to the data file
    const readStream = fs.createReadStream(DATA_FILE, { encoding: 'utf8' });

    // Accumulate chunks as they arrive
    readStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // Once all chunks are received, join and parse
    readStream.on('end', () => {
      try {
        const json = chunks.join('');
        const passes = JSON.parse(json);
        resolve(passes);
      } catch (parseErr) {
        reject(new Error(`Failed to parse passes.json: ${parseErr.message}`));
      }
    });

    // Forward any stream error to the caller
    readStream.on('error', (err) => {
      reject(new Error(`Failed to read passes.json: ${err.message}`));
    });
  });
}

// ─────────────────────────────────────────────────────────────────
// writeAllPasses(passes)
// Serialises the passes array and writes it to passes.json using
// a WriteStream.
// Returns: Promise<void>
// ─────────────────────────────────────────────────────────────────
function writeAllPasses(passes) {
  return new Promise((resolve, reject) => {
    // Pretty-print with 2-space indent for human-readability
    const jsonString = JSON.stringify(passes, null, 2);

    // Create a writable stream (overwrites existing file)
    const writeStream = fs.createWriteStream(DATA_FILE, { encoding: 'utf8' });

    writeStream.on('finish', () => resolve());
    writeStream.on('error', (err) => {
      reject(new Error(`Failed to write passes.json: ${err.message}`));
    });

    // Write the JSON string and signal end-of-stream
    writeStream.write(jsonString);
    writeStream.end();
  });
}

// ─────────────────────────────────────────────────────────────────
// getPassById(id)
// Reads all passes and returns the one whose id matches the given
// string id. Returns undefined if not found.
// Returns: Promise<Object|undefined>
// ─────────────────────────────────────────────────────────────────
async function getPassById(id) {
  const passes = await readAllPasses();
  // Coerce both sides to string for safe comparison
  const found = passes.find((p) => String(p.id) === String(id));
  return found;
}

// ─────────────────────────────────────────────────────────────────
// appendPass(passData)
// Generates a uuid-style id using Date.now(), merges it with the
// supplied passData, appends to the array, persists, and emits
// 'pass:created'.
// Returns: Promise<Object>  (the newly created pass)
// ─────────────────────────────────────────────────────────────────
async function appendPass(passData) {
  // Generate a unique numeric id from the current timestamp
  const newPass = {
    id: String(Date.now()),
    studentName: passData.studentName,
    rollNo:      passData.rollNo,
    route:       passData.route,
    busNo:       passData.busNo,
    passType:    passData.passType,
    contactNo:   passData.contactNo,
    isActive:    passData.isActive !== undefined ? passData.isActive : true,
    createdAt:   new Date().toISOString(),
  };

  // Read current passes, add the new one, persist
  const passes = await readAllPasses();
  passes.push(newPass);
  await writeAllPasses(passes);

  // Notify all listeners that a new pass was created
  eventBus.emit('pass:created', { pass: newPass });

  return newPass;
}

// ─────────────────────────────────────────────────────────────────
// deletePass(id)
// Reads all passes, removes the one with the matching id, persists
// the remaining array, and emits 'pass:deleted'.
// Returns: Promise<boolean>  (true if deleted, false if not found)
// ─────────────────────────────────────────────────────────────────
async function deletePass(id) {
  const passes = await readAllPasses();

  // Check whether the target pass actually exists
  const exists = passes.some((p) => String(p.id) === String(id));
  if (!exists) {
    return false; // Signal not-found to the caller
  }

  // Filter out the pass to delete
  const remaining = passes.filter((p) => String(p.id) !== String(id));
  await writeAllPasses(remaining);

  // Notify all listeners that a pass was removed
  eventBus.emit('pass:deleted', { id });

  return true;
}

// Export all public functions
module.exports = {
  readAllPasses,
  writeAllPasses,
  getPassById,
  appendPass,
  deletePass,
};
