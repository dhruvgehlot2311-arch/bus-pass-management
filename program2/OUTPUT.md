# Program 2 Execution Output & Verification
### React Application for Bus Pass Management
**Course Outcome:** CO3  
**Roll No:** 14 | **Subject:** Full Stack Development: Web Dev

---

## 1. How to See the Output

### Option A: Double-Click Browser Preview (Immediate, No Setup Needed)
Simply open the standalone React preview in your browser:
- File path: `program2/standalone_preview.html`
- Double-click `standalone_preview.html` in Windows Explorer or right-click $\rightarrow$ **Open with Chrome/Edge**.
- You will see the live React 18 interface with:
  - Responsive Card Grid listing view.
  - Live search bar and pass-type dropdown filter.
  - Interactive "Add New Pass" controlled form with validation.
  - Edit and Delete operations with persistent `localStorage` synchronization.

### Option B: Run Automated Test Runner in Terminal
Run from your terminal:
```powershell
node program2/test_runner.js
```

---

## 2. Terminal Test Execution Output

```text
======================================================================
   PROGRAM 2: REACT APPLICATION FOR BUS PASS MANAGEMENT
   Roll No: 14 | Subject: Full Stack Development (Web Dev)
   Course Outcome: CO3 (React Components, Props, State, Hooks & Router)
======================================================================

[TEST 1] Verifying React Router Navigation Configuration:
┌─────────┬─────────────┬───────────────────────────┬─────────────────────────────────────────────────────┐
│ (index) │ path        │ component                 │ description                                         │
├─────────┼─────────────┼───────────────────────────┼─────────────────────────────────────────────────────┤
│ 0       │ '/'         │ 'PassList (Listing View)' │ 'Displays cards of all passes with search & delete' │
│ 1       │ '/add'      │ 'PassForm (mode=add)'     │ 'Controlled form to capture and validate new pass'  │
│ 2       │ '/edit/:id' │ 'PassForm (mode=edit)'    │ 'Loads existing pass into state for modification'   │
└─────────┴─────────────┴───────────────────────────┴─────────────────────────────────────────────────────┘

[TEST 2] Verifying Initial State in PassContext:
Current passes count: 2
┌─────────┬───────┬───────────────┬──────────┬───────────────────────┬───────────────┬─────────────┬──────────────┐
│ (index) │ id    │ studentName   │ rollNo   │ route                 │ busNo         │ passType    │ contactNo    │
├─────────┼───────┼───────────────┼──────────┼───────────────────────┼───────────────┼─────────────┼──────────────┤
│ 0       │ '101' │ 'Rohan Patel' │ 'CS2214' │ 'Route 1 - East End'  │ 'MH-01-A-101' │ 'Monthly'   │ '9123456789' │
│ 1       │ '102' │ 'Sneha Gupta' │ 'IT2214' │ 'Route 4 - North Hub' │ 'MH-02-B-202' │ 'Quarterly' │ '9876501234' │
└─────────┴───────┴───────────────┴──────────┴───────────────────────┴───────────────┴─────────────┴──────────────┘

[TEST 3] Testing PassForm Validation Logic (useState & Form Submission):
Form validation with empty fields: INVALID (Blocked submission)
Errors caught in state: {
  studentName: 'Student name is required.',
  rollNo: 'Roll number is required.',
  route: 'Route is required.',
  busNo: 'Bus number is required.',
  contactNo: 'Contact number must be exactly 10 digits.'
}

[TEST 4] Testing addPass() Action via PassContext (Roll No 14 Record):
Successfully created pass with ID: 1794839166998
LocalStorage synchronized string: [{"id":"101","studentName":"Rohan Patel","rollNo":"CS2214","route":"Route 1 - East End","busNo":"MH-01-A-101","passType":"Monthly","contactNo":"9123456789"},{"id":"102","studentName":"Sneha Gupta","rollNo":"IT2214","route":"Route 4 - North Hub","busNo":"MH-02-B-202","passType":"Quarterly","contactNo":"9876501234"},{"studentName":"Dhruv Roll14","rollNo":"14BEAIDS","route":"Route 14 - Express Ring Road","busNo":"GJ-14-EXP-2026","passType":"Annual","contactNo":"9898014014","id":"1794839166998"}]

[TEST 5] Testing updatePass() Action (Modifying Route):
Updated pass details: {
  studentName: 'Dhruv Roll14',
  rollNo: '14BEAIDS',
  route: 'Route 14 - Metro Interchange Station',
  busNo: 'GJ-14-EXP-2026',
  passType: 'Annual',
  contactNo: '9898014014',
  id: '1794839166998'
}

[TEST 6] Testing deletePass() Action (Conditional Rendering / Removal):
Deletion of ID 1794839166998: SUCCESS
Final passes remaining in state: 2

======================================================================
   PROGRAM 2 EXECUTION VERIFIED SUCCESSFULLY (REACT APPLICATION)
======================================================================
```

---

## 3. UI Component Breakdown & State Flow
- **`PassForm.jsx`**: Controlled inputs tracking `{ studentName, rollNo, route, busNo, passType, contactNo }`. Validates that fields are non-empty and contact is 10 digits before saving.
- **`PassList.jsx`**: Consumes `PassContext`, performs case-insensitive filtering based on search query and dropdown selection, and renders `PassCard` components.
- **`PassCard.jsx`**: Renders student metadata with a colored pass-type badge, and provides "Edit" and "Delete" triggers.
- **`PassContext.jsx`**: Employs `useContext` for global application state with `addPass`, `updatePass`, and `deletePass` helpers.
