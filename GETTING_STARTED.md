# Getting Started with RouteIQ Development

## ✅ What's Been Set Up

The project structure is now ready with:

- ✅ Backend API (Express + Prisma + PostgreSQL)
- ✅ Authentication system (JWT-based register/login)
- ✅ Database schema (Prisma) with all tables designed
- ✅ Seed data (22 exercises for gym tracking)
- ✅ Docker Compose for PostgreSQL
- ✅ Error handling & middleware
- ✅ Project documentation

## 🚀 Next Steps to Get Running

### 1. Install Prerequisites

```bash
# Install Node.js 18+ (if not installed)
# Download from: https://nodejs.org/

# Check version
node --version  # Should be v18+

# Install pnpm (recommended package manager)
npm install -g pnpm

# Install Docker Desktop (for PostgreSQL)
# Download from: https://www.docker.com/products/docker-desktop/
```

### 2. Start PostgreSQL Database

```bash
# Option A: Using Docker (recommended)
docker compose up -d

# Option B: Install PostgreSQL locally
# macOS: brew install postgresql@14
# Then: brew services start postgresql@14
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Edit .env if needed (default values work for Docker setup)
# DATABASE_URL="postgresql://routeiq:password@localhost:5432/routeiq_dev"
# JWT_SECRET="your-super-secret-key-change-in-production-min-32-chars"

# Run database migrations
pnpm prisma migrate dev

# Seed database with exercises and demo user
pnpm prisma db seed

# Start development server
pnpm dev
```

The backend should now be running on **http://localhost:3001**

### 4. Test the API

```bash
# Open a new terminal and test health check
curl http://localhost:3001/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}
```

### 5. Register a Test User

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "password": "password123",
    "firstName": "Your Name"
  }'

# You should get back a user object and JWT token
```

### 6. View Your Database

```bash
cd backend

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Opens in browser at http://localhost:5555
# You can view and edit all data here
```

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

## 🚧 What's Next

### Immediate (Phase 1 MVP):
1. **Routes API** - Create/list/view running routes
2. **Activities API** - Log and view runs
3. **Frontend Setup** - Next.js app with dashboard
4. **Map Integration** - Display routes with Leaflet.js

### Soon (Phase 2-3):
5. **Workout Logging** - Implement workout tracking
6. **Statistics** - Dashboard with charts
7. **Strava Integration** - OAuth sync

### Later (Phase 4):
8. **Cross-Training Insights** - The magic correlation features

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

## 📖 Documentation

- **[README.md](README.md)** - Project overview
- **[ROADMAP.md](docs/ROADMAP.md)** - Full product roadmap
- **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Complete database docs
- **[SETUP.md](docs/SETUP.md)** - Detailed setup guide

## 🎉 You're Ready!

Once you have PostgreSQL running and dependencies installed:

```bash
cd backend
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

Then test with:
```bash
curl http://localhost:3001/health
```

If you see `{"status":"ok"...}`, you're all set! 🚀

---

**Questions?** Check the docs/ folder or open an issue.
