# Program 1 Execution Output & Verification
### Browser-Based Bus Pass Interface (HTML, CSS, JavaScript)
**Course Outcomes:** CO1, CO2  
**Roll No:** 14 | **Subject:** Full Stack Development: Web Dev

---

## 1. How to See the Output

### Option A: Double-Click in Browser
- File: `program1/index.html`
- Double click `index.html` or right-click $\rightarrow$ **Open with Chrome/Edge**.
- You will see:
  - Form with 6 inputs and dynamic validation error messages.
  - Collapsible JSON request and response preview panels.
  - Live table of bus passes with search by name/roll and pass type filter.

### Option B: Run Automated Test Runner in Terminal
```powershell
node program1/test_runner.js
```

---

## 2. Terminal Test Execution Output

```text
======================================================================
   PROGRAM 1: BROWSER-BASED BUS PASS MANAGEMENT INTERFACE
   Roll No: 14 | Subject: Full Stack Development (Web Dev)
   Course Outcomes: CO1 (HTML/CSS UI), CO2 (JS DOM & Fetch API)
======================================================================

[TEST 1] Testing Input Validation with Invalid Payload...
Validation status: REJECTED (Expected)
Captured field errors: {
  studentName: 'Student name is required.',
  route: 'Route is required.',
  busNo: 'Bus number is required.',
  passType: 'Please select a pass type.',
  rollNo: 'Roll no must be 3-12 alphanumeric characters.',
  contactNo: 'Contact must be exactly 10 digits.'
}

[TEST 2] Testing Input Validation with Valid Payload (Roll No 14)...
Validation status: PASSED (Valid)

[TEST 3] Simulating Fetch API POST Request with JSON Request Body...
HTTP Request: POST /api/passes
Request Payload:
{
  "studentName": "Dhruv Roll14",
  "rollNo": "14BEAIDS01",
  "route": "Route 14 - Gandhinagar Campus",
  "busNo": "GJ-01-AB-1414",
  "passType": "Annual",
  "contactNo": "9876543210"
}
HTTP Response Status: 201 Created
Response JSON Data:
{
  "id": 3,
  "studentName": "Dhruv Roll14",
  "rollNo": "14BEAIDS01",
  "route": "Route 14 - Gandhinagar Campus",
  "busNo": "GJ-01-AB-1414",
  "passType": "Annual",
  "contactNo": "9876543210",
  "issuedOn": "16/11/2026"
}

[TEST 4] Simulating Fetch API GET Request to retrieve all passes...
HTTP Response Status: 200 OK
Total passes retrieved: 3

[TEST 5] Testing Search and Filter Functionality...
- Filter by Type: "Annual"
┌─────────┬────┬────────────────┬──────────────┬─────────────────────────────────┬─────────────────┬──────────┬──────────────┬──────────────┐
│ (index) │ id │ studentName    │ rollNo       │ route                           │ busNo           │ passType │ contactNo    │ issuedOn     │
├─────────┼────┼────────────────┼──────────────┼─────────────────────────────────┼─────────────────┼──────────┼──────────────┼──────────────┤
│ 0       │ 3  │ 'Dhruv Roll14' │ '14BEAIDS01' │ 'Route 14 - Gandhinagar Campus' │ 'GJ-01-AB-1414' │ 'Annual' │ '9876543210' │ '16/11/2026' │
└─────────┴────┴────────────────┴──────────────┴─────────────────────────────────┴─────────────────┴──────────┴──────────────┴──────────────┘
- Search by query: "Roll14"
┌─────────┬────┬────────────────┬──────────────┬─────────────────────────────────┬─────────────────┬──────────┬──────────────┬──────────────┐
│ (index) │ id │ studentName    │ rollNo       │ route                           │ busNo           │ passType │ contactNo    │ issuedOn     │
├─────────┼────┼────────────────┼──────────────┼─────────────────────────────────┼─────────────────┼──────────┼──────────────┼──────────────┤
│ 0       │ 3  │ 'Dhruv Roll14' │ '14BEAIDS01' │ 'Route 14 - Gandhinagar Campus' │ 'GJ-01-AB-1414' │ 'Annual' │ '9876543210' │ '16/11/2026' │
└─────────┴────┴────────────────┴──────────────┴─────────────────────────────────┴─────────────────┴──────────┴──────────────┴──────────────┘

======================================================================
   PROGRAM 1 EXECUTION VERIFIED SUCCESSFULLY (HTML/CSS/JS INTERFACE)
======================================================================
```
