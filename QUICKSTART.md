# 🚀 RouteIQ - Quick Start Guide

**Get RouteIQ running locally in 5 minutes!**

---

## Prerequisites

✅ **Node.js 18+** - [Download](https://nodejs.org/)
✅ **Docker** - [Download](https://www.docker.com/products/docker-desktop/) (for PostgreSQL)
✅ **pnpm** (optional but recommended) - `npm install -g pnpm`

---

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd routeiq

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

---

## Step 2: Start PostgreSQL

```bash
# From project root
docker compose up -d

# Verify it's running
docker compose ps
# Should show postgres as "Up"
```

---

## Step 3: Setup Backend Database

```bash
cd backend

# Copy environment file
cp .env.example .env

# Run database migrations
pnpm prisma migrate dev

# Seed database with exercises and demo user
pnpm prisma db seed

# You should see:
# ✅ Seeded 22 exercises
# ✅ Created demo user: demo@routeiq.com
```

---

## Step 4: Start Backend Server

```bash
# Still in backend/
pnpm dev

# You should see:
# 🚀 RouteIQ Backend running on http://localhost:3001
# 📝 Environment: development
# 🔐 CORS enabled for: http://localhost:3000
```

**Keep this terminal open!**

---

## Step 5: Setup Frontend

Open a **new terminal**:

```bash
cd frontend

# Copy environment file
cp .env.local.example .env.local

# No need to edit - defaults work for local development
```

---

## Step 6: Start Frontend Server

```bash
# Still in frontend/
pnpm dev

# You should see:
# ▲ Next.js 14.0.4
# - Local:        http://localhost:3000
# ✓ Ready in 2.5s
```

---

## Step 7: Test It! 🎉

1. **Open browser:** http://localhost:3000

2. **Login with demo account:**
   - Email: `demo@routeiq.com`
   - Password: `password123`

3. **Or create new account:**
   - Click "Sign up"
   - Fill in your details
   - Click "Create account"

4. **Explore the app:**
   - 📊 View dashboard (will be empty for new accounts)
   - 🏃 Click "Log Activity" to add your first run
   - 📈 See stats update in real-time!

---

## Quick Test Run

Log your first activity:

1. Click **"+ Log Activity"** (top right on dashboard or activities page)

2. Fill in the form:
   - Distance: `5` km
   - Duration: `30` minutes
   - Date/Time: Today
   - (Optional) Add pace, heart rate, notes, etc.

3. Click **"Save Activity"**

4. Return to **Dashboard** → See your stats!
   - Total Runs: 1
   - Total Distance: 5.0 km
   - Total Time: 30m
   - Average Pace: 6:00 /km

---

## Troubleshooting

### "Cannot connect to database"

```bash
# Check Docker is running
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# Check logs
docker compose logs postgres
```

### "Port 3001 already in use"

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in backend/.env
PORT=3002
```

### "Port 3000 already in use"

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
pnpm dev -p 3001
```

### "Prisma client not generated"

```bash
cd backend
pnpm prisma generate
```

### Frontend shows "Network Error"

- ✅ Check backend is running on :3001
- ✅ Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- ✅ Clear browser cache and reload

---

## What You Can Do Now

### ✅ Fully Functional
- Create account / Login
- Log running activities (distance, pace, HR, etc.)
- View activity history
- See statistics (week/month/year/all-time)
- Period filtering on dashboard

### 🚧 Coming Soon
- Map visualization for routes
- Route creation with drawing
- Workout tracking (Phase 3)
- Cross-training insights (Phase 4)

---

## Useful Commands

### Backend

```bash
cd backend

# Start server
pnpm dev

# View database in GUI
pnpm prisma studio
# Opens at http://localhost:5555

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Run tests
pnpm test
```

### Frontend

```bash
cd frontend

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## API Documentation

Full API documentation with curl examples: **`backend/API_EXAMPLES.md`**

Quick test:

```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Save the token from response
export TOKEN="your-token-here"

# Test authenticated endpoint
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Project Structure

```
routeiq/
├── backend/              # Node.js + Express API
│   ├── src/             # Controllers, routes, middleware
│   ├── prisma/          # Database schema & migrations
│   └── package.json
│
├── frontend/            # Next.js 14 app
│   ├── src/
│   │   ├── app/        # Pages (login, dashboard, etc.)
│   │   ├── components/ # React components
│   │   ├── lib/        # API client
│   │   └── store/      # State management
│   └── package.json
│
├── docs/               # Documentation
├── static-landing/     # Static HTML marketing site
└── docker-compose.yml  # PostgreSQL setup
```

---

## What's Different from Generic Apps?

RouteIQ focuses on **running optimization** with a unique hybrid approach:

1. **Primary:** Running route optimization & activity tracking
2. **Secondary:** Workout tracking for cross-training
3. **Unique:** Phase 4 will show how your gym gains impact your running pace!

**Example insight (Phase 4):**
> "Your squat strength increased 15% this month. Your hill running pace improved by 8%. Keep up the leg work! 💪→🏃"

---

## Next Steps

1. ✅ **You're running!** Explore the app
2. 📖 **Read the docs:**
   - `ROADMAP.md` - Full product roadmap
   - `DATABASE_SCHEMA.md` - Database design
   - `PHASE1_COMPLETE.md` - What's been built
   - `FRONTEND_COMPLETE.md` - Frontend features

3. 🚀 **Deploy it:**
   - Vercel (frontend)
   - Railway (backend)
   - See deployment guides in docs

4. 🏃 **Use it:**
   - Log some runs
   - Track your progress
   - Test all features

5. 💪 **Extend it:**
   - Add maps (Phase 1)
   - Build workout tracking (Phase 3)
   - Implement insights (Phase 4)

---

## Need Help?

- 📖 Check `GETTING_STARTED.md` for detailed setup
- 📊 See `API_EXAMPLES.md` for API usage
- 🐛 Check "Troubleshooting" section above
- 💬 Open an issue on GitHub

---

**Happy running! 🏃‍♂️📊**

Built with ❤️ using Node.js, Next.js, PostgreSQL, and Prisma.
