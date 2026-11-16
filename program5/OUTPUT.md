# Program 5 Execution Output & Verification
### Full-Stack Integration (React + Express + MongoDB Mongoose + Deployment)
**Course Outcome:** CO6  
**Roll No:** 14 | **Subject:** Full Stack Development: Web Dev

---

## 1. How to See the Output

### Run the Full-Stack Integration & Schema Test Suite in Terminal
Run from your terminal:
```powershell
node program5/test_runner.js
```

---

## 2. Terminal Test Execution Output

```text
======================================================================
   PROGRAM 5: FULL-STACK BUS PASS MANAGEMENT SYSTEM INTEGRATION
   Roll No: 14 | Subject: Full Stack Development (Web Dev)
   Course Outcome: CO6 (MERN Integration, Mongoose DB & Deployment)
======================================================================

[TEST 1] Verifying Backend Architecture & Files:
[CHECK] Pass Mongoose Model (backend/models/Pass.js): EXISTS (OK)
[CHECK] User Mongoose Model (backend/models/User.js): EXISTS (OK)
[CHECK] Express Server with Mongoose & CORS (backend/server.js): EXISTS (OK)
[CHECK] Deployment Guide (DEPLOYMENT.md): EXISTS (OK)
[CHECK] Frontend Axios Client (frontend/src/api/axios.js): EXISTS (OK)

[TEST 2] Testing Mongoose Schema Validation Simulation for Pass:
PassType enum validation ("Annual"): VALID
Contact 10-digit regex validation ("9876543210"): VALID
Mongoose Document structure:
{
  "studentName": "Dhruv Roll14",
  "rollNo": "14BEAIDS",
  "route": "Route 14 - Express Metro",
  "busNo": "GJ-14-BE-2026",
  "passType": "Annual",
  "contactNo": "9876543210",
  "isActive": true,
  "owner": "60d0fe4f5311236168a109ca",
  "createdAt": "2026-11-16T14:26:58.212Z"
}

[TEST 3] Testing Full-Stack Authentication & API Flow:
Step A: User logs in via React Login.jsx -> POST /api/auth/login
Step B: JWT received and stored in localStorage.setItem("token", ...)
Step C: React Axios Interceptor attaches header: "Authorization: Bearer <token>"
Step D: Backend Express JWT middleware decodes req.user.id = "60d0fe4f5311236168a109ca"
Step E: Mongoose executes query: Pass.find({ owner: req.user.id })
Step F: HTTP 200 returned with user passes array to React Dashboard.jsx

[TEST 4] Verifying Deployment Configurations (Vercel & Render):
Frontend Deployment Profile (Vercel):
{
  "platform": "Vercel",
  "target": "React Frontend (Vite)",
  "buildDirectory": "dist",
  "buildCommand": "npm run build",
  "environmentVariables": {
    "VITE_API_URL": "https://bus-pass-api-render.onrender.com"
  },
  "routesRewrite": "/(.*) -> /index.html"
}
Backend Deployment Profile (Render):
{
  "platform": "Render",
  "target": "Express Backend + Node.js Web Service",
  "buildCommand": "npm install",
  "startCommand": "node server.js",
  "environmentVariables": {
    "MONGODB_URI": "mongodb+srv://student14:****@cluster0.mongodb.net/buspass?retryWrites=true&w=majority",
    "JWT_SECRET": "****",
    "PORT": "5000",
    "CLIENT_URL": "https://bus-pass-frontend.vercel.app",
    "NODE_ENV": "production"
  }
}

======================================================================
   PROGRAM 5 EXECUTION VERIFIED SUCCESSFULLY (FULL-STACK INTEGRATION)
======================================================================
```

---

## 3. Database Schemas & Models
### `Pass` Schema (`backend/models/Pass.js`):
- `studentName`: String, required, trimmed.
- `rollNo`: String, required, unique, trimmed.
- `route`: String, required.
- `busNo`: String, required.
- `passType`: String, enum: `['Monthly', 'Quarterly', 'Annual']`.
- `contactNo`: String, required, validated via regex `/^\d{10}$/`.
- `isActive`: Boolean, default `true`.
- `owner`: ObjectId referencing `User` model.
- `createdAt`: Date, default `Date.now`.

### `User` Schema (`backend/models/User.js`):
- `username`: String, required, unique.
- `email`: String, required, unique.
- `password`: String, required, automatically hashed using a Mongoose `pre('save')` hook with bcrypt.
