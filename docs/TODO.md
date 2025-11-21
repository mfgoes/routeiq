# RouteIQ - Development TODO List

**Last Updated:** 2025-11-21
**Phase 1 Completion:** ~60% (Backend 100%, Frontend 40%)

This document outlines all remaining work to complete Phase 1 MVP and beyond. Items are prioritized by impact on core product value.

---

## ✋ BLOCKING ISSUES - Complete Phase 1 MVP

These features are advertised/implied but completely missing. They block users from experiencing core product value.

### 🗺️ 1. Map-Based Route Creation (CRITICAL)
**Status:** Backend ready, frontend 0%
**Location:** `frontend/src/app/routes/new/page.tsx` (needs to be created)

- [ ] Create `/routes/new` page with interactive map
- [ ] Implement click-to-draw route functionality using Leaflet
- [ ] Add route editing tools (undo, clear, modify waypoints)
- [ ] Create route metadata form (name, description, difficulty, surface type)
- [ ] Connect to `POST /api/routes` endpoint
- [ ] Add validation (min distance, valid GeoJSON)
- [ ] Show real-time distance/elevation calculations
- [ ] Add "Save Route" button with success/error handling

**Files to create:**
- `frontend/src/app/routes/new/page.tsx`
- `frontend/src/components/map/RouteCreator.tsx`

**Blockers:** Button exists on `/routes` page but links to non-existent page

---

### 🔍 2. Public Route Discovery/Browse (CRITICAL)
**Status:** Backend ready (`GET /api/routes/public`), frontend 0%
**Location:** Needs new page or tab

- [ ] Create public routes browse interface
- [ ] Add filters: distance range, difficulty, surface type, location
- [ ] Display route cards with preview maps
- [ ] Add "Copy to My Routes" functionality
- [ ] Implement search by location/name
- [ ] Add sorting (popularity, distance, recent)

**Implementation options:**
- Option A: New tab on `/routes` page ("Discover" tab)
- Option B: Separate `/routes/discover` page

**Blockers:** Users cannot discover routes created by others

---

### 📊 3. Dashboard Charts & Visualizations (HIGH PRIORITY)
**Status:** Recharts installed but unused, data ready
**Location:** `frontend/src/app/dashboard/page.tsx`

- [ ] Weekly mileage trend chart (last 12 weeks)
- [ ] Monthly distance comparison (bar chart)
- [ ] Pace progression over time (line chart)
- [ ] Activity type breakdown (pie chart)
- [ ] Yearly progress chart with goal line
- [ ] Cross-training vs running balance visualization

**Technical notes:**
- Recharts is already installed (`package.json`)
- Data available from `GET /api/activities/stats`
- Current dashboard only shows stat cards

**Files to modify:**
- `frontend/src/app/dashboard/page.tsx:58-120`

---

### 📝 4. Activity Detail Page (HIGH PRIORITY)
**Status:** Links exist but go nowhere
**Location:** `frontend/src/app/activities/[id]/page.tsx` (needs to be created)

- [ ] Create activity detail page with route map
- [ ] Display full activity metadata (pace, splits, heart rate if logged)
- [ ] Show associated route (if linked)
- [ ] Add edit/delete buttons
- [ ] Display weather data (if available)
- [ ] Show elevation profile chart

**Current behavior:**
- Activity rows in table have click handlers
- Clicking does nothing (no route defined)

**Files to create:**
- `frontend/src/app/activities/[id]/page.tsx`

---

### 🔗 5. Route Selector in Activity Form (MEDIUM)
**Status:** Database supports `routeId`, UI doesn't
**Location:** `frontend/src/app/activities/page.tsx:100-200`

- [ ] Add route dropdown to activity logging form
- [ ] Fetch user routes from `GET /api/routes`
- [ ] Filter routes by distance (suggest similar distances)
- [ ] Pre-fill distance/elevation from selected route
- [ ] Make route optional (manual entry still allowed)

**Files to modify:**
- `frontend/src/app/activities/page.tsx` (activity logging form)

