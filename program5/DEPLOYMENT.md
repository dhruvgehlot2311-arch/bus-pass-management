# Bus Pass Management System — Deployment Guide

> **Roll No:** 14 | **Subject:** Full Stack Development: Web Dev  
> **Program:** 5 of 5 — React + Express + MongoDB (Mongoose)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Deploy Backend to Render](#deploy-backend-to-render)
4. [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
5. [Environment Variable Reference](#environment-variable-reference)
6. [CORS Configuration Notes](#cors-configuration-notes)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| Node.js | 18.x LTS | Runtime for both dev and build |
| npm / pnpm | 8.x / 8.x | Package management |
| Git | any | Version control / deployment trigger |
| MongoDB Atlas account | — | Hosted MongoDB cluster |
| Render account | — | Backend hosting |
| Vercel account | — | Frontend hosting |

---

## Local Development Setup

### 1. Clone or navigate to the project

```bash
cd C:/Users/dhruv/.gemini/antigravity/scratch/bus-pass-management/program5
```

### 2. Set up the backend

```bash
cd backend
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `backend/.env`:
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/buspass
JWT_SECRET=change_me_to_a_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
npm run dev      # uses nodemon for hot-reload
# OR
npm start        # plain node
```

You should see:
```
✅  MongoDB connected successfully.
🚀  Server is running on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install

cp .env.example .env
# .env already points to http://localhost:5000, no change needed for local dev
```

Start Vite:
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

> [!NOTE]
> Vite's proxy config (`vite.config.js`) forwards `/api/*` requests to `http://localhost:5000`,
> so the frontend talks to the backend without any CORS issues during development.

---

## Deploy Backend to Render

### Step 1 — Push backend code to GitHub

```bash
# From the project root
git init
git add .
git commit -m "feat: Bus Pass Management Program 5"
git remote add origin https://github.com/<your-username>/bus-pass-backend.git
git push -u origin main
```

### Step 2 — Create a new Web Service on Render

1. Go to [https://render.com](https://render.com) and sign in.
2. Click **New → Web Service**.
3. Connect your GitHub repository.
4. Configure the service:

| Field | Value |
|-------|-------|
| **Name** | `bus-pass-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `program5/backend` (if the repo contains the whole project) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free (suitable for a demo) |

### Step 3 — Add Environment Variables on Render

In the Render dashboard → **Environment** tab, add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/buspass` |
| `JWT_SECRET` | A long random string (use a password generator) |
| `PORT` | `5000` (Render also injects its own `PORT`; keep this for safety) |
| `CLIENT_URL` | Your Vercel frontend URL (e.g. `https://bus-pass.vercel.app`) |
| `NODE_ENV` | `production` |

> [!IMPORTANT]
> Set `CLIENT_URL` to the **exact** Vercel URL (with no trailing slash) after you deploy
> the frontend. You may need to update this value and redeploy the backend if the
> Vercel URL changes.

### Step 4 — Deploy

Click **Create Web Service**. Render pulls the code, runs `npm install`, and starts the server.

Your backend URL will be: `https://bus-pass-backend.onrender.com`

> [!TIP]
> Render's free tier spins down after 15 minutes of inactivity.
> The first request after a cold start may take ~30 seconds.
> Use [UptimeRobot](https://uptimerobot.com) to ping `/api/health` every 5 minutes
> and keep it warm.

---

## Deploy Frontend to Vercel

### Step 1 — Push frontend code to GitHub

If the frontend lives in the same repo:
```bash
git push origin main
```

Or create a separate frontend repo and push there.

### Step 2 — Import the project on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. Click **Add New → Project**.
3. Import your GitHub repository.
4. Configure the project:

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `program5/frontend` (if monorepo) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3 — Add Environment Variables on Vercel

In the Vercel project → **Settings → Environment Variables**, add:

| Key | Value | Environments |
|-----|-------|-------------|
| `VITE_API_URL` | `https://bus-pass-backend.onrender.com` | Production, Preview |

> [!WARNING]
> Vite only exposes variables that start with `VITE_` to the browser bundle.
> Never put secrets (JWT_SECRET, DB passwords) in Vercel env vars — they would
> be visible in the compiled JavaScript.

### Step 4 — Deploy

Click **Deploy**. Vercel installs dependencies, runs `npm run build`, and serves the
`dist/` folder from its global CDN.

Your frontend URL will be: `https://bus-pass-management.vercel.app`

### Step 5 — Update CORS on the backend

Go back to Render and update the `CLIENT_URL` env var to the exact Vercel URL:
```
CLIENT_URL=https://bus-pass-management.vercel.app
```

Then click **Manual Deploy → Deploy latest commit** to restart with the new config.

---

## Environment Variable Reference

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pw@cluster.mongodb.net/buspass` |
| `JWT_SECRET` | Signing secret for JSON Web Tokens | `s3cur3_r4nd0m_str1ng_32chars` |
| `PORT` | Port the Express server binds to | `5000` |
| `CLIENT_URL` | Allowed CORS origin (frontend URL) | `https://bus-pass.vercel.app` |
| `NODE_ENV` | App environment (`development` / `production`) | `production` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for all API requests | `https://bus-pass-backend.onrender.com` |

---

## CORS Configuration Notes

CORS (Cross-Origin Resource Sharing) is configured in `backend/server.js`:

```js
app.use(
  cors({
    origin:      process.env.CLIENT_URL,   // only the listed frontend URL is allowed
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

**Key points:**

1. **Single origin** — only the URL in `CLIENT_URL` can make cross-origin requests.
   If you deploy to multiple domains (e.g., preview URLs on Vercel) you can extend
   this to an array:
   ```js
   origin: [process.env.CLIENT_URL, 'https://bus-pass-preview.vercel.app']
   ```

2. **`credentials: true`** — required so that the browser forwards the
   `Authorization` header with every request.

3. **Vite proxy in development** — during local dev, Vite proxies `/api` calls so
   the browser never makes a cross-origin request at all. CORS errors during local
   dev are therefore a misconfiguration of `vite.config.js`, not the Express server.

4. **Pre-flight requests** — `OPTIONS` is included in `methods` so the browser's
   preflight check succeeds for `PUT` and `DELETE` requests.

5. **Render + Vercel origins** — Render backend URLs follow the pattern
   `https://<service-name>.onrender.com`; Vercel URLs follow
   `https://<project-name>.vercel.app`. Make sure `CLIENT_URL` matches the Vercel
   URL **exactly** (no trailing slash, correct scheme).

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas whitelist updated: **Network Access → 0.0.0.0/0** (allow all IPs for Render)
- [ ] `MONGODB_URI` confirmed working: check Render logs for `✅ MongoDB connected`
- [ ] `CLIENT_URL` on Render matches the live Vercel URL
- [ ] `VITE_API_URL` on Vercel matches the live Render URL
- [ ] Register a new user and log in via the deployed Vercel URL
- [ ] Create, edit, and delete a bus pass end-to-end
- [ ] Check browser DevTools → Network tab: no CORS errors on API calls
- [ ] (Optional) Set up UptimeRobot to ping `/api/health` every 5 minutes

---

*Generated for Bus Pass Management System — Program 5 of 5*
