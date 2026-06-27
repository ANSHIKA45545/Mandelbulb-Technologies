# TaskFlow

A full-stack task and project management application — a lightweight Trello/Asana built with React, Node.js, Express, and PostgreSQL.

![TaskFlow](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node-Express-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## Features

- **Authentication** — Register, login
- **Boards** — Create, rename, delete project boards with task counts
- **Board** — To Do / In Progress / Done columns with drag-and-drop
- **Tasks** — Full CRUD with priority, due dates, effort estimates
- **Analytics** — Task stats by status, priority, and overdue count
- **Dark Mode** — Toggle with persisted preference
- **Responsive** — Mobile, tablet, and desktop layouts

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, React Router,  Tailwind CSS, Recharts, Axios |
| Backend | Node.js, Express, Prisma ORM,  bcryptjs, JWT |
| Database | PostgreSQL |
| AI | Google Gemini 2.0 |


## Screenshots

<img width="1920" height="1020" alt="TaskFlow — Project Management - Google Chrome 27-06-2026 22_21_51" src="https://github.com/user-attachments/assets/dc184eb1-e7ba-4f93-93f8-6df629ee7efa" />



## Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- **Database** — one of:
  - **Easiest (no install):** Prisma local Postgres via `npm run db:start` (built into backend)
  - **Docker:** `docker compose up -d` from project root
  - **Cloud:** Free [Neon](https://neon.tech)  PostgreSQL

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
