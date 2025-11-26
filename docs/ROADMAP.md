# RouteIQ Product Roadmap

**🔄 UPDATED STRATEGY (Nov 26, 2024):** Fitness-first approach, prioritizing workout tracking for faster value delivery.

**Why the pivot?** Workout tracking is simpler to build, delivers immediate value, and doesn't require complex mapping infrastructure. Route optimization will come later once we validate the core fitness tracking experience.

**Current Focus:** Make RouteIQ the best workout tracking experience with smart progressive overload features.

---

## ✅ Phase 1: Fitness Tracking MVP (COMPLETED - Nov 2024)
**Goal:** Ship a minimal but excellent workout tracking experience

### Completed Features (v0.2.0)
- [x] **Dashboard redesigned** - Workout-first UI with prominent CTAs
- [x] **Workout stats component** - Total workouts, volume, exercises, avg duration
- [x] **Recent workouts display** - View workout history at a glance
- [x] **Default workout templates** - 4 pre-made templates (Upper Push, Upper Pull, Lower Body, Full Body Beginner)
- [x] **Exercise library seeded** - 22 exercises across all major muscle groups
- [x] **Workout execution mode** - Log sets, reps, weight with checkboxes for completion
- [x] **Template creation** - Create custom workout templates
- [x] **Progressive overload hints** - Auto-suggest weights based on last performance
- [x] **RPE tracking** - Rate of Perceived Exertion per set
- [x] **Rest timer config** - Customizable rest periods per set
- [x] **Workout persistence** - Auto-save in-progress workouts
- [x] **Database seeding automation** - Exercises and templates seed on deployment

### Success Metrics (To Be Measured)
- [ ] Users can complete a full workout from template
- [ ] 90%+ of exercises display correctly
- [ ] Dashboard loads in < 2 seconds
- [ ] 80%+ workout completion rate

---

## 🚧 Phase 2: Enhanced Workout Experience (NEXT - Dec 2024)
**Goal:** Polish the workout flow and add essential analytics

### High Priority Features

#### 1. Workout History & Detail Views
- [ ] **Workout detail page** (`/workouts/[id]`)
  - Display all exercises, sets, reps, weight for completed workout
  - Show workout duration, total volume, total reps
  - Display notes and RPE ratings
  - Button to "Repeat this workout"
- [ ] **Exercise performance history**
  - View all past performances for a specific exercise
  - Chart showing weight progression over time
  - Display personal records (PRs) prominently
- [ ] **Week/month summaries**
  - Total workouts completed
  - Most trained muscle groups (chart/visualization)
  - Consistency streaks (gamification)
  - Volume trends over time

#### 2. Improved Dashboard & Stats
- [ ] **Fix workout stats API endpoint**
  - Implement `/api/workouts/stats` backend endpoint
  - Calculate totals, averages, trends by time period
  - Cache results for performance
- [ ] **Loading states** for all components
- [ ] **Error handling** with user-friendly messages
- [ ] **Toast notifications** for successful actions
- [ ] **Empty state illustrations** for zero-data scenarios

#### 3. Template Management
- [ ] **Edit existing templates**
  - Modify exercises, sets, reps
  - Update template name and type
- [ ] **Duplicate templates**
  - "Copy template" button
  - Quick way to create variations
- [ ] **Delete templates**
  - Confirmation modal before deletion
  - Can't delete if used in active workout
- [ ] **Template categories/tags**
  - Filter by: Beginner, Intermediate, Advanced
  - Filter by: Upper, Lower, Full Body, Core
  - Filter by: Home vs Gym equipment

#### 4. Exercise Library Expansion
- [ ] **Add 30+ more exercises** (target: 50+ total)
  - Machine exercises (leg press, lat pulldown, cable work)
  - Bodyweight variations (push-up variations, pistol squats)
  - Dumbbell-only exercises
  - Kettlebell exercises
- [ ] **Exercise detail pages**
  - Form instructions/tips
  - Muscle group diagrams
  - Video links (YouTube embeds)
  - Equipment needed
- [ ] **Custom exercise creation**
  - Users can add their own exercises
  - Specify name, muscle groups, equipment
  - Private to user (no sharing yet)

### Medium Priority Features

#### 5. Progressive Overload Intelligence
- [ ] **Smart weight suggestions**
  - If completed all sets/reps easily, suggest +2.5kg next time
  - Based on RPE scores (if RPE < 8, increase weight)
  - User-configurable increment settings
- [ ] **Rest timer improvements**
  - Auto-start timer when set marked complete
  - Audio/haptic notification when rest is done
  - Pause/extend timer mid-rest
- [ ] **Workout notes**
  - Per-exercise notes during workout
  - Overall workout rating (1-10 difficulty)
  - "How did you feel?" prompt after workout

