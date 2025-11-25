# RouteIQ Development Setup

## Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **ORM:** Prisma
- **Auth:** JWT (jsonwebtoken + bcrypt)
- **Validation:** Zod
- **API Testing:** Jest + Supertest

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS (already in use)
- **State Management:** React Context + Zustand
- **Maps:** Leaflet.js + React-Leaflet
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### DevOps
- **Development:** Local PostgreSQL (PostgreSQL 14+) or Docker
- **Hosting:** Vercel (frontend + backend serverless functions)
- **Database:** Supabase (PostgreSQL with connection pooling)
- **CI/CD:** Automatic deployment via Vercel (push to main)
- **Monitoring:** Vercel Analytics + Logs

---

## Project Structure

```
routeiq/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helpers
│   │   └── index.js          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # SQL migrations
│   │   └── seed.js           # Seed data
│   ├── tests/
│   ├── scripts/
│   │   └── init-local-db.sh  # Database setup helper
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── routes/
│   │   │   ├── workouts/
│   │   │   └── ui/           # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities, API client
│   │   ├── store/            # State management
│   │   └── types/            # TypeScript types
│   ├── public/
│   │   └── assets/           # Move existing assets here
│   ├── package.json
│   └── next.config.js
│
├── docs/
│   ├── CLAUDE.md
│   ├── ROADMAP.md
│   └── DATABASE_SCHEMA.md
│
├── static-landing/            # Current HTML files (marketing site)
│   ├── index.html
│   ├── about.html
│   └── assets/
│
├── .gitignore
└── README.md
```

---

## Local Development Setup

### Prerequisites
```bash
# Install Node.js 18+
node --version  # Should be v18+

# Install PostgreSQL 14+
# macOS:
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian:
sudo apt-get install postgresql-14
sudo systemctl start postgresql

# Windows (with Chocolatey):
choco install postgresql14

# Install pnpm (faster than npm)
npm install -g pnpm
```

### Quick Start
```bash
# 1. Create local database
cd backend
./scripts/init-local-db.sh
# Or manually: createdb routeiq_dev

# 2. Setup backend
pnpm install
cp .env.example .env
# .env already configured for localhost
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev  # Starts on http://localhost:3001

# 3. Setup frontend (in new terminal)
cd ../frontend
pnpm install
cp .env.local.example .env.local
pnpm dev  # Starts on http://localhost:3000
```

### Environment Variables

**backend/.env**
```env
# Database
DATABASE_URL="postgresql://routeiq:password@localhost:5432/routeiq_dev"

# Auth
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
BCRYPT_ROUNDS=10

# API
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"

# External APIs (optional for MVP)
STRAVA_CLIENT_ID=""
STRAVA_CLIENT_SECRET=""
OPENWEATHER_API_KEY=""
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_MAPBOX_TOKEN="" # Optional for maps
```

---

## Database Commands

```bash
# Create new migration
pnpm prisma migrate dev --name description_of_change

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Generate Prisma client after schema changes
pnpm prisma generate

# Seed database with test data
pnpm prisma db seed
```

---

## Development Workflow

### Creating a New Feature

1. **Create database migration** (if needed)
   ```bash
   cd backend
   # Edit prisma/schema.prisma
   pnpm prisma migrate dev --name add_feature_x
   ```

2. **Create backend API**
   ```bash
   # Create route handler
   backend/src/routes/feature.routes.js

   # Create controller
   backend/src/controllers/feature.controller.js

   # Create service (business logic)
   backend/src/services/feature.service.js
   ```

3. **Create frontend components**
   ```bash
   # Create component
   frontend/src/components/feature/FeatureComponent.jsx

   # Add page
   frontend/src/app/feature/page.jsx
   ```

4. **Test**
   ```bash
   # Backend tests
   cd backend && pnpm test

   # Frontend (in browser)
   cd frontend && pnpm dev
   ```

---

## API Structure

### Authentication Endpoints
```
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Get JWT token
POST   /api/auth/logout            # Invalidate token
GET    /api/auth/me                # Get current user
PUT    /api/auth/me                # Update profile
POST   /api/auth/forgot-password   # Request reset
POST   /api/auth/reset-password    # Reset password
```

