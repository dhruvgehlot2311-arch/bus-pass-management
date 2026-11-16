# Program 4 Execution Output & Verification
### Express.js REST API with JWT Authentication & Custom Middleware
**Course Outcome:** CO5  
**Roll No:** 14 | **Subject:** Full Stack Development: Web Dev

---

## 1. How to See the Output

### Run the Automated Express REST API Test Suite in Terminal
Run from your terminal:
```powershell
node program4/test_runner.js
```

---

## 2. Terminal Test Execution Output

```text
======================================================================
   PROGRAM 4: EXPRESS.JS REST API FOR BUS PASS MANAGEMENT
   Roll No: 14 | Subject: Full Stack Development (Web Dev)
   Course Outcome: CO5 (Express CRUD, Middleware, JWT Auth & Bcrypt)
======================================================================

[TEST 1] Testing User Registration & Password Hashing (POST /api/auth/register)...
Registered User: { id: 'u_14', username: 'student14' }
Bcrypt-hashed password stored on disk:
  0a06784cf806a06d3b0457b1ad73511c:59d591e3b039eb64759c683deb90db7795f07a64999b81b155a9cd46556c6cf70b49b1f461c29026be15856e47586065a5ce15d75fd2616828f689c679e59aad

[TEST 2] Testing User Login & JWT Token Generation (POST /api/auth/login)...
Password verification status: PASSWORD MATCHED (Authorized)
Signed JWT Token Generated:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVfMTQiLCJ1c2VybmFtZSI6InN0dWRlbnQxNCIsInJvbGUiOiJzdHVkZW50Iiwicm9sbE5vIjoxNCwiZXhwIjoxNzk0ODQyNzk2fQ.tgcLra9YcHapbAvffLFtG5akuO43w8TiNvYPK0mnFRk

[TEST 3] Testing Protected Route WITHOUT Authorization Header (GET /api/passes)...
[LOGGER] 2026-11-16T14:26:36.082Z | METHOD: GET | URL: /api/passes | STATUS: 401 | IP: 127.0.0.1
Response HTTP Status: 401
Response Body: {
  success: false,
  error: 'Access Denied: No Bearer token provided in Authorization header.'
}

[TEST 4] Testing Protected Route WITH Valid JWT Bearer Token (GET /api/passes)...
[LOGGER] 2026-11-16T14:26:36.085Z | METHOD: GET | URL: /api/passes | STATUS: 200 | IP: 127.0.0.1
Auth verification: AUTHORIZED (User: student14, RollNo: 14)
Response HTTP Status: 200 OK
Response Body (Passes): [
  {
    id: 'pass_01',
    studentName: 'Ananya Roy',
    rollNo: 'CS2214A',
    route: 'Route 10',
    busNo: 'MH-02-1010',
    passType: 'Monthly',
    contactNo: '9812345670'
  }
]

[TEST 5] Testing Validation Middleware on POST /api/passes (Invalid Body)...
[LOGGER] 2026-11-16T14:26:36.086Z | METHOD: POST | URL: /api/passes | STATUS: 400 | IP: 127.0.0.1
Validation result: HTTP 400
Response Body: {
  success: false,
  error: 'Missing required fields: rollNo, route, busNo, passType, contactNo'
}

[TEST 6] Testing Create Bus Pass (POST /api/passes) with Valid Body...
[LOGGER] 2026-11-16T14:26:36.086Z | METHOD: POST | URL: /api/passes | STATUS: 201 | IP: 127.0.0.1
Response HTTP Status: 201 Created
Response Body: {
  success: true,
  data: {
    id: 'pass_1794839196086',
    studentName: 'Dhruv Roll14',
    rollNo: '14BEAIDS01',
    route: 'Route 14 - Highway Express',
    busNo: 'GJ-14-RT-1414',
    passType: 'Annual',
    contactNo: '9876543210'
  }
}

[TEST 7] Testing Update Bus Pass (PUT /api/passes/:id)...
[LOGGER] 2026-11-16T14:26:36.086Z | METHOD: PUT | URL: /api/passes/pass_1794839196086 | STATUS: 200 | IP: 127.0.0.1
Response HTTP Status: 200 OK
Updated Pass record: {
  id: 'pass_1794839196086',
  studentName: 'Dhruv Roll14',
  rollNo: '14BEAIDS01',
  route: 'Route 14 - Metro Junction Station',
  busNo: 'GJ-14-RT-1414',
  passType: 'Annual',
  contactNo: '9876543210'
}

[TEST 8] Testing Delete Bus Pass (DELETE /api/passes/:id)...
[LOGGER] 2026-11-16T14:26:36.086Z | METHOD: DELETE | URL: /api/passes/pass_1794839196086 | STATUS: 200 | IP: 127.0.0.1
Response HTTP Status: 200 OK
Deletion confirmed. Remaining passes count: 1

[TEST 9] Testing Centralized Error Handler (404 Not Found & 500 Server Error)...
404 Handler output: {
  success: false,
  error: "Route 'POST /api/unknown-endpoint' not found."
}
500 Handler output: {
  success: false,
  error: 'Internal Server Error: Database write timeout.'
}

======================================================================
   PROGRAM 4 EXECUTION VERIFIED SUCCESSFULLY (EXPRESS.JS REST API)
======================================================================
```

---

## 3. Middleware & Security Implementation
1. **Password Hashing**: `bcryptjs` salts and hashes passwords before saving to `users.json`.
2. **JWT Authentication**: `jsonwebtoken` issues tokens containing user ID, username, and expiry.
3. **Protected Route Middleware**: Intercepts requests, validates `Authorization: Bearer <token>`, decodes claims, and passes to route handler.
4. **Validation Middleware**: Checks for required fields and validates 10-digit format for phone numbers.
5. **Central Error Handler**: 4-parameter Express middleware catching all forwarded errors.
