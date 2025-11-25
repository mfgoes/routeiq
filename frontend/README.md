# RouteIQ Frontend

Next.js 14 frontend for RouteIQ - data-driven route optimization and activity tracking.

## Features Implemented

### ✅ Authentication
- Login page with email/password
- Registration page with form validation
- JWT token management with Zustand
- Automatic redirect to dashboard when logged in
- Demo account support

### ✅ Dashboard
- Statistics overview with time period filtering (week/month/year/all-time)
- Real-time stats: total runs, distance, time, average pace
- Recent activities list
- Clean, responsive design with Tailwind CSS

### ✅ Activities
- Activity list with pagination
- Detailed activity logging form with:
  - Distance, duration, pace
  - Heart rate tracking
  - Elevation gain
  - Temperature, perceived effort (RPE)
  - Notes and race indicator
- Activity history table
- Date filtering

### ✅ Routes (Placeholder)
- Routes page with "coming soon" message
- Backend integration ready

### ✅ Workouts (Placeholder - Phase 3)
- Workouts page with Phase 3 roadmap
- Backend ready with 22 exercises seeded

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Client:** Axios
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Maps:** Leaflet + React-Leaflet (ready to integrate)
- **Date Formatting:** date-fns

## Getting Started

### Prerequisites

```bash
node --version  # v18+
pnpm --version  # or npm
```

### Installation

```bash
cd frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your backend URL (default: http://localhost:3001/api)
```

### Development

```bash
# Start development server
pnpm dev

# Opens at http://localhost:3000
```

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Main dashboard
│   │   ├── activities/        # Activities list & logging
│   │   ├── routes/            # Routes (placeholder)
│   │   └── workouts/          # Workouts (placeholder)
│   │
│   ├── components/
│   │   ├── dashboard/         # Dashboard-specific components
│   │   │   ├── StatsOverview.tsx    # Stats cards with period filter
│   │   │   └── RecentActivities.tsx # Recent runs list
│   │   ├── layout/            # Layout components
│   │   │   └── DashboardLayout.tsx  # Main app layout with nav
│   │   └── ui/                # Reusable UI components
│   │       └── StatCard.tsx         # Stat card component
│   │
│   ├── lib/
│   │   └── api.ts             # API client & endpoints
│   │
│   └── store/
│       └── authStore.ts       # Authentication state (Zustand)
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## API Integration

The frontend connects to the backend via the API client (`src/lib/api.ts`):

### Auth API
- `authAPI.register()`
- `authAPI.login()`
- `authAPI.getMe()`
- `authAPI.updateProfile()`

### Routes API
- `routesAPI.list()`
- `routesAPI.create()`
- `routesAPI.get(id)`
- `routesAPI.update(id)`
- `routesAPI.delete(id)`
- `routesAPI.browsePublic()`

### Activities API
- `activitiesAPI.list()`
- `activitiesAPI.create()`
- `activitiesAPI.get(id)`
- `activitiesAPI.update(id)`
- `activitiesAPI.delete(id)`
- `activitiesAPI.getStats()`

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Features Walkthrough

### 1. Login/Register
- Navigate to `/login` or `/register`
- Use demo account: `demo@routeiq.com` / `password123`
- JWT token stored in localStorage
- Auto-redirect to dashboard on success

### 2. Dashboard
- View stats with period filter (week/month/year/all)
- See recent 5 activities
- Quick navigation to all sections

### 3. Log Activity
- Click "Log Activity" from dashboard or activities page
- Fill in distance (km) and duration (minutes) - required
- Optional: pace, heart rate, elevation, temperature, effort
- Saves to backend and redirects to activities list

### 4. View Activities
- Table view of all logged runs
- Shows distance, duration, pace, date
- Linked routes displayed
- Paginated results

## Development Notes

### Authentication Flow
1. User logs in → JWT token stored in localStorage
2. Axios interceptor adds token to all requests
3. If 401 response → auto-logout and redirect to login
4. Zustand store manages user state globally

### State Management
- **Auth state:** Zustand (`useAuthStore`)
- **Component state:** React hooks (useState)
- **Server state:** No caching yet (could add React Query later)

### Styling
- Tailwind CSS utility classes
- Custom brand colors: `brand-red` (#EF4444), `brand-dark` (#1F2937)
- Responsive design (mobile-first)
- Consistent spacing and shadows

## TODO / Next Features

### Maps Integration (Phase 1)
- [ ] Integrate Leaflet.js for map display
- [ ] Route visualization on map
- [ ] Interactive route drawing
- [ ] Elevation profile charts

### Enhanced UI (Phase 2)
- [ ] Activity detail pages
- [ ] Edit activity functionality
- [ ] Delete activity with confirmation
- [ ] Weekly/monthly charts (Recharts)
- [ ] Performance trend graphs

### Workout Tracking (Phase 3)
- [ ] Workout logging form
- [ ] Exercise selection
- [ ] Sets/reps/weight inputs
- [ ] Workout history
- [ ] Progressive overload charts

### Cross-Training Insights (Phase 4)
- [ ] Correlation charts
- [ ] Smart recommendations
- [ ] Recovery suggestions

## Known Issues

- No error boundary yet (could crash on unhandled errors)
- No loading skeleton for initial page loads
- No offline support
- No PWA capabilities yet

## Performance Considerations

- Client-side rendering (CSR) for all pages
- Could add SSR/ISR for public routes page later
- Could add React Query for caching & optimistic updates
- Image optimization with Next.js `<Image>` (when needed)

## Deployment

The frontend is deployed on **Vercel** with automatic deployments from the `main` branch.

### Production Deployment
- **URL:** https://routeiq-nine.vercel.app
- **Platform:** Vercel
- **Root Directory:** `/frontend`
- **Build Command:** `npm run build`
- **Framework:** Next.js

### Environment Variables on Vercel
Set in Vercel Dashboard → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://routeiq-backend.vercel.app/api
```

### Automatic Deployment
Every push to the `main` branch automatically triggers a deployment to production. Preview deployments are created for pull requests.

### Manual Deployment (if needed)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration
The project uses Next.js defaults. See `vercel.json` in the project root for build settings.

For complete deployment documentation, see [DEPLOYMENT_SUMMARY.md](../DEPLOYMENT_SUMMARY.md).

## Testing

```bash
# Lint
pnpm lint

# Type check
pnpm tsc --noEmit
```

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

---

**Built with Next.js 14 + TypeScript + Tailwind CSS**