#### 6. Mobile & UX Polish
- [ ] **PWA improvements**
  - Add to home screen prompt
  - Offline support for active workouts (save locally, sync when online)
  - App-like navigation transitions
- [ ] **Responsive design fixes**
  - Larger tap targets for mobile (44px minimum)
  - Swipe gestures (swipe to delete set, swipe between exercises)
  - Keyboard doesn't cover inputs
  - Better mobile forms
- [ ] **Dark mode support**
  - Toggle in settings
  - Respect system preference
  - Persistent choice

### Low Priority / Nice-to-Have

#### 7. Social & Motivation
- [ ] **Achievement badges**
  - First workout, 10 workouts, 50 workouts, 100 workouts
  - Volume milestones (10,000kg, 50,000kg, 100,000kg)
  - Consistency streaks (7 days, 30 days, 90 days)
- [ ] **Workout sharing**
  - Generate shareable image of completed workout
  - Export workout as PDF
  - Copy workout link to share with friends

### Success Metrics (Phase 2)
- [ ] 80%+ workout completion rate (users finish what they start)
- [ ] Users create 2+ custom templates on average
- [ ] Users log workouts 3+ times per week
- [ ] < 5% error rate on workout submission
- [ ] Average session time > 8 minutes (engaged, not rushed)

---

## 📋 Phase 3: Running Features (Q1 2025)
**Goal:** Add basic running/cardio tracking capabilities

**Note:** Running features are deprioritized until workout tracking is solid and validated by users.

### Core Running Features
- [ ] **Indoor run logging (manual entry)**
  - Distance, time, pace inputs
  - Calories burned (estimated)
  - Notes, perceived effort
  - Weather conditions
- [ ] **Outdoor run logging**
  - Same as indoor but with "location" field
  - No GPS tracking yet (just manual entry)
- [ ] **Run history page** (`/runs`)
  - List all runs with filters
  - Show distance, pace, time
  - Charts for pace trends over time
- [ ] **Run statistics**
  - Total distance, time
  - Average pace, best pace
  - Weekly/monthly totals
  - Personal records (fastest 5K, 10K, half marathon, marathon)

### Simplified Route Planning
- [ ] **Manual route creation**
  - Enter route name, distance, elevation manually
  - Save favorite routes (no map drawing yet)
  - Mark routes as "favorite"
- [ ] **Route library**
  - View saved routes
  - Quick-start run from saved route
  - Track how many times you've run each route

### Success Metrics (Phase 3)
- [ ] 40% of workout users also log runs
- [ ] Average 2+ runs logged per week (for users who run)
- [ ] Runs are logged within 24 hours (data freshness)

---

## 📋 Phase 4: Advanced Route Features (Q2 2025)
**Goal:** Build intelligent route optimization (original vision)

**This is where we bring back the "RouteIQ" part of RouteIQ.**

### Route Generation & Optimization
- [ ] **Interactive map route drawing**
  - Leaflet.js or Mapbox integration
  - Click to draw route on map
  - Auto-calculate distance, elevation
  - Show elevation profile
- [ ] **Auto-route generation**
  - Input: start location, desired distance
  - Algorithm generates optimal route (loop, out-and-back, point-to-point)
  - Uses OpenStreetMap data
  - Considers terrain preferences (flat, hilly)
- [ ] **Route discovery**
  - Browse public routes in your area
  - Filter by distance, elevation, difficulty
  - Community ratings
  - Popular routes heat map
- [ ] **GPS tracking during runs** (mobile PWA or native app)
  - Real-time distance, pace tracking
  - Route recording
  - Post-run map visualization
  - Save as route for future use

### Success Metrics (Phase 4)
- [ ] 50%+ of runners use route generation feature
- [ ] Average 3+ routes generated per user
- [ ] 30%+ of generated routes get re-used (validation that routes are good)

---

## 📋 Phase 5: Cross-Training Intelligence (Q3 2025)
**Goal:** Connect gym performance to running performance (unique value prop)

### Breakthrough Features
- [ ] **Performance correlation analytics**
  - "Your squat strength increased 15%, and your hill running pace improved 8%"
  - "Your deadlift progression correlates with faster finish times"
  - Charts showing workout volume vs. run pace over time
- [ ] **Smart recovery recommendations**
  - "Don't schedule long runs the day after heavy leg day"
  - "Your body performs best with 2 rest days between squats and speed work"
  - Fatigue score combining running + lifting volume
- [ ] **Integrated training calendar**
  - Visual calendar showing both running and gym workouts
  - Conflict detection (hard run + heavy squats same day = warning)
  - Suggested weekly balance (3 runs + 2 gym sessions)
- [ ] **Strength benchmarks for runners**
  - "Runners at your pace typically squat 1.5x bodyweight"
  - Identify strength gaps that might limit running performance
  - Injury prevention through balanced muscle development

### Why This Matters
**This is what makes RouteIQ unique.** Strava tracks runs. Hevy tracks gym. Nobody connects the two with actionable, data-driven insights.

### Success Metrics (Phase 5)
- [ ] 60%+ of users log both runs and workouts
- [ ] Users rate cross-training insights 4.5+ stars
- [ ] "Aha moments" captured in user feedback
- [ ] Higher retention for users who use both features

---

## 📋 Phase 6: Mobile App & AI Features (2026)
**Goal:** Full-featured mobile experience with intelligent coaching

### Native Mobile App
- [ ] **iOS & Android apps**
  - GPS tracking for runs
  - Offline workout logging
  - Push notifications (rest timer, workout reminders)
  - Faster, more native experience
- [ ] **Wearable integration**
  - Garmin Connect
  - Apple Watch
  - Polar, Coros, Fitbit
  - Heart rate data sync
  - Auto-import runs from wearables

### AI & Advanced Analytics
- [ ] **AI Training Coach**
  - ChatGPT-style interface for training advice
  - "What should I do today?" → suggests workout or run
  - Analyzes your history to give personalized recommendations
- [ ] **Automated training plans**
  - "I want to run a half marathon in 12 weeks" → generates full plan
  - Combines running and strength training
  - Adjusts based on your actual performance
- [ ] **Injury risk prediction**
  - Machine learning model that spots overtraining patterns
  - Warns before injury occurs
  - Suggests deload weeks proactively

---

## 🐛 Known Issues & Technical Debt

### High Priority (Fix in Phase 2)
- [ ] **Workout stats API endpoint missing**
  - WorkoutStats component calls API that doesn't exist
  - Need to implement `GET /api/workouts/stats?period=week`
  - Should return: totalWorkouts, totalVolume, totalExercises, averageWorkoutDuration
- [ ] **Exercise dropdown on production**
  - Verify exercises seed correctly on Vercel deployment
  - Test dropdown loads all 22 exercises
  - Handle loading states
- [ ] **Template loading on new workout page**
  - Sometimes templates don't load initially
  - Add retry logic and better error handling
- [ ] **Static landing page serving**
  - `/static-landing/index.html` might not be served correctly on Vercel
  - Need to configure `public` folder or add rewrite rule
  - Test "Learn More" button on production

### Medium Priority (Fix in Phase 2 or 3)
- [ ] **Set completion state lost on page refresh**
  - If user refreshes page mid-workout, checkboxes reset
  - Should persist to localStorage
- [ ] **Workout name auto-generation**
  - Currently uses first exercise name + count
  - Should be smarter (e.g., "Upper Body Push - Nov 26")
- [ ] **Template quick-start on dashboard**
  - Dashboard shows templates but doesn't highlight "most used"
  - Add "Last workout" and "Frequently used" sections

### Low Priority (Tech debt)
- [ ] **Mobile keyboard covering inputs**
  - When entering weight/reps, keyboard covers the input
  - Use `scrollIntoView()` or adjust viewport
- [ ] **Long exercise names overflow**
  - Exercise names like "Bulgarian Split Squat" wrap awkwardly
  - Truncate with ellipsis or use smaller font
- [ ] **Timezone handling for dates**
  - Date picker might show wrong date due to UTC conversion
  - Use user's local timezone consistently
- [ ] **API error handling**
  - Some API calls don't handle 500 errors gracefully
  - Add global error boundary and retry logic

---

## 📊 Success Metrics & KPIs

### Phase 1 Goals (Current)
- [x] Users can complete a full workout from template
- [ ] Users can view their workout history
- [ ] 90%+ of exercises display correctly
- [ ] Dashboard loads in < 2 seconds

### Phase 2 Goals
- [ ] 100+ active users (logged in past 7 days)
- [ ] 80%+ workout completion rate
- [ ] Users create 2+ custom templates on average
- [ ] Users log workouts 3+ times per week
- [ ] < 5% error rate on workout submission

### Phase 3 Goals
- [ ] 200+ active users
- [ ] 40% of users log both workouts and runs
- [ ] Average 2+ runs logged per week (for runners)
- [ ] 60% monthly retention rate

### Long-Term Goals (12 months)
- [ ] 500+ active users
- [ ] 50+ paying subscribers (if we add premium tier)
- [ ] 4.5+ star rating
- [ ] Users report measurable performance improvements
- [ ] Featured in fitness communities (Reddit, ProductHunt)

---

## 💰 Monetization Strategy (Future)

### Free Tier (Forever Free)
- Unlimited workouts
- Unlimited runs
- All templates
- Basic analytics
- Mobile app access

### Pro Tier ($6-8/month) - Phase 4+
- Advanced analytics & charts
- Cross-training correlation insights
- Performance predictions
- AI training coach
- Export data (CSV, PDF)
- Priority support

### Coach Tier ($25-40/month) - Phase 5+
- Everything in Pro
- Manage multiple athletes
- Team dashboard
- Custom branding
- API access

---

## 🎨 Design & UX Improvements

### Immediate (Phase 2)
- [ ] Loading skeletons for all components
- [ ] Error states with helpful messages
- [ ] Toast/snackbar notifications for actions
- [ ] Empty state illustrations (when no data)
- [ ] Consistent button sizing and spacing

### Near-term (Phase 2-3)
- [ ] Dark mode support
- [ ] Customizable dashboard widgets
- [ ] In-progress workout indicator (sticky header)
- [ ] Quick actions floating button (FAB)
- [ ] Smooth page transitions

### Long-term (Phase 4+)
- [ ] Custom themes/colors
- [ ] Accessibility improvements (WCAG AA)
- [ ] Internationalization (i18n) - Spanish, French, German
- [ ] Onboarding flow for new users
- [ ] Interactive tutorials

---

## 🚀 Release Schedule

### v0.2.0 - Fitness MVP ✅ (Nov 26, 2024)
- Dashboard redesign
- Default workout templates
- Seed script automation

### v0.3.0 - Workout Analytics (Dec 16, 2024)
- Workout detail pages
- Exercise history and PRs
- Weekly/monthly stats dashboard
- Fix workout stats API endpoint

### v0.4.0 - Template Management (Jan 6, 2025)
- Edit/delete templates
- Template categories
- Exercise library expansion (+30 exercises)
- Custom exercise creation

### v0.5.0 - Progressive Overload (Jan 27, 2025)
- Smart weight suggestions
- Enhanced rest timer
- Workout notes and ratings
- Mobile UX improvements

### v0.6.0 - Running Features (Feb 17, 2025)
- Indoor run logging
- Run history and stats
- Personal records for runs
- Simple route management

### v1.0.0 - Full Product (March 2025)
- Route generation with maps
- GPS tracking (PWA)
- Route discovery
- Polish and bug fixes

### v1.5.0 - Cross-Training Intelligence (Q2 2025)
- Performance correlations
- Recovery recommendations
- Integrated training calendar

### v2.0.0 - Mobile App & AI (Q3-Q4 2025)
- Native mobile apps
- AI training coach
- Wearable integrations

---

## 🧪 Testing & Quality Assurance

### Manual Testing Checklist (Before Each Release)
- [ ] Sign up / login flow
- [ ] Create workout template
- [ ] Start workout from template
- [ ] Log sets, mark complete
- [ ] Finish workout and view summary
- [ ] View workout history
- [ ] Edit template
- [ ] Delete template
- [ ] Dashboard loads correctly
- [ ] Mobile responsive design
- [ ] Offline behavior (if applicable)

### Automated Testing (Future)
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests with Playwright/Cypress
- [ ] Performance testing (Lighthouse)
- [ ] Load testing (k6 or Artillery)

---

## ❓ Open Questions

1. **Exercise library scope:** Should we aim for 50, 100, or 500+ exercises?
   - **Decision:** Start with 50 high-quality exercises, expand based on user requests

2. **Premium features:** What goes behind paywall vs. stays free?
   - **Decision:** Core workout/run tracking stays free forever. Advanced analytics and AI coach are Pro features.

3. **Mobile strategy:** PWA first or jump straight to native apps?
   - **Decision:** PWA for Phase 1-3, native apps in Phase 6 if traction is good

4. **Social features:** Friends, leaderboards, challenges?
   - **Decision:** Not in MVP. Consider in Phase 5 if users request it.

5. **Data privacy:** How to handle user workout data?
   - **Decision:** Full data ownership, easy export, GDPR compliant, never sell data

---

## 📝 Notes

- **Why fitness-first?** Workout tracking delivers immediate value, requires less complex infrastructure (no maps, GPS, routing algorithms), and has clearer user flows. We can validate the product faster.

- **What about the "RouteIQ" name?** We'll keep it. The intelligent route optimization is still the long-term vision (Phase 4+), but we're building the foundation with fitness tracking first.

- **When will route features come?** Once we have 100+ active users who love the workout tracking, we'll add running features. Then route optimization in Phase 4.

- **Mobile app timeline?** PWA works great for now. Native apps are expensive to build and maintain. We'll only do native if we see strong demand and have resources.

---

**Last updated:** November 26, 2024
**Next review:** December 16, 2024 (after v0.3.0 release)
