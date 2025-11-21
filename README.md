# RouteIQ

**Data-driven route optimization for smarter running** 🏃‍♂️📊

RouteIQ helps runners discover optimal routes using advanced data analysis from OpenStreetMap and Strava API integration. Track your runs, log your workouts, and get intelligent insights on how your cross-training impacts your running performance.

## Project Status

🚧 **Phase 1 - Full-Stack MVP IN PROGRESS**

**Backend ✅ (100%)**
- [x] Express API with 16 endpoints
- [x] PostgreSQL database (11 models)
- [x] JWT authentication
- [x] Routes CRUD API
- [x] Activities CRUD + statistics
- [x] 22 exercises pre-seeded

**Frontend 🚧 (40%)**
- [x] Next.js 14 app with TypeScript
- [x] Login/Register pages
- [x] Dashboard with basic stat cards
- [x] Activity logging form (basic)
- [x] Activity history table
- [x] Responsive design (mobile/tablet/desktop)
- [x] Routes list page with filtering
- [x] Map components (RouteMap, RouteDrawer)
- [ ] **CRITICAL:** Route creation UI (button exists but disabled)
- [ ] **CRITICAL:** Map-based route drawing interface
- [ ] **CRITICAL:** Route detail pages
- [ ] **CRITICAL:** Public route discovery/browse UI
- [ ] Dashboard charts/graphs (Recharts installed but unused)
- [ ] Activity detail pages (links go nowhere)
- [ ] Route selector in activity form
- [ ] User settings page
- [ ] Strava OAuth integration (0% - only DB schema exists)

**Phase 1 Completion Estimate: ~60% overall** (Backend done, Frontend partially complete)

📋 **See [docs/TODO.md](docs/TODO.md) for detailed implementation roadmap**

## Tech Stack

**Backend:**
- Node.js 18+ with Express
- PostgreSQL 14+ (Prisma ORM)
- JWT authentication
- Zod validation

**Frontend:**
- Next.js 14 (App Router) with TypeScript
- React 18 with Server Components
- Tailwind CSS for styling
- Leaflet.js for interactive maps
- Recharts for data visualization (installed, not yet used)
- Axios for API communication

**DevOps:**
- Local PostgreSQL (local development)
- Vercel (frontend hosting)
- Railway (backend + database hosting)

## Quick Start

### Prerequisites

```bash
# Required
node --version  # v18 or higher

# Install PostgreSQL 14+
# macOS:
brew install postgresql@14 && brew services start postgresql@14
# Ubuntu/Debian:
sudo apt-get install postgresql-14 && sudo systemctl start postgresql
# Windows:
choco install postgresql14

# Install pnpm (recommended)
npm install -g pnpm
```

### Setup

1. **Clone and install dependencies**

```bash
git clone <repo-url>
cd routeiq

# Backend setup
cd backend
pnpm install
cp .env.example .env
```

2. **Create database**

```bash
# Use helper script
cd backend
./scripts/init-local-db.sh

# OR create manually:
createdb routeiq_dev
```

3. **Initialize database**

```bash
cd backend

# Run migrations
pnpm prisma migrate dev

# Seed database with exercises
pnpm prisma db seed

# Optional: Open Prisma Studio to view data
pnpm prisma studio
```

4. **Start backend server**

```bash
cd backend
pnpm dev

# Server runs on http://localhost:3001
```

5. **Test the API**

```bash
# Health check
curl http://localhost:3001/health

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save the token from response and test authenticated endpoint
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
routeiq/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, errors
│   │   ├── services/     # Business logic
│   │   └── index.js      # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed.js       # Seed data
│   ├── scripts/
│   │   └── init-local-db.sh # Database setup helper
│   └── package.json
│
├── frontend/             # Next.js app (coming soon)
│
├── docs/                 # Documentation
│   ├── ROADMAP.md        # Product roadmap
│   ├── DATABASE_SCHEMA.md # Database design
│   ├── CLAUDE.md         # Project strategy
│   └── SETUP.md          # Detailed setup guide
│
└── static-landing/       # Static marketing site
    └── index.html
```

## API Endpoints

### Authentication ✅
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and get JWT
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile

### Routes ✅
- `GET /api/routes` - List user's routes (with filters)
- `POST /api/routes` - Create new route
- `GET /api/routes/:id` - Get route details
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route
- `GET /api/routes/public` - Browse public routes

### Activities ✅
- `GET /api/activities` - List activities (with pagination)
- `POST /api/activities` - Log a run
- `GET /api/activities/:id` - Get activity details
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/stats` - Get statistics (all-time, weekly, monthly, yearly)

### Workouts (Phase 3)
- `GET /api/workouts` - List workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/exercises` - List exercises

**📖 See [API_EXAMPLES.md](backend/API_EXAMPLES.md) for complete API documentation with curl examples**

## Development

```bash
# Backend development
cd backend

# Start dev server (auto-reload)
pnpm dev

# Run tests
pnpm test

# Generate Prisma client after schema changes
pnpm prisma generate

# Create new migration
pnpm prisma migrate dev --name description

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset
```

## Environment Variables

Create `backend/.env` from `.env.example`:

```env
DATABASE_URL="postgresql://routeiq:password@localhost:5432/routeiq_dev"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

## Database Management

```bash
# View database in browser
pnpm prisma studio

# Run migrations
pnpm prisma migrate dev

# Seed data (exercises, demo user)
pnpm prisma db seed

# Reset and reseed
pnpm prisma migrate reset
```

**Demo User:**
- Email: `demo@routeiq.com`
- Password: `password123`

## Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Quick setup guide (start here!)
- **[docs/TODO.md](docs/TODO.md)** - Detailed implementation roadmap
- **[docs/ROADMAP.md](docs/ROADMAP.md)** - Product vision and phases
- **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Complete database schema
- **[docs/SETUP.md](docs/SETUP.md)** - Detailed setup + troubleshooting
- **[docs/CLAUDE.md](docs/CLAUDE.md)** - Project strategy and goals
- **[docs/styleguide.md](docs/styleguide.md)** - Frontend design system
- **[backend/API_EXAMPLES.md](backend/API_EXAMPLES.md)** - API documentation

## Roadmap

### Phase 1: Running MVP (60% Complete)
- ✅ Backend API (100%)
- ✅ Authentication (100%)
- 🚧 Route creation & discovery (30% - list/display works, creation blocked)
- ✅ Activity tracking (80% - logging works, details page missing)
- 🚧 Dashboard (60% - stats work, charts missing)
- ❌ Strava integration (0%)

### Phase 2: Advanced Running
- Weather integration
- Performance predictions
- Goal tracking
- Social features

### Phase 3: Workout Tracking
- Exercise logging
- Progressive overload tracking
- Workout templates

### Phase 4: Cross-Training Intelligence
- Performance correlations
- Smart recovery recommendations
- Integrated training calendar

## Contributing

This is a personal project currently in early development. Contributions welcome once Phase 1 MVP is complete.

## License

MIT

---

**Built with ❤️ in The Hague** • Beta Launch 2025
