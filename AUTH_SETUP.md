# TalentFlow Full-Stack Authentication Setup

This project now has:
- Frontend auth integration in the existing React + TypeScript app.
- A separate `backend` folder for Node.js + Express + MongoDB + JWT APIs.

## 1) Backend setup

1. Open terminal in `backend`.
2. Install dependencies:
   - `npm install`
3. Copy env file:
   - `copy .env.example .env` (Windows)
4. Update `backend/.env` values:
   - `MONGODB_URI` (local MongoDB or Atlas connection string)
   - `JWT_SECRET` (long random secret)
   - `CLIENT_URL` should be `http://localhost:5173`
5. Start backend:
   - `npm run dev`

Backend runs on `http://localhost:5000`.

## 2) Frontend setup

1. In project root, copy env:
   - `copy .env.example .env` (Windows)
2. Confirm:
   - `VITE_API_BASE_URL=http://localhost:5000`
3. Run frontend:
   - `npm install`
   - `npm run dev`

Frontend runs on `http://localhost:5173`.

## 3) Auth APIs

- `POST /api/auth/register`
  - body: `{ "username": "John Doe", "email": "john@example.com", "password": "secret123", "role": "Recruiter" }`
  - public registration roles allowed: `Recruiter`, `Hiring Manager`, `Viewer`
  - `Admin` is blocked from public registration
- `POST /api/auth/login`
  - body: `{ "email": "john@example.com", "password": "secret123" }`

Both return:
`{ "token": "...jwt...", "user": { "id": "...", "username": "...", "email": "...", "role": "Recruiter" } }`

## 4) What was integrated in frontend

- Register and login now call backend APIs.
- JWT token is stored in localStorage key `tf_token`.
- User profile is stored in localStorage key `tf_user`.
- Role is stored in MongoDB and included in JWT/user response.
- Protected routes already enforced through auth context.
- Logout clears token + user and sends back to login page.
- Username and role shown dynamically in sidebar/header.
- Sidebar menu + route access are role-based (RBAC).
- Existing UI look and layout remain unchanged.
