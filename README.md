# TaskFlow

A full-stack task and project management application — a lightweight Trello/Asana built with React, Node.js, Express, and PostgreSQL.

![TaskFlow](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node-Express-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## Features

- **Authentication** — Register, login, JWT-based sessions, protected routes
- **Boards** — Create, rename, delete project boards with task counts
- **Kanban Board** — To Do / In Progress / Done columns with drag-and-drop
- **Tasks** — Full CRUD with priority, due dates, effort estimates
- **AI Assistant** — Smart due-date & effort suggestions via Google Gemini (server-side)
- **Analytics** — Task stats by status, priority, and overdue count
- **Dark Mode** — Toggle with persisted preference
- **Responsive** — Mobile, tablet, and desktop layouts

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, React Router, TanStack Query, Tailwind CSS, @dnd-kit, Recharts, Axios |
| Backend | Node.js, Express, Prisma ORM, express-validator, bcryptjs, JWT |
| Database | PostgreSQL |
| AI | Google Gemini 2.0 Flash (free tier) |

## Live Demo

> Deploy frontend to Vercel/Netlify and backend to Render/Railway. Update these URLs after deployment.

- **Frontend:** `https://your-frontend.vercel.app`
- **Backend:** `https://your-backend.onrender.com`

**Test credentials** (create after deployment or use locally):
- Email: `demo@taskflow.com`
- Password: `demo123`

## Screenshots

Add screenshots of Login, Dashboard, Board view, and Mobile view here after running the app.

## Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- **Database** — one of:
  - **Easiest (no install):** Prisma local Postgres via `npm run db:start` (built into backend)
  - **Docker:** `docker compose up -d` from project root
  - **Cloud:** Free [Neon](https://neon.tech) or [Supabase](https://supabase.com) PostgreSQL

### 1. Clone & install

```bash
git clone <your-repo-url>
cd taskflow

# Backend
cd backend
cp .env.example .env
npm install

# Start local PostgreSQL (no Docker/install needed)
npm run db:start
npm run db:sync      # writes DATABASE_URL to .env
npm run db:push      # creates tables

npm run dev

# Frontend (new terminal)
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

> **Troubleshooting:** If you see `Can't reach database server at localhost:5432`, PostgreSQL is not running. Use `npm run db:start` in the `backend` folder, then `npm run db:sync` and restart the backend (`npm run dev`).

**Alternative — Docker:**

```bash
docker compose up -d
# Set DATABASE_URL in backend/.env to:
# postgresql://taskflow:taskflow@localhost:5432/taskflow?schema=public
```

### 2. Environment variables

**Backend (`backend/.env`)**

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default: 5000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL for CORS |
| `GEMINI_API_KEY` | Google Gemini API key ([get one free](https://aistudio.google.com/apikey)) |

**Frontend (`frontend/.env`)**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5000/api`) |

### 3. Run

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## AI Feature

**Provider:** Google Gemini 2.0 Flash

**Why Gemini?** Generous free tier, fast responses, easy JSON output, and no credit card required for development.

**How it works:**
1. User clicks **Suggest estimate** when creating/editing a task
2. Frontend sends title + description to `POST /api/ai/suggest-estimate`
3. Backend calls Gemini with a structured prompt
4. Returns `{ estimatedEffort, suggestedDueDate, reasoning }`
5. User can **Accept** (pre-fills fields) or ignore

If `GEMINI_API_KEY` is missing or the API fails, a friendly fallback estimate is returned so the app keeps working.

## API Documentation

Base URL: `/api`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user (protected) |

### Boards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/boards` | List user's boards |
| POST | `/boards` | Create board |
| GET | `/boards/:id` | Get single board |
| PUT | `/boards/:id` | Update board |
| DELETE | `/boards/:id` | Delete board |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/boards/:boardId/tasks` | List tasks (`?priority=&sort=`) |
| POST | `/boards/:boardId/tasks` | Create task |
| PUT | `/boards/:boardId/tasks/:id` | Update task |
| PATCH | `/boards/:boardId/tasks/:id/move` | Move task (status/position) |
| DELETE | `/boards/:boardId/tasks/:id` | Delete task |
| GET | `/boards/:boardId/tasks/stats` | Task analytics |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/suggest-estimate` | Get AI effort/due-date suggestion |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health check |

## Project Structure

```
taskflow/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── index.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       └── utils/
├── docker-compose.yml
└── README.md
```

## Deployment

### Backend (Render / Railway)

1. Create a PostgreSQL database (Neon, Supabase, or Render Postgres)
2. Set environment variables
3. Build command: `npm install && npx prisma generate && npx prisma db push`
4. Start command: `npm start`

### Frontend (Vercel / Netlify)

1. Set `VITE_API_URL` to your deployed backend URL + `/api`
2. Build command: `npm run build`
3. Output directory: `dist`

## Known Issues & Future Improvements

- Drag-and-drop reordering within the same column is basic (position updates on cross-column moves only)
- No real-time collaboration or board sharing
- Would add: email notifications, activity log, global search, pagination, and integration tests

## License

MIT
