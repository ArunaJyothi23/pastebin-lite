# Pastebin-Lite

A simple Pastebin-like web application built with Node.js (Express backend) + React (Vite + Material UI frontend) and PostgreSQL (via Neon serverless).

Users can:
- Create text pastes with optional TTL (time-to-live in seconds) and max views limit
- Get a shareable URL
- View the paste (content expires based on time or view count)

## Features Implemented
- Create paste: POST /api/pastes
- View paste: GET /api/pastes/:id (counts as view)
- Expiry: time-based (ttl_seconds) and view-based (max_views)
- Server-side enforcement: paste deleted on expiry
- Health check: GET /api/healthz
- Deterministic testing support (TEST_MODE=1 + x-test-now-ms header)
- Safe content rendering (no script execution)
- Beautiful dark-mode Material UI interface

## Tech Stack
- **Backend**: Node.js, Express, @neondatabase/serverless, PostgreSQL (Neon)
- **Frontend**: React, Vite, Material UI, Axios
- **Database**: Neon serverless PostgreSQL
- **Deployment**: Vercel

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
2. Backend Setup
   cd backend
   npm install
   Create .env file in backend/ folder:text
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-your-project.neon.tech/neondb?sslmode=require
   PORT=3000
   BASE_URL=http://localhost:5173
Start the backend:----> npm run dev
Backend runs on http://localhost:3000
3. Frontend Setup
   cd frontend
   npm install
   npm run dev
   Open http://localhost:5173 in your browser to use the app.