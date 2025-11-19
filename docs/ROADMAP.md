# RouteIQ Product Roadmap

**Strategy:** Running route optimization as core product, with workout tracking as complementary feature that creates unique cross-training insights.

**Unique Value Proposition:** The only platform that shows how your strength training impacts your running performance.

---

## Phase 1: Running MVP (Core Product)
**Goal:** Ship a minimal but excellent running route optimization tool

### Must-Have Features
- [ ] **Basic route generation**
  - Input: start location, distance, terrain preference
  - Output: optimized route with map visualization
  - Integration: OpenStreetMap data

- [ ] **Simple route discovery**
  - Browse routes in your area
  - Filter by distance, elevation, difficulty
  - Save favorite routes

- [ ] **Strava integration (read-only)**
  - OAuth connection
  - Import running history
  - Display recent runs on dashboard

- [ ] **Basic analytics**
  - Total distance, pace, elevation per run
  - Weekly/monthly summaries
  - Simple progress charts

- [ ] **User accounts & authentication**
  - Sign up / login
  - Profile with basic settings
  - Secure data storage

### Success Metrics
- 50 active users
- Average 3+ routes generated per user
- 20% monthly active user rate
- Positive feedback from beta testers

---

## Phase 2: Advanced Running Features
**Goal:** Make route optimization truly intelligent

### Core Features
- [ ] **Performance predictions**
  - Estimated completion time for routes
  - Difficulty rating personalized to user's fitness
  - Pace recommendations per segment

- [ ] **Weather integration**
  - Route recommendations based on conditions
  - Historical performance in different weather
  - Optimal timing suggestions

- [ ] **Goal-based route selection**
  - Training for marathon/half-marathon/5K
  - Speed work vs. long runs vs. recovery
  - Progressive training plans

- [ ] **Advanced analytics**
  - Performance trends over time
  - Route comparison analysis
  - Heat maps of frequently run areas

- [ ] **Social features**
  - Share routes with friends
  - Community route ratings
  - Popular routes in your area

### Success Metrics
- 200+ active users
- 40% of users set training goals
- Average session time > 5 minutes
- 10+ shared routes per week

---

## Phase 3: Workout Tracking (Expansion)
**Goal:** Add gym/strength training tracking as complementary feature

### Core Features
- [ ] **Basic workout logging**
  - Exercise library (major compound movements)
  - Log sets, reps, weight
  - Rest timer between sets
  - Workout history

- [ ] **Progressive overload tracking**
  - Volume calculations (sets × reps × weight)
  - Strength progression charts
  - Personal records tracking
  - Deload recommendations

- [ ] **Exercise categories**
  - Lower body (squats, deadlifts, lunges)
  - Upper body (bench, rows, pull-ups)
  - Core work
  - Mobility/flexibility

