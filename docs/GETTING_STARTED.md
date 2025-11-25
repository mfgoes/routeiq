# 🚀 RouteIQ - Getting Started

**Get RouteIQ running locally in under 10 minutes.**

## Prerequisites

✅ **Node.js 18+** - [Download](https://nodejs.org/)
✅ **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
✅ **pnpm** (recommended) - `npm install -g pnpm`

## What's Been Built

**Backend (100% Complete):**
- ✅ Express API with 16 endpoints
- ✅ PostgreSQL database + Prisma ORM
- ✅ JWT authentication system
- ✅ Routes, Activities, Stats APIs
- ✅ 22 exercises pre-seeded

**Frontend (~40% Complete):**
- ✅ Next.js 14 with TypeScript
- ✅ Login/Register pages
- ✅ Dashboard with stat cards
- ✅ Activity logging and history
- ✅ Routes list page
- 🚧 Route creation UI (needs map integration)
- 🚧 Charts/visualizations

## Quick Start (5 Minutes)

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd routeiq

# Install backend
cd backend && pnpm install

# Install frontend
cd ../frontend && pnpm install
```

### Step 2: Start Database

**For local development**, use Docker:

```bash
# From project root
docker compose up -d

# Verify it's running
docker compose ps
```

**Note:** The production deployment uses Supabase (PostgreSQL) hosted separately. See [DEPLOYMENT_SUMMARY.md](../DEPLOYMENT_SUMMARY.md) for production setup.

### Step 3: Setup Backend

```bash
cd backend

# Copy environment file (defaults work for local dev)
cp .env.example .env

# Run migrations and seed data
pnpm prisma migrate dev
pnpm prisma db seed

# Start server (leave this running)
pnpm dev
```

Backend runs on **http://localhost:3001** ✅

### Step 4: Start Frontend

Open a **new terminal**:

```bash
cd frontend

# Copy environment file
cp .env.local.example .env.local

# Start dev server (leave this running)
pnpm dev
```

Frontend runs on **http://localhost:3000** ✅

### Step 5: Test the App

1. Open **http://localhost:3000**
2. Login with demo account:
   - Email: `demo@routeiq.com`
   - Password: `password123`
3. Explore the dashboard and log an activity!

## 📂 Project Structure Overview

```
routeiq/
├── backend/                    # API server (READY)
│   ├── src/
│   │   ├── controllers/        # Auth controller working ✅
│   │   ├── routes/             # API routes defined ✅
│   │   ├── middleware/         # Auth & error handling ✅
│   │   └── index.js           # Server entry point ✅
│   ├── prisma/
│   │   ├── schema.prisma      # Full database schema ✅
│   │   └── seed.js            # 22 exercises seeded ✅
│   └── package.json           # Dependencies defined ✅
│
├── frontend/                   # Next.js app (TODO)
│   └── (needs setup)
│
├── docs/                       # Documentation ✅
│   ├── ROADMAP.md             # Product roadmap
│   ├── DATABASE_SCHEMA.md     # Complete schema docs
│   ├── CLAUDE.md              # Project strategy
│   └── SETUP.md               # Detailed setup guide
│
└── docker-compose.yml         # PostgreSQL setup ✅
```

## 🧪 Test the Authentication Flow

1. **Register a user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password123"}'
```

3. **Copy the `token` from the response**

4. **Test authenticated endpoint:**
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗄️ Database Schema Highlights

**Users & Auth:**
- `users` - User accounts with subscription tiers
- `user_settings` - Preferences (units, fitness level, goals)
- `strava_connections` - OAuth tokens for Strava sync

**Running:**
- `routes` - Saved running routes (GeoJSON geometry)
- `activities` - Completed runs with metrics

**Workouts (Phase 3):**
- `exercises` - 22 exercises pre-seeded
- `workouts` - Workout sessions
- `workout_exercises` - Sets/reps/weight data

**Analytics:**
- `goals` - Training goals
- `personal_records` - PRs for running & lifting

## 🎯 What's Working Now

✅ **Backend API Server**
- Express server with error handling
- CORS configured for frontend
- Rate limiting on auth endpoints
- Helmet security headers

✅ **Authentication**
- Register new users
- Login with JWT tokens
- Protected routes middleware
- Password hashing with bcrypt

✅ **Database**
- Full schema designed
- Prisma ORM configured
- Migrations ready
- Seed data (exercises)

## What's Working Now

✅ Complete user authentication (register/login)
✅ Activity logging with 10+ metrics
✅ Dashboard with real-time stats
✅ Activity history and filtering
✅ Routes list and filtering
✅ Responsive design (mobile/tablet/desktop)

## What's Missing (See TODO.md)

🚧 Map-based route creation (Leaflet integration needed)
🚧 Public route discovery
🚧 Dashboard charts (Recharts installed but unused)
🚧 Activity detail pages
🚧 Strava OAuth integration (0%)
🚧 User settings page

## 💡 Development Tips

**View Database:**
```bash
cd backend
pnpm prisma studio
# Opens GUI at http://localhost:5555
```

**Reset Database:**
```bash
cd backend
pnpm prisma migrate reset
# WARNING: Deletes all data!
```

**Check Logs:**
```bash
# Backend logs show in terminal where you ran `pnpm dev`
# PostgreSQL logs:
docker compose logs postgres
```

**Common Issues:**

1. **"Port 3001 already in use"**
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **"Can't connect to database"**
   ```bash
   # Check Docker is running
   docker compose ps

   # Restart containers
   docker compose restart
   ```

3. **"Prisma client not generated"**
   ```bash
   cd backend
   pnpm prisma generate
   ```

## Deployment

**Production URLs:**
- **Frontend:** https://routeiq-nine.vercel.app
- **Backend API:** https://routeiq-backend.vercel.app/api
- **Platform:** Vercel (serverless functions)
- **Database:** Supabase (PostgreSQL)

**Deployment Process:**
- Automatic deployment on push to `main` branch
- See [DEPLOYMENT_SUMMARY.md](../DEPLOYMENT_SUMMARY.md) for full details

## Documentation

- **[DEPLOYMENT_SUMMARY.md](../DEPLOYMENT_SUMMARY.md)** - Complete deployment guide
- **[README.md](README.md)** - Project overview
- **[TODO.md](docs/TODO.md)** - Detailed implementation roadmap
- **[ROADMAP.md](docs/ROADMAP.md)** - Product phases and vision
- **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Complete schema
- **[SETUP.md](docs/SETUP.md)** - Detailed setup + troubleshooting
- **[backend/API_EXAMPLES.md](backend/API_EXAMPLES.md)** - API documentation

## Need Help?

**Common Issues:**
- "Cannot connect to database" → `docker compose restart`
- "Port already in use" → `lsof -ti:3001 | xargs kill -9`
- "Prisma client error" → `cd backend && pnpm prisma generate`

See [docs/SETUP.md](docs/SETUP.md) for detailed troubleshooting.

---

**Happy running! 🏃‍♂️** Built with Node.js, Next.js, PostgreSQL, and Prisma.
