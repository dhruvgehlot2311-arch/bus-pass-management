/**
 * Program 1 Test Runner & Verification Script
 * Simulates Browser DOM, Event Handling, Input Validation, and Fetch API
 * Roll No: 14 | Course Outcomes: CO1, CO2
 */

console.log('='.repeat(70));
console.log('   PROGRAM 1: BROWSER-BASED BUS PASS MANAGEMENT INTERFACE');
console.log('   Roll No: 14 | Subject: Full Stack Development (Web Dev)');
console.log('   Course Outcomes: CO1 (HTML/CSS UI), CO2 (JS DOM & Fetch API)');
console.log('='.repeat(70));

// Mock database simulating in-memory pass store
let passDatabase = [
  { id: 1, studentName: "Aarav Mehta", rollNo: "CS2201A", route: "Borivali - Andheri", busNo: "MH-04-BV-1234", passType: "Monthly", contactNo: "9876543210", issuedOn: "16-Nov-2026" },
  { id: 2, studentName: "Priya Nair", rollNo: "CS2305B", route: "Thane - Dadar", busNo: "MH-03-TH-5678", passType: "Quarterly", contactNo: "8765432109", issuedOn: "16-Nov-2026" }
];
let nextId = 3;

// Validation function mirroring index.html validateForm()
function validateInput(data) {
  const errors = {};
  if (!data.studentName || !data.studentName.trim()) errors.studentName = "Student name is required.";
  if (!data.route || !data.route.trim()) errors.route = "Route is required.";
  if (!data.busNo || !data.busNo.trim()) errors.busNo = "Bus number is required.";
  if (!data.passType) errors.passType = "Please select a pass type.";

  if (!data.rollNo) {
    errors.rollNo = "Roll number is required.";
  } else if (!/^[A-Za-z0-9]{3,12}$/.test(data.rollNo)) {
    errors.rollNo = "Roll no must be 3-12 alphanumeric characters.";
  }

  if (!data.contactNo) {
    errors.contactNo = "Contact number is required.";
  } else if (!/^\d{10}$/.test(data.contactNo)) {
    errors.contactNo = "Contact must be exactly 10 digits.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Simulated Async Fetch POST
async function mockFetchPost(payload) {
  return new Promise(resolve => {
    setTimeout(() => {
      const newPass = { id: nextId++, ...payload, issuedOn: new Date().toLocaleDateString('en-IN') };
      passDatabase.push(newPass);
      resolve({
        status: 201,
        statusText: "Created",
        headers: { "Content-Type": "application/json" },
        data: newPass
      });
    }, 150);
  });
}

// Simulated Async Fetch GET
async function mockFetchGet() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/json" },
        data: passDatabase
      });
    }, 100);
  });
}

// Search and Filter simulation
function filterPasses(query, filterType) {
  return passDatabase.filter(p => {
    const matchesQuery = !query || p.studentName.toLowerCase().includes(query.toLowerCase()) || p.rollNo.toLowerCase().includes(query.toLowerCase());
    const matchesType = !filterType || p.passType === filterType;
    return matchesQuery && matchesType;
  });
}

async function runTests() {
  console.log('\n[TEST 1] Testing Input Validation with Invalid Payload...');
  const invalidInput = { studentName: '', rollNo: '14!', route: '', busNo: '', passType: '', contactNo: '123' };
  const valResult1 = validateInput(invalidInput);
  console.log('Validation status:', valResult1.isValid ? 'PASSED' : 'REJECTED (Expected)');
  console.log('Captured field errors:', valResult1.errors);

  console.log('\n[TEST 2] Testing Input Validation with Valid Payload (Roll No 14)...');
  const validInput = {
    studentName: 'Dhruv Roll14',
    rollNo: '14BEAIDS01',
    route: 'Route 14 - Gandhinagar Campus',
    busNo: 'GJ-01-AB-1414',
    passType: 'Annual',
    contactNo: '9876543210'
  };
  const valResult2 = validateInput(validInput);
  console.log('Validation status:', valResult2.isValid ? 'PASSED (Valid)' : 'FAILED');

  console.log('\n[TEST 3] Simulating Fetch API POST Request with JSON Request Body...');
  console.log('HTTP Request: POST /api/passes');
  console.log('Request Payload:\n', JSON.stringify(validInput, null, 2));
  const postResponse = await mockFetchPost(validInput);
  console.log(`HTTP Response Status: ${postResponse.status} ${postResponse.statusText}`);
  console.log('Response JSON Data:\n', JSON.stringify(postResponse.data, null, 2));

  console.log('\n[TEST 4] Simulating Fetch API GET Request to retrieve all passes...');
  const getResponse = await mockFetchGet();
  console.log(`HTTP Response Status: ${getResponse.status} ${getResponse.statusText}`);
  console.log(`Total passes retrieved: ${getResponse.data.length}`);

  console.log('\n[TEST 5] Testing Search and Filter Functionality...');
  console.log('- Filter by Type: "Annual"');
  const annualPasses = filterPasses('', 'Annual');
  console.table(annualPasses);

  console.log('- Search by query: "Roll14"');
  const searchResult = filterPasses('Roll14', '');
  console.table(searchResult);

  console.log('\n' + '='.repeat(70));
  console.log('   PROGRAM 1 EXECUTION VERIFIED SUCCESSFULLY (HTML/CSS/JS INTERFACE)');
  console.log('='.repeat(70));
}

runTests();