- [ ] **Workout templates**
  - Create custom workout routines
  - Copy/repeat previous workouts
  - Pre-built templates (runner's strength, etc.)

### Important Notes
- Keep UI simple - not trying to compete with Hevy/Strong on features
- Focus on exercises that complement running (no need for 500 exercises)
- Position as "cross-training log" not "full gym tracker"

### Success Metrics
- 30% of running users also log workouts
- Average 2+ workouts logged per week
- Users who log both running + gym have higher retention

---

## Phase 4: The Magic - Cross-Training Intelligence
**Goal:** Create unique value by connecting gym performance to running performance

### Breakthrough Features
- [ ] **Performance correlation analytics**
  - "Your squat strength increased 15%, hill running pace improved 8%"
  - "Heavy leg days: take 2 rest days before speed work for optimal performance"
  - "Your pull-up progression correlates with better running posture"

- [ ] **Smart recovery recommendations**
  - Don't schedule long runs after heavy leg day
  - Suggest recovery runs vs. rest days based on gym volume
  - Fatigue score combining running + lifting

- [ ] **Integrated training calendar**
  - Visual calendar showing both running and gym
  - Conflict detection (hard run + heavy squats same day)
  - Balanced weekly volume suggestions

- [ ] **Strength benchmarks for runners**
  - "Runners at your pace typically squat 1.5x bodyweight"
  - Strength gaps that might be limiting running performance
  - Injury prevention through balanced development

### Why This Matters
This is what competitors **don't have**. Strava tracks runs. Hevy tracks gym. Nobody connects the two with actionable insights.

### Success Metrics
- 50%+ of users engage with cross-training insights
- Users rate this feature 4.5+ stars
- "Aha moments" captured in user feedback
- Higher retention vs. running-only users

---

## Phase 5: Mobile App & Advanced Features
**Goal:** Full-featured mobile experience

### Features
- [ ] **Native mobile apps** (iOS/Android)
  - GPS tracking for runs
  - Offline route access
  - Quick workout logging
  - Push notifications

- [ ] **Real-time route guidance**
  - Turn-by-turn navigation
  - Audio cues during run
  - On-the-fly route adjustments

- [ ] **Wearable integration**
  - Garmin Connect
  - Apple Watch
  - Polar, Coros, etc.

- [ ] **Advanced AI features**
  - ChatGPT-style training advisor
  - Automated training plan generation
  - Injury risk prediction

---

## Technical Architecture Considerations

### Phase 1 Tech Stack
- **Frontend:** React/Next.js (leverage existing HTML/CSS)
- **Backend:** Node.js/Express or Python/FastAPI
- **Database:** PostgreSQL (structured data) + Redis (caching)
- **Maps:** Leaflet.js + OpenStreetMap
- **Auth:** Auth0 or Supabase
- **Hosting:** Vercel (frontend) + Railway/Render (backend)

### Phase 3 Additions
- **Workout database:** Relational schema for exercises/sets/reps
- **Analytics engine:** Calculate volume, progression metrics
- **API design:** RESTful endpoints for CRUD operations

### Phase 4 Requirements
- **Data science:** Python (pandas, scikit-learn) for correlations
- **ML pipeline:** Basic regression models for predictions
- **Background jobs:** Cron jobs for daily insight generation

---

## Monetization Strategy

### Free Tier
- 5 route generations per month
- Basic workout logging
- Standard analytics
- Mobile app access

### Pro Tier ($8-12/month)
- Unlimited routes
- Advanced analytics
- Performance predictions
- Cross-training insights
- Priority support

### Coach/Team Tier ($30-50/month)
- Everything in Pro
- Manage multiple athletes
- Team analytics dashboard
- Export data/reports
- API access

---

## Immediate Next Steps (Next 2 Weeks)

### Design & Planning
1. Sketch wireframes for main screens:
   - Route generation interface
   - Dashboard with recent runs
   - Workout logging screen
   - Analytics page

2. Define data models:
   - User schema
   - Route schema
   - Run/activity schema
   - Workout/exercise schema

3. Set up development environment:
   - Choose tech stack
   - Initialize repo structure
   - Set up dev/staging/prod environments

### Development Priorities
**Week 1:**
- Basic project setup
- User authentication
- Database schema implementation
- Simple dashboard UI

**Week 2:**
- OpenStreetMap integration
- Basic route generation algorithm
- Display route on map
- Save routes to database

---

## Open Questions

1. **Data Privacy:** How to handle Strava data? Store locally or query on-demand?
2. **Route Algorithm:** Use existing routing services (GraphHopper, OSRM) or build custom?
3. **Exercise Library:** Start with 20-30 exercises or go bigger?
4. **Beta Testing:** Who are your first 10 users? Running club? Gym friends?
5. **Branding:** Keep red/white color scheme? Logo iterations needed?

---

## Risk Management

**Risk:** Users only want running OR gym, not both
- **Mitigation:** Make each feature standalone excellent. They don't need to use both.

**Risk:** Route generation is technically complex
- **Mitigation:** Use existing routing APIs first, optimize later.

**Risk:** Strava/fitness APIs change or cost money
- **Mitigation:** Build with abstraction layer, support manual CSV imports.

**Risk:** Workout tracking market is saturated
- **Mitigation:** Position as "runner's strength log" not "gym tracker." Different audience.

**Risk:** Correlation analytics are hard to build/prove
- **Mitigation:** Start with simple correlations (strength up → pace up), add sophistication over time.

---

## Success Definition

**By March 2026 (1 year):**
- 500+ active users
- 50+ paying subscribers
- 4.5+ star rating on app stores
- Users report measurable performance improvements
- Featured in running/fitness communities
- Break even on hosting costs

**Long-term Vision (3-5 years):**
- 10,000+ active users
- $10K+ MRR
- Partnership with running clubs/coaches
- Known as "the smart training app"
- Acquisition interest from larger fitness platforms

---

**Last updated:** November 19, 2025
