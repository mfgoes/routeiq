# RouteIQ – Unified Developer TODO

_Last updated: 2025-11-21_

## 🚩 BLOCKERS – Phase 1 MVP

- [ ] **Map-Based Route Creation** (`/routes/new`)
  - Interactive map (Leaflet), click-to-draw, edit tools
  - Route metadata form (name, description, difficulty, surface)
  - Connect to `POST /api/routes`
  - Validation (min distance, valid GeoJSON)
  - Show real-time distance/elevation
  - Save button with success/error

- [ ] **Public Route Discovery/Browse**
  - Browse public routes, filters (distance, difficulty, surface, location)
  - Route cards with preview maps
  - Copy to My Routes, search, sorting

- [ ] **Dashboard Charts & Visualizations**
  - Weekly mileage trend, monthly distance, pace progression, activity breakdown, yearly progress, cross-training vs running
  - Use Recharts, data from `GET /api/activities/stats`

- [ ] **Activity Detail Page**
  - Route map, full metadata, edit/delete, weather, elevation chart

## ⚡ HIGH-IMPACT DASHBOARD IMPROVEMENTS

- [ ] Resume/Start Workout card at top
- [ ] Weekly activity streak tracker (color-coded, flame for streak)
- [ ] Quick Actions bar (Start Workout, Start Run, Quick Log)
- [ ] “This Week Overview” (workouts, run km, training time, active days)
- [ ] Last Workout Summary card
- [ ] Personal greeting (“Good to see you, Mischa 👋”)
- [ ] Recent Activities: show both workouts & runs

## 🛠️ MEDIUM PRIORITY

- [ ] Route selector in activity form (dropdown, pre-fill, optional)
- [ ] User settings page (profile, display prefs, Strava, privacy, delete)
- [ ] Route detail page (full map, metadata, stats, edit/delete, favorite)

## Low priority
- [ ] Strava OAuth integration (backend + frontend)

## 🧹 POLISH & UX

- [ ] Consistent error handling (global boundary, toast notifications, 404s)
- [ ] Loading states (skeletons, optimistic UI, progress for long ops)
- [ ] Advanced filtering/search (search bar, filter by date/route/type, sorting)
- [ ] Data export (CSV, GPX, yearly summary, Strava export)

## 🧪 TESTING & QUALITY

- [ ] Frontend tests (Jest, RTL, API client, forms, auth, map)
- [ ] Backend tests (endpoint, auth middleware, validation, DB integration)

## 📱 MOBILE EXPERIENCE

- [ ] Optimize map controls for touch
- [ ] Improve mobile form UX
- [ ] Pull-to-refresh on lists
- [ ] PWA manifest

## 🚀 PHASE 2+ (Future)

- Weather API, ML predictions, goal tracking, social features, comments, photo uploads, live tracking
- Workout tracking UI, templates, calendar, progressive overload
- Cross-training analytics, recovery, training load, calendar, periodization

---

### 🗂️ Quick Reference

**Frontend 100%:** Auth, dashboard stat cards, basic activity logging/history, routes list, map display  
**Partial:** Dashboard (no charts), activity form (no route selector), routes (no creation UI)  
**Missing:** Route creation, public discovery, activity/route detail, settings, Strava, charts

**Backend 100%:** All 16 endpoints, auth, DB, validation, error handling  
**Missing:** Strava OAuth endpoints, sync service

---

### ❓ Decisions Needed

- Public routes: opt-in or opt-out?
- Route privacy levels?
- Strava sync: one-way or two-way?
- Manual GPX upload?
- Multiple unit systems (km/mi)?
- Elevation profiles on route cards?

---

**For details, see:**  
- `docs/DATABASE_SCHEMA.md` (DB design)  
- `docs/ROADMAP.md` (outdated)  
- `styleguide.md` (frontend guidelines)

