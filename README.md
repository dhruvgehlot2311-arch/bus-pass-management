# Full Stack Development — Bus Pass Management System
### Practical Assignment | B.E. (AI & DS) | Semester V
**Roll No:** 14 | **Subject:** Full Stack Development: Web Dev

This repository contains all 5 individual programs covering Course Outcomes **CO1 to CO6**, structured cleanly in separate directories.

---

## 📂 Repository Structure

```
├── .gitignore
├── README.md
├── program1/   # CO1, CO2: Browser-Based Bus Pass Interface (HTML, CSS, JS)
├── program2/   # CO3: React Application for Bus Pass Management
├── program3/   # CO4: Node.js Server-Side Utility (No Express, Streams & Events)
├── program4/   # CO5: Express.js REST API with JWT Authentication
└── program5/   # CO6: Full-Stack Integration (React + Express + MongoDB + Deployment)
```

---

## 🚀 Programs Overview & How to Run

### 📍 Program 1: Browser-Based Interface (HTML, CSS, JavaScript)
- **Course Outcomes:** `CO1, CO2`
- **Features:**
  - Modern responsive UI (blue/white card theme).
  - DOM manipulation and event handling.
  - Regex input validation (10-digit contact number, alphanumeric roll number).
  - Fetch API with `async/await` simulating GET & POST requests.
  - Collapsible JSON request/response preview cards.
  - Real-time search and filter by pass type.
- **How to Run:**
  - Double click `program1/index.html` to open in any web browser, OR
  - Run the test suite:
    ```bash
    node program1/test_runner.js
    ```

---

### 📍 Program 2: React Application for Bus Pass Management
- **Course Outcome:** `CO3`
- **Features:**
  - Reusable functional components and JSX (`PassForm`, `PassList`, `PassCard`).
  - Controlled inputs with `useState` and validation error feedback.
  - React Router navigation (`/` for list, `/add` for new pass, `/edit/:id` for modifying pass).
  - Centralized state management using `PassContext` (`useContext`).
  - Persistent state synchronization using `useEffect` with `localStorage`.
- **How to Run:**
  ```bash
  cd program2
  # Run verification tests
  node test_runner.js
  # Or start Vite dev server (requires npm install)
  npm install
  npm run dev
  ```

---

### 📍 Program 3: Node.js Server-Side Utility (Without Express)
- **Course Outcome:** `CO4`
- **Features:**
  - Pure Node.js using core `http`, `fs`, `path`, and `events` modules.
  - Non-blocking data persistence using Readable and Writable Streams (`fs.createReadStream`, `fs.createWriteStream`).
  - Custom `EventEmitter` event bus publishing `pass:created` and `pass:deleted` events.
  - Native HTTP routes:
    - `GET /passes` — Fetch all passes.
    - `GET /passes/:id` — Fetch single pass.
    - `POST /passes` — Validate and create pass.
    - `DELETE /passes/:id` — Delete pass by ID.
- **How to Run:**
  ```bash
  cd program3
  # Run the stream and event test suite
  node test_runner.js
  # Or start the native HTTP server
  node server.js
  ```

---

### 📍 Program 4: Express.js REST API with JWT Authentication
- **Course Outcome:** `CO5`
- **Features:**
  - Express.js REST API with full CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`).
  - Custom middleware pipeline:
    - Request logging middleware (method, URL, status, response time).
    - Input validation middleware.
    - Centralized 4-argument error handler.
    - Protected route authentication middleware using JWT.
  - User registration and login with `bcryptjs` password hashing (salt rounds = 10).
- **API Endpoints:**
  | Method | Endpoint | Protection | Description |
  | :---: | :--- | :---: | :--- |
  | `POST` | `/api/auth/register` | Public | Register user with hashed password |
  | `POST` | `/api/auth/login` | Public | Login and receive signed JWT |
  | `GET` | `/api/passes` | JWT Protected | Get all passes |
  | `GET` | `/api/passes/:id` | JWT Protected | Get single pass |
  | `POST` | `/api/passes` | JWT Protected | Create new pass |
  | `PUT` | `/api/passes/:id` | JWT Protected | Update pass |
  | `DELETE` | `/api/passes/:id` | JWT Protected | Delete pass |
- **How to Run:**
  ```bash
  cd program4
  # Run API test runner
  node test_runner.js
  # Or start Express server (requires npm install)
  npm install
  node server.js
  ```

---

### 📍 Program 5: Full-Stack Integration (React + Express + MongoDB)
- **Course Outcome:** `CO6`
- **Features:**
  - Full-stack MERN architecture.
  - MongoDB Mongoose Schemas:
    - `Pass`: studentName, rollNo (unique), route, busNo, passType (enum), contactNo (regex), owner.
    - `User`: username, email, password with `pre('save')` bcrypt hashing hook.
  - React frontend with Axios client and request interceptors automatically attaching `Authorization: Bearer <token>`.
  - Global `AuthContext` for authentication lifecycle and route protection (`ProtectedRoute`).
  - Complete deployment configuration for **Vercel** (frontend) and **Render** (backend).
- **Deployment Documentation:** See `program5/DEPLOYMENT.md` for step-by-step instructions.
- **How to Run:**
  ```bash
  cd program5
  # Run full-stack integration and schema test suite
  node test_runner.js
  ```

---

## 👨‍💻 Student Details
- **Roll No:** 14
- **Branch:** B.E. Artificial Intelligence & Data Science (AI & DS)
- **Semester:** V
- **Subject:** Full Stack Development: Web Dev