### Route Endpoints
```
GET    /api/routes                 # List user's routes
POST   /api/routes                 # Create new route
GET    /api/routes/:id             # Get route details
PUT    /api/routes/:id             # Update route
DELETE /api/routes/:id             # Delete route
GET    /api/routes/public          # Browse public routes
POST   /api/routes/generate        # AI-generate route
```

### Activity Endpoints
```
GET    /api/activities             # List activities
POST   /api/activities             # Log activity
GET    /api/activities/:id         # Activity details
PUT    /api/activities/:id         # Update activity
DELETE /api/activities/:id         # Delete activity
GET    /api/activities/stats       # Get statistics
```

### Workout Endpoints
```
GET    /api/workouts               # List workouts
POST   /api/workouts               # Create workout
GET    /api/workouts/:id           # Workout details
PUT    /api/workouts/:id           # Update workout
DELETE /api/workouts/:id           # Delete workout
GET    /api/exercises              # List exercises
POST   /api/exercises              # Create custom exercise
```

### Integration Endpoints
```
GET    /api/integrations/strava/connect      # OAuth redirect
GET    /api/integrations/strava/callback     # OAuth callback
POST   /api/integrations/strava/sync         # Sync activities
DELETE /api/integrations/strava/disconnect   # Remove connection
```

---

## Deployment

Both frontend and backend are deployed on **Vercel** with automatic deployments from the `main` branch.

### Backend (Vercel Serverless)
- **Platform:** Vercel Serverless Functions
- **URL:** https://routeiq-backend.vercel.app
- **Root Directory:** `/backend`
- **Build Command:** `npm run vercel-build` (generates Prisma Client)
- **Deployment:** Automatic on push to `main`

**Environment Variables (set in Vercel Dashboard):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://[user]:[password]@[host]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://[user]:[password]@[host]:5432/postgres
JWT_SECRET=[64-char-hex-secret]
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://routeiq-nine.vercel.app
```

### Frontend (Vercel)
- **Platform:** Vercel
- **URL:** https://routeiq-nine.vercel.app
- **Root Directory:** `/frontend`
- **Build Command:** `npm run build`
- **Deployment:** Automatic on push to `main`

**Environment Variables (set in Vercel Dashboard):**
```env
NEXT_PUBLIC_API_URL=https://routeiq-backend.vercel.app/api
```

### Database (Supabase)
- **Platform:** Supabase (managed PostgreSQL)
- **Region:** EU West 3 (Paris)
- **Connection Pooling:** PgBouncer enabled
- **Migrations:** Run manually via `npx prisma migrate deploy`

**Important:** Never run migrations from Vercel serverless functions to avoid race conditions.

### Manual Deployment (if needed)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from local
vercel

# Production deployment
vercel --prod
```

See [DEPLOYMENT_SUMMARY.md](../DEPLOYMENT_SUMMARY.md) for complete deployment documentation.

---

## Testing

### Backend Tests
```bash
cd backend

# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test routes.test.js

# Watch mode
pnpm test:watch
```

### Frontend Tests (Phase 2)
```bash
cd frontend

# Run component tests
pnpm test

# Run E2E tests (Playwright)
pnpm test:e2e
```

---

## Code Quality

### Linting
```bash
# Backend
cd backend && pnpm lint

# Frontend
cd frontend && pnpm lint
```

### Formatting
```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

### Pre-commit Hooks (Husky)
```bash
# Automatically runs on git commit:
- ESLint
- Prettier
- Type checking
- Run tests
```

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
pg_isready

# Check PostgreSQL service status
# macOS:
brew services list | grep postgresql

# Ubuntu/Debian:
sudo systemctl status postgresql

# Restart PostgreSQL
# macOS:
brew services restart postgresql@14

# Ubuntu/Debian:
sudo systemctl restart postgresql

# Check database exists
psql -l | grep routeiq
```

### "Prisma client not generated"
```bash
cd backend
pnpm prisma generate
```

### "Port already in use"
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change PORT in .env
```

### "Module not found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install
```

---

## Phase 1 MVP Checklist

- [ ] Project structure initialized
- [ ] PostgreSQL database running locally
- [ ] Prisma schema implemented
- [ ] User authentication working (register/login)
- [ ] Basic dashboard UI
- [ ] Can create and save a route
- [ ] Route displays on map
- [ ] Can log a manual activity
- [ ] Activity appears in dashboard
- [ ] User settings page functional
- [ ] Deployed to staging environment

---

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Leaflet.js](https://leafletjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Last updated:** November 19, 2025