---

### 🔐 6. Strava OAuth Integration (MEDIUM)
**Status:** 0% complete, database schema exists
**Location:** Backend + frontend auth flow

**Backend tasks:**
- [ ] Create Strava OAuth controller (`backend/src/controllers/stravaController.js`)
- [ ] Add Strava API client (`backend/src/services/stravaService.js`)
- [ ] Implement OAuth callback handler
- [ ] Create sync endpoints:
  - `POST /api/strava/connect` - Initiate OAuth
  - `GET /api/strava/callback` - Handle OAuth callback
  - `POST /api/strava/sync` - Sync activities
  - `DELETE /api/strava/disconnect` - Unlink account
- [ ] Store Strava tokens in `User.stravaAccessToken`
- [ ] Handle token refresh

**Frontend tasks:**
- [ ] Add "Connect Strava" button to settings page (needs creating)
- [ ] Create Strava OAuth redirect flow
- [ ] Add sync status indicator
- [ ] Show last sync time
- [ ] Add "Disconnect Strava" option

**Environment variables needed:**
```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_secret
STRAVA_REDIRECT_URI=http://localhost:3000/auth/strava/callback
```

**Blockers:** Advertised in product description but completely missing

---

### ⚙️ 7. User Settings Page (MEDIUM)
**Status:** No settings page exists
**Location:** `frontend/src/app/settings/page.tsx` (needs to be created)

- [ ] Create settings page layout
- [ ] Profile settings (name, email, password change)
- [ ] Display preferences (units: km/mi, theme)
- [ ] Strava connection status & controls
- [ ] Privacy settings (public profile toggle)
- [ ] Delete account option

**Files to create:**
- `frontend/src/app/settings/page.tsx`

**Current workaround:** Profile update via `PUT /api/auth/me` works but no UI

---

### 🎨 8. Route Detail Page (MEDIUM)
**Status:** Routes list exists, individual routes inaccessible
**Location:** `frontend/src/app/routes/[id]/page.tsx` (needs to be created)

- [ ] Create route detail page with full-screen map
- [ ] Display route metadata (distance, elevation, difficulty)
- [ ] Show completion history (activities on this route)
- [ ] Add edit/delete buttons (owner only)
- [ ] Add "Start Activity on This Route" button
- [ ] Display route stats (average pace, best time, completion count)
- [ ] Show surface type breakdown
- [ ] Add favorite/unfavorite toggle

**Files to create:**
- `frontend/src/app/routes/[id]/page.tsx`

---

## 🔧 POLISH & UX IMPROVEMENTS

### 9. Consistent Error Handling (LOW)
**Status:** Some error handling exists, inconsistent

- [ ] Create global error boundary component
- [ ] Standardize API error responses
- [ ] Add toast notifications for success/error
- [ ] Handle token expiration gracefully
- [ ] Add form validation error messages
- [ ] Create 404 page for routes/activities

---

### 10. Loading States Optimization (LOW)
**Status:** Some loading states exist, could be improved

- [ ] Add skeleton loaders to all data-fetching components
- [ ] Implement optimistic UI updates
- [ ] Add loading indicators to forms
- [ ] Show progress for long operations (route sync, bulk imports)

---

### 11. Advanced Filtering & Search (LOW)
**Status:** Basic filtering works on routes page

- [ ] Add search bar to routes list
- [ ] Filter activities by date range
- [ ] Filter activities by route
- [ ] Filter activities by exercise type
- [ ] Add sorting options (date, distance, pace)
- [ ] Save filter preferences

---

### 12. Data Export Features (LOW)
**Status:** Not started

- [ ] Export activities to CSV
- [ ] Export route as GPX file
- [ ] Export yearly summary report
- [ ] Export to Strava (if not using sync)

---

## 🧪 TESTING & QUALITY

### 13. Frontend Tests (LOW)
**Status:** No tests exist

- [ ] Set up Jest + React Testing Library
- [ ] Write unit tests for API client
- [ ] Write component tests for forms
- [ ] Add integration tests for auth flow
- [ ] Test map interactions

