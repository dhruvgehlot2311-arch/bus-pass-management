/**
 * eventBus.js
 * -----------------------------------------------------------------
 * Singleton EventEmitter for the Bus Pass Management System.
 *
 * Supported Events
 * ----------------
 *  'pass:created'  – Emitted after a new bus pass is successfully saved.
 *                    Payload: { pass }  (the full pass object)
 *
 *  'pass:deleted'  – Emitted after a bus pass is removed by its id.
 *                    Payload: { id }    (the deleted pass id)
 *
 *  'pass:updated'  – Emitted after an existing pass is modified.
 *                    Payload: { pass }  (the updated pass object)
 *
 * Usage
 * -----
 *   const eventBus = require('./eventBus');
 *   eventBus.emit('pass:created', { pass: newPass });
 *   eventBus.on('pass:created', ({ pass }) => { ... });
 * -----------------------------------------------------------------
 */

'use strict';

const { EventEmitter } = require('events');

// Create the singleton instance
const eventBus = new EventEmitter();

// ─────────────────────────────────────────────────────────────────
// Listener: pass:created
// Logs details whenever a new pass is created
// ─────────────────────────────────────────────────────────────────
eventBus.on('pass:created', ({ pass }) => {
  console.log('\n[EVENT] pass:created');
  console.log(`  ➤  ID         : ${pass.id}`);
  console.log(`  ➤  Student    : ${pass.studentName} (Roll: ${pass.rollNo})`);
  console.log(`  ➤  Route      : ${pass.route}`);
  console.log(`  ➤  Bus No     : ${pass.busNo}`);
  console.log(`  ➤  Pass Type  : ${pass.passType}`);
  console.log(`  ➤  Contact    : ${pass.contactNo}`);
  console.log(`  ➤  Active     : ${pass.isActive}`);
  console.log(`  ➤  Created At : ${pass.createdAt}`);
  console.log('─'.repeat(50));
});

// ─────────────────────────────────────────────────────────────────
// Listener: pass:deleted
// Logs the id of the pass that was removed
// ─────────────────────────────────────────────────────────────────
eventBus.on('pass:deleted', ({ id }) => {
  console.log('\n[EVENT] pass:deleted');
  console.log(`  ➤  Deleted Pass ID : ${id}`);
  console.log(`  ➤  Timestamp       : ${new Date().toISOString()}`);
  console.log('─'.repeat(50));
});

// ─────────────────────────────────────────────────────────────────
// Listener: pass:updated
// Logs the updated pass details
// ─────────────────────────────────────────────────────────────────
eventBus.on('pass:updated', ({ pass }) => {
  console.log('\n[EVENT] pass:updated');
  console.log(`  ➤  ID         : ${pass.id}`);
  console.log(`  ➤  Student    : ${pass.studentName} (Roll: ${pass.rollNo})`);
  console.log(`  ➤  Route      : ${pass.route}`);
  console.log(`  ➤  Bus No     : ${pass.busNo}`);
  console.log(`  ➤  Active     : ${pass.isActive}`);
  console.log(`  ➤  Updated At : ${new Date().toISOString()}`);
  console.log('─'.repeat(50));
});

// Export the singleton so all modules share the same emitter instance
module.exports = eventBus;
