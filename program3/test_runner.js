'use strict';

const fileManager = require('./fileManager');
const eventBus = require('./eventBus');

async function runProgram3Tests() {
  console.log('='.repeat(65));
  console.log('   PROGRAM 3: NODE.JS SERVER-SIDE UTILITY FOR BUS PASS MANAGEMENT');
  console.log('   Roll No: 14 | Course Outcome: CO4');
  console.log('   Features: File System, Path, Readable/Writable Streams, EventEmitter');
  console.log('='.repeat(65));

  try {
    console.log('\n[TEST 1] Reading initial passes using Streams (readAllPasses)...');
    const initialPasses = await fileManager.readAllPasses();
    console.log(`Success: Retrieved ${initialPasses.length} existing passes from passes.json.`);
    console.table(initialPasses.map(p => ({
      ID: p.id,
      Student: p.studentName,
      Roll: p.rollNo,
      Route: p.route,
      Type: p.passType
    })));

    console.log('\n[TEST 2] Appending a new bus pass using Writable Stream and EventEmitter...');
    const newPassData = {
      studentName: 'Dhruv Roll14',
      rollNo: '14BEAIDS01',
      route: 'Route 14 - Gandhinagar Campus Express',
      busNo: 'GJ-14-BD-9001',
      passType: 'Quarterly',
      contactNo: '9876543210'
    };
    const createdPass = await fileManager.appendPass(newPassData);
    console.log('Pass created successfully via Stream with ID:', createdPass.id);

    console.log('\n[TEST 3] Fetching pass by ID using getPassById()...');
    const fetchedPass = await fileManager.getPassById(createdPass.id);
    console.log('Pass found:', JSON.stringify(fetchedPass, null, 2));

    console.log('\n[TEST 4] Verifying all passes count after addition...');
    const updatedPasses = await fileManager.readAllPasses();
    console.log(`Current total passes: ${updatedPasses.length}`);

    console.log('\n[TEST 5] Deleting the added pass using deletePass()...');
    const deleted = await fileManager.deletePass(createdPass.id);
    console.log('Deletion result:', deleted ? 'Success (Pass deleted)' : 'Failed');

    console.log('\n[TEST 6] Confirming deletion from passes.json...');
    const finalPasses = await fileManager.readAllPasses();
    console.log(`Final passes count: ${finalPasses.length}`);
    console.log('\n' + '='.repeat(65));
    console.log('   PROGRAM 3 EXECUTION & VERIFICATION COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(65));
  } catch (err) {
    console.error('Test error:', err);
  }
}

runProgram3Tests();
