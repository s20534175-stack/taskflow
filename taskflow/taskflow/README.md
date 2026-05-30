# TaskFlow — Task Manager App

> Intern Assignment — INDPRO | Built with React + Node.js + MongoDB

A clean, full-stack Task Manager where users can manage tasks across three stages: **Todo**, **In Progress**, and **Done**.

---

## Live Demo

- **Frontend:** [Your Vercel/Netlify URL here]
- **Backend API:** [Your Render/Railway URL here]

---

## Features

### Core
- **Authentication** — Secure register & login with JWT tokens (7-day sessions)
- **Task Management** — Create, edit, delete tasks with full CRUD
- **Three-Stage Kanban Board** — Todo → In Progress → Done
- **Priority Levels** — Low, Medium, High with color indicators
- **Quick Stage Move** — Move tasks between columns directly from the card

### UI/UX
- Dark-themed, responsive design
- Real-time search with debounce
- Priority filter
- Loading skeletons (no jarring blank states)
- Error states with retry
- Progress bar showing overall completion rate
- Toast notifications for all actions
- Keyboard shortcut: `Esc` to close modals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Styling | Pure CSS with CSS Variables (no UI library) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (DB) |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   └── Task.js          # Task schema (title, description, stage, priority)
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login, GET /me
│   │   └── tasks.js         # Full CRUD + PATCH /stage
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── server.js            # Express app entry point
│   └── .env.example
│
└── frontend/
    └── src/
        ├── api/index.js     # Axios instance + all API calls
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx    # Main kanban board
        ├── components/
        │   ├── Navbar.jsx       # Top nav with stats + profile
        │   ├── KanbanColumn.jsx # Per-stage column
        │   ├── TaskCard.jsx     # Individual task card
        │   └── TaskModal.jsx    # Create / edit modal
        └── App.jsx              # Routes + protected route guards
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |

### Tasks (all require Bearer token)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (supports `?search=&stage=&priority=`) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/stage` | Quick stage update |

---

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas free tier)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
# Runs on http://localhost:3000
```

---

## Deployment

### Frontend — Vercel
1. Push repo to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend — Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — any long random string
   - `FRONTEND_URL` — your Vercel frontend URL

### Database — MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user with read/write access
3. Allow all IPs (`0.0.0.0/0`) in Network Access
4. Copy connection string into `MONGO_URI`

---

## Assumptions & Technical Decisions

- **JWT stored in localStorage** — Simple approach for this scope. For production, httpOnly cookies would be more secure.
- **No drag-and-drop** — Used a "Move" button instead to keep the UI clean and accessible without adding a large dependency.
- **Tasks are user-scoped** — Every DB query filters by `user: req.user._id`, so users can never see each other's tasks.
- **Debounced search** — 400ms debounce prevents excessive API calls while typing.
- **Loading skeletons over spinners** — Provides a better perceived performance experience.
- **express-validator** — Chosen over Joi for its tight Express integration and smaller footprint.
- **Vite** — Much faster dev experience than CRA for this project size.

---

## What I'd Add With More Time

- Drag-and-drop between columns
- Due dates with overdue indicators
- Task comments / activity log
- Dark/Light mode toggle
- Team workspaces
- Email notifications

---

*Built for the INDPRO Internship Assignment — submission by 1st June 2026*