---

### 14. Backend Tests (LOW)
**Status:** Test command exists in `package.json`, no tests written

- [ ] Write endpoint tests for all routes
- [ ] Add authentication middleware tests
- [ ] Test validation schemas
- [ ] Add database integration tests

---

## 📱 MOBILE EXPERIENCE

### 15. Mobile Optimization (LOW)
**Status:** Responsive design exists but could be enhanced

- [ ] Optimize map controls for touch
- [ ] Improve form UX on mobile
- [ ] Add pull-to-refresh on lists
- [ ] Test on actual mobile devices
- [ ] Add PWA manifest for home screen install

---

## 🚀 PHASE 2 & BEYOND (Future Work)

These are intentionally deprioritized for Phase 1 MVP:

### Phase 2: Advanced Running Features
- [ ] Weather API integration (OpenWeather)
- [ ] Performance predictions using ML
- [ ] Goal tracking system
- [ ] Social features (follow users, activity feed)
- [ ] Comments on routes/activities
- [ ] Photo uploads for activities
- [ ] Live tracking during runs

### Phase 3: Workout Tracking
- [ ] Workout logging UI
- [ ] Exercise selection with autocomplete
- [ ] Progressive overload tracking
- [ ] Workout templates
- [ ] Workout calendar view

### Phase 4: Cross-Training Intelligence
- [ ] Correlation analysis (workouts → running performance)
- [ ] Recovery recommendations
- [ ] Training load management
- [ ] Integrated training calendar
- [ ] Periodization planning

---

## 📋 QUICK REFERENCE

### Frontend Completion Status
```
✅ 100% Complete:
- Authentication pages
- Dashboard stat cards
- Activity logging (basic)
- Activity history table
- Routes list page
- Map display components

🚧 Partially Complete (30-80%):
- Dashboard (stats only, no charts)
- Activity form (no route selector)
- Routes page (no creation UI)

❌ 0% Complete:
- Route creation/editing
- Public route discovery
- Activity detail pages
- Route detail pages
- Settings page
- Strava integration
- Charts/visualizations
```

### Backend Completion Status
```
✅ 100% Complete:
- All 16 API endpoints functional
- Authentication & authorization
- Database schema
- Input validation
- Error handling

❌ Missing:
- Strava OAuth endpoints
- Strava sync service
```

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

To complete Phase 1 MVP (target: core running features working):

1. **Week 1 (Core Features):**
   - Route creation UI (#1)
   - Activity detail page (#4)
   - Dashboard charts (#3)

2. **Week 2 (Discovery & Polish):**
   - Public route discovery (#2)
   - Route detail page (#8)
   - Route selector in activity form (#5)

3. **Week 3 (Settings & Integration):**
   - Settings page (#7)
   - Strava OAuth flow (#6)
   - Error handling improvements (#9)

4. **Week 4 (Quality & Testing):**
   - Loading states (#10)
   - Frontend tests (#13)
   - Mobile optimization (#15)

**After this, Phase 1 MVP would be truly complete and production-ready.**

---

## 📞 QUESTIONS & DECISIONS NEEDED

- [ ] Should public routes be opt-in or opt-out by default?
- [ ] Do we need route privacy levels (public/private/friends)?
- [ ] Should Strava sync be one-way (import) or two-way?
- [ ] Do we need manual GPX upload for routes?
- [ ] Should we support multiple unit systems (km/mi)?
- [ ] Do we need elevation profiles on route cards?

---

## 🔗 RELATED DOCS

- [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Full database design
- [ROADMAP.md](docs/ROADMAP.md) - Product roadmap (outdated, needs update)
- [CLAUDE.md](docs/CLAUDE.md) - Project strategy
- [styleguide.md](styleguide.md) - Frontend design guidelines

---

**Note:** This TODO list is based on an honest assessment of current implementation status. The README has been updated to reflect reality (60% complete, not "COMPLETE").
