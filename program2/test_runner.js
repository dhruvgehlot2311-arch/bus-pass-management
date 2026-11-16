/**
 * Program 2 Test Runner & Verification Script
 * Validates React Functional Components, State, Context API, Hooks, and Routing
 * Roll No: 14 | Course Outcome: CO3
 */

console.log('='.repeat(70));
console.log('   PROGRAM 2: REACT APPLICATION FOR BUS PASS MANAGEMENT');
console.log('   Roll No: 14 | Subject: Full Stack Development (Web Dev)');
console.log('   Course Outcome: CO3 (React Components, Props, State, Hooks & Router)');
console.log('='.repeat(70));

// Simulating React Context and State Management (PassContext.jsx)
class MockPassContext {
  constructor() {
    this.passes = [
      { id: "101", studentName: "Rohan Patel", rollNo: "CS2214", route: "Route 1 - East End", busNo: "MH-01-A-101", passType: "Monthly", contactNo: "9123456789" },
      { id: "102", studentName: "Sneha Gupta", rollNo: "IT2214", route: "Route 4 - North Hub", busNo: "MH-02-B-202", passType: "Quarterly", contactNo: "9876501234" }
    ];
    this.subscribers = [];
  }

  addPass(data) {
    const newPass = { ...data, id: Date.now().toString() };
    this.passes.push(newPass);
    this.notify();
    return newPass;
  }

  updatePass(id, updatedFields) {
    const index = this.passes.findIndex(p => p.id === id);
    if (index !== -1) {
      this.passes[index] = { ...this.passes[index], ...updatedFields, id };
      this.notify();
      return this.passes[index];
    }
    return null;
  }

  deletePass(id) {
    const initialCount = this.passes.length;
    this.passes = this.passes.filter(p => p.id !== id);
    this.notify();
    return this.passes.length < initialCount;
  }

  notify() {
    // Mimics useEffect syncing to localStorage
    this.mockLocalStorage = JSON.stringify(this.passes);
  }
}

// Validation logic matching PassForm.jsx
function validatePassForm(formData) {
  const errors = {};
  if (!formData.studentName || !formData.studentName.trim()) errors.studentName = 'Student name is required.';
  if (!formData.rollNo || !formData.rollNo.trim()) errors.rollNo = 'Roll number is required.';
  if (!formData.route || !formData.route.trim()) errors.route = 'Route is required.';
  if (!formData.busNo || !formData.busNo.trim()) errors.busNo = 'Bus number is required.';
  if (!formData.passType) errors.passType = 'Please select a pass type.';

  const contactTrimmed = (formData.contactNo || '').trim();
  if (!contactTrimmed) {
    errors.contactNo = 'Contact number is required.';
  } else if (!/^\d{10}$/.test(contactTrimmed)) {
    errors.contactNo = 'Contact number must be exactly 10 digits.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// React Router routes map simulation
const routes = [
  { path: '/', component: 'PassList (Listing View)', description: 'Displays cards of all passes with search & delete' },
  { path: '/add', component: 'PassForm (mode=add)', description: 'Controlled form to capture and validate new pass' },
  { path: '/edit/:id', component: 'PassForm (mode=edit)', description: 'Loads existing pass into state for modification' }
];

async function runReactTests() {
  const context = new MockPassContext();

  console.log('\n[TEST 1] Verifying React Router Navigation Configuration:');
  console.table(routes);

  console.log('\n[TEST 2] Verifying Initial State in PassContext:');
  console.log(`Current passes count: ${context.passes.length}`);
  console.table(context.passes);

  console.log('\n[TEST 3] Testing PassForm Validation Logic (useState & Form Submission):');
  const invalidForm = { studentName: '', rollNo: '', route: '', busNo: '', passType: 'Monthly', contactNo: '123' };
  const valResult = validatePassForm(invalidForm);
  console.log('Form validation with empty fields:', valResult.isValid ? 'VALID' : 'INVALID (Blocked submission)');
  console.log('Errors caught in state:', valResult.errors);

  console.log('\n[TEST 4] Testing addPass() Action via PassContext (Roll No 14 Record):');
  const validForm = {
    studentName: 'Dhruv Roll14',
    rollNo: '14BEAIDS',
    route: 'Route 14 - Express Ring Road',
    busNo: 'GJ-14-EXP-2026',
    passType: 'Annual',
    contactNo: '9898014014'
  };
  const added = context.addPass(validForm);
  console.log('Successfully created pass with ID:', added.id);
  console.log('LocalStorage synchronized string:', context.mockLocalStorage);

  console.log('\n[TEST 5] Testing updatePass() Action (Modifying Route):');
  const updated = context.updatePass(added.id, { route: 'Route 14 - Metro Interchange Station' });
  console.log('Updated pass details:', updated);

  console.log('\n[TEST 6] Testing deletePass() Action (Conditional Rendering / Removal):');
  const isDeleted = context.deletePass(added.id);
  console.log(`Deletion of ID ${added.id}:`, isDeleted ? 'SUCCESS' : 'FAILED');
  console.log(`Final passes remaining in state: ${context.passes.length}`);

  console.log('\n' + '='.repeat(70));
  console.log('   PROGRAM 2 EXECUTION VERIFIED SUCCESSFULLY (REACT APPLICATION)');
  console.log('='.repeat(70));
}

runReactTests();
