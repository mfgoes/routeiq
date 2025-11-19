# RouteIQ Database Schema

**Database:** PostgreSQL 14+
**ORM Consideration:** Prisma (Node.js) or SQLAlchemy (Python)
**Migration Strategy:** Version-controlled migrations

---

## Schema Overview

```
users
  ├─> routes (one-to-many)
  ├─> activities (one-to-many)
  ├─> workouts (one-to-many)
  ├─> user_settings (one-to-one)
  └─> strava_connections (one-to-one)

routes
  └─> activities (one-to-many)

workouts
  └─> workout_exercises (one-to-many)
      └─> exercises (many-to-one)

activities + workouts
  └─> insights (cross-training analytics)
```

---

## Core Tables

### users
Primary user account information

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20), -- optional, for analytics
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(20) DEFAULT 'free', -- free, pro, coach
  subscription_expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_expires_at);
```

**Notes:**
- UUID for better scalability and security
- Store password hash only, never plaintext
- `subscription_tier` gates feature access
- `is_active` for soft deletes

---

### user_settings
User preferences and configuration

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Units & Display
  distance_unit VARCHAR(10) DEFAULT 'km', -- km, mi
  elevation_unit VARCHAR(10) DEFAULT 'm', -- m, ft
  weight_unit VARCHAR(10) DEFAULT 'kg', -- kg, lbs
  temperature_unit VARCHAR(10) DEFAULT 'celsius',

  -- Running Preferences
  fitness_level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced, elite
  primary_goal VARCHAR(50), -- 5k, 10k, half_marathon, marathon, fitness, weight_loss
  weekly_mileage_target DECIMAL(5,2),

  -- Privacy
  profile_visibility VARCHAR(20) DEFAULT 'private', -- private, friends, public
  share_routes_default BOOLEAN DEFAULT FALSE,

  -- Notifications
  email_notifications BOOLEAN DEFAULT TRUE,
  weekly_summary BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_settings_user ON user_settings(user_id);
```

---

### strava_connections
OAuth integration with Strava

```sql
CREATE TABLE strava_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  strava_athlete_id BIGINT UNIQUE NOT NULL,
  access_token VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  token_expires_at TIMESTAMP NOT NULL,

  scope TEXT, -- permissions granted
  connected_at TIMESTAMP DEFAULT NOW(),
  last_sync_at TIMESTAMP,

  -- Sync settings
  auto_sync BOOLEAN DEFAULT TRUE,
  sync_activities BOOLEAN DEFAULT TRUE,
  sync_routes BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_strava_user ON strava_connections(user_id);
CREATE INDEX idx_strava_athlete ON strava_connections(strava_athlete_id);
```

**Security Notes:**
- Encrypt `access_token` and `refresh_token` at rest
- Rotate tokens using refresh flow before expiry
- Store minimal scope needed

---

## Running Tables

### routes
Saved and generated running routes

```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Route Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  distance DECIMAL(6,2) NOT NULL, -- in meters
  elevation_gain DECIMAL(6,2), -- in meters
  elevation_loss DECIMAL(6,2),

  -- Route Data (GeoJSON)
  route_geometry JSONB NOT NULL, -- { "type": "LineString", "coordinates": [...] }
  start_point GEOGRAPHY(POINT, 4326), -- PostGIS extension
  end_point GEOGRAPHY(POINT, 4326),

  -- Route Properties
  route_type VARCHAR(20) DEFAULT 'loop', -- loop, out_and_back, point_to_point
  surface_type VARCHAR(30)[], -- ['road', 'trail', 'track']
  difficulty_rating VARCHAR(20), -- easy, moderate, hard, expert
  estimated_time INTEGER, -- in seconds

  -- Metadata
  is_public BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  times_completed INTEGER DEFAULT 0,
  source VARCHAR(50) DEFAULT 'generated', -- generated, imported, manual, strava
  strava_route_id BIGINT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_routes_user ON routes(user_id);
CREATE INDEX idx_routes_public ON routes(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_routes_favorite ON routes(user_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX idx_routes_distance ON routes(distance);
-- PostGIS spatial index
CREATE INDEX idx_routes_start_point ON routes USING GIST(start_point);
```

**Notes:**
- Use PostGIS extension for geographic queries
- `route_geometry` stores full route as GeoJSON
- `surface_type` as array allows mixed surfaces
- `difficulty_rating` can be personalized per user later

---

### activities
Completed runs (logged or synced from Strava)

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,

  -- Activity Details
  name VARCHAR(255),
  activity_type VARCHAR(30) DEFAULT 'run', -- run, trail_run, race, recovery_run
  started_at TIMESTAMP NOT NULL,

  -- Performance Metrics
  distance DECIMAL(6,2) NOT NULL, -- meters
  duration INTEGER NOT NULL, -- seconds
  moving_time INTEGER, -- seconds (excludes stops)
  elevation_gain DECIMAL(6,2),
  elevation_loss DECIMAL(6,2),

  -- Pace & Speed
  average_pace DECIMAL(5,2), -- min/km or min/mi
  average_speed DECIMAL(5,2), -- km/h or mph
  max_speed DECIMAL(5,2),

  -- Heart Rate (if available)
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,

  -- Additional Data
  calories INTEGER,
  temperature DECIMAL(4,1), -- celsius
  weather_conditions VARCHAR(50), -- sunny, cloudy, rainy, etc.
  perceived_effort INTEGER, -- 1-10 scale (RPE)

  -- Activity Data
  gps_data JSONB, -- Full GPS track if needed
  splits JSONB, -- Per-km or per-mile splits

  -- Source & Sync
  source VARCHAR(50) DEFAULT 'manual', -- manual, strava, garmin, apple_watch
  strava_activity_id BIGINT UNIQUE,
  external_id VARCHAR(255),

  -- Metadata
  notes TEXT,
  is_race BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_started ON activities(user_id, started_at DESC);
CREATE INDEX idx_activities_route ON activities(route_id);
CREATE INDEX idx_activities_strava ON activities(strava_activity_id);
CREATE INDEX idx_activities_type ON activities(activity_type);
```

**Notes:**
- Link to `route_id` if activity followed a saved route
- Store `strava_activity_id` to prevent duplicate imports
- `perceived_effort` (RPE) for training load calculations
- `splits` as JSONB for flexible per-km/mi data

---

## Workout Tables

### exercises
Master list of exercises (seeded data)

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Exercise Info
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- lower_body, upper_body, core, cardio, mobility
  muscle_groups VARCHAR(50)[], -- ['quadriceps', 'glutes', 'hamstrings']
  equipment VARCHAR(50)[], -- ['barbell', 'dumbbells', 'bodyweight']

  -- Exercise Properties
  is_compound BOOLEAN DEFAULT FALSE, -- compound vs isolation
  difficulty_level VARCHAR(20), -- beginner, intermediate, advanced

  -- Metadata
  description TEXT,
  instructions TEXT,
  video_url VARCHAR(500),

  -- Custom exercises
  is_custom BOOLEAN DEFAULT FALSE,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_custom ON exercises(created_by_user_id) WHERE is_custom = TRUE;

-- Seed data examples
INSERT INTO exercises (name, category, muscle_groups, equipment, is_compound) VALUES
  ('Back Squat', 'lower_body', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell'], TRUE),
  ('Deadlift', 'lower_body', ARRAY['hamstrings', 'glutes', 'lower_back'], ARRAY['barbell'], TRUE),
  ('Bench Press', 'upper_body', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell'], TRUE),
  ('Pull-ups', 'upper_body', ARRAY['lats', 'biceps'], ARRAY['bodyweight'], TRUE),
  ('Lunges', 'lower_body', ARRAY['quadriceps', 'glutes'], ARRAY['bodyweight', 'dumbbells'], TRUE),
  ('Plank', 'core', ARRAY['abs', 'core'], ARRAY['bodyweight'], FALSE);
```

**Notes:**
- Pre-seed with ~50 common exercises
- Allow users to create custom exercises
- `muscle_groups` array for smart recovery recommendations
- Focus on exercises relevant to runners (lower body, core)

---

### workouts
Individual workout sessions

```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Workout Details
  name VARCHAR(255), -- "Leg Day", "Upper Body", etc.
  workout_type VARCHAR(50), -- strength, mobility, cross_training
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,

  -- Performance
  total_duration INTEGER, -- seconds
  total_volume DECIMAL(10,2), -- sum of (sets × reps × weight) in kg
  total_reps INTEGER,

  -- Subjective Metrics
  perceived_effort INTEGER, -- 1-10 RPE
  energy_level INTEGER, -- 1-10 scale

  -- Metadata
  notes TEXT,
  location VARCHAR(100), -- gym name, home, etc.

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workouts_user ON workouts(user_id);
CREATE INDEX idx_workouts_started ON workouts(user_id, started_at DESC);
CREATE INDEX idx_workouts_type ON workouts(workout_type);
```

---

### workout_exercises
Individual exercises within a workout (sets/reps/weight)

```sql
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,

  -- Exercise Order
  exercise_order INTEGER NOT NULL, -- 1, 2, 3... order in workout

  -- Set Data (array for multiple sets)
  sets JSONB NOT NULL,
  -- Example: [
  --   {"set": 1, "reps": 10, "weight": 60, "rest_seconds": 90, "rpe": 7},
  --   {"set": 2, "reps": 10, "weight": 60, "rest_seconds": 90, "rpe": 8},
  --   {"set": 3, "reps": 8, "weight": 60, "rest_seconds": 0, "rpe": 9}
  -- ]

  -- Calculated Totals
  total_sets INTEGER,
  total_reps INTEGER,
  total_volume DECIMAL(10,2), -- sum of all sets (reps × weight)
  max_weight DECIMAL(6,2),

  -- Notes
  notes TEXT,
  is_personal_record BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise ON workout_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_order ON workout_exercises(workout_id, exercise_order);
```

**Notes:**
- Flexible `sets` JSONB allows different set types (straight sets, drop sets, etc.)
- `exercise_order` ensures correct display sequence
- Calculate `total_volume` for progressive overload tracking
- Tag `is_personal_record` automatically when new max detected

---

## Analytics & Insights Tables

### user_stats
Pre-calculated aggregate statistics (updated daily)

```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Time Period
  stat_date DATE NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly, yearly, all_time

  -- Running Stats
  total_runs INTEGER DEFAULT 0,
  total_distance DECIMAL(10,2) DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- seconds
  total_elevation_gain DECIMAL(10,2) DEFAULT 0,
  average_pace DECIMAL(5,2),
  best_pace DECIMAL(5,2),

  -- Workout Stats
  total_workouts INTEGER DEFAULT 0,
  total_workout_duration INTEGER DEFAULT 0,
  total_volume DECIMAL(10,2) DEFAULT 0, -- kg lifted

  -- Combined
  total_training_days INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, stat_date, period_type)
);

CREATE INDEX idx_user_stats_user_date ON user_stats(user_id, stat_date DESC);
CREATE INDEX idx_user_stats_period ON user_stats(user_id, period_type, stat_date DESC);
```

---

### insights
Cross-training correlation insights (Phase 4)

```sql
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Insight Details
  insight_type VARCHAR(50) NOT NULL, -- correlation, recommendation, achievement, warning
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,

  -- Data References
  related_activities UUID[], -- array of activity IDs
  related_workouts UUID[], -- array of workout IDs

  -- Metrics
  correlation_strength DECIMAL(4,3), -- -1 to 1 for correlations
  confidence_score DECIMAL(4,3), -- 0 to 1

  -- Metadata
  generated_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0, -- higher = more important

  expires_at TIMESTAMP -- insights can expire if no longer relevant
);

CREATE INDEX idx_insights_user ON insights(user_id);
CREATE INDEX idx_insights_unread ON insights(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_insights_type ON insights(user_id, insight_type);
```

**Example insights:**
- "Your squat strength increased 12% this month. Your hill running pace improved 6%."
- "You typically run slower the day after heavy leg workouts. Consider recovery runs."
- "Your pull-up progression correlates with better upper body posture during long runs."

---

## Supporting Tables

### personal_records
Track PRs for exercises and running distances

```sql
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Record Type
  record_type VARCHAR(30) NOT NULL, -- running_distance, exercise_weight, exercise_reps

  -- Running PRs
  distance DECIMAL(6,2), -- for running PRs (5k, 10k, etc.)
  duration INTEGER, -- fastest time for distance
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,

  -- Exercise PRs
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  weight DECIMAL(6,2),
  reps INTEGER,
  workout_exercise_id UUID REFERENCES workout_exercises(id) ON DELETE SET NULL,

  -- Metadata
  achieved_at TIMESTAMP NOT NULL,
  previous_record_id UUID REFERENCES personal_records(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pr_user ON personal_records(user_id);
CREATE INDEX idx_pr_type ON personal_records(user_id, record_type);
CREATE INDEX idx_pr_exercise ON personal_records(exercise_id) WHERE exercise_id IS NOT NULL;
```

---

### goals
User-defined training goals

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Goal Details
  goal_type VARCHAR(50) NOT NULL, -- race, distance, weight, fitness
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Target Metrics
  target_date DATE,
  target_distance DECIMAL(6,2), -- for race goals
  target_time INTEGER, -- target completion time
  target_weight DECIMAL(6,2), -- for lifting goals

  -- Progress
  status VARCHAR(20) DEFAULT 'active', -- active, completed, abandoned, paused
  progress_percentage DECIMAL(5,2) DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(user_id, status);
CREATE INDEX idx_goals_target_date ON goals(target_date) WHERE status = 'active';
```

---

## Indexes Strategy

**Priority 1 (Immediate):**
- User lookups by email (login)
- Activities by user, sorted by date (dashboard)
- Routes by user (library view)
- Workouts by user, sorted by date (history)

**Priority 2 (Phase 2-3):**
- Public routes (community features)
- Strava sync queries
- Exercise lookups by category
- PR tracking by exercise

**Priority 3 (Phase 4):**
- Insights filtering
- Geographic searches (PostGIS)
- Stats aggregation queries

---

## Data Retention Policy

**Active Users:**
- Keep all data indefinitely

**Inactive Users (12+ months no login):**
- Keep aggregated stats
- Archive detailed activity/workout data to cold storage
- Send notification before archival

**Deleted Accounts:**
- 30-day soft delete (is_active = false)
- After 30 days: anonymize + remove PII
- Keep anonymized aggregate data for analytics

---

## Performance Considerations

1. **Partitioning:**
   - Partition `activities` and `workouts` by date (monthly or quarterly)
   - Keeps recent queries fast

2. **Materialized Views:**
   - Pre-calculate weekly/monthly stats
   - Refresh nightly via cron job

3. **Caching:**
   - Redis cache for user settings, exercise list
   - Cache public routes (popular endpoints)

4. **JSONB Indexing:**
   - Create GIN indexes on JSONB columns if querying specific fields
   ```sql
   CREATE INDEX idx_route_geometry_coordinates ON routes USING GIN (route_geometry);
   ```

5. **Query Optimization:**
   - Use `EXPLAIN ANALYZE` to profile slow queries
   - Add composite indexes for common query patterns

---

## Migration Strategy

**Phase 1: Core tables**
```
001_create_users.sql
002_create_user_settings.sql
003_create_routes.sql
004_create_activities.sql
005_create_indexes_phase1.sql
```

**Phase 2: Social + Advanced**
```
006_create_strava_connections.sql
007_create_goals.sql
008_create_user_stats.sql
```

**Phase 3: Workout tracking**
```
009_create_exercises.sql
010_seed_exercises.sql
011_create_workouts.sql
012_create_workout_exercises.sql
013_create_personal_records.sql
```

**Phase 4: Cross-training insights**
```
014_create_insights.sql
015_add_correlation_columns.sql
016_create_analytics_views.sql
```

---

## Security Best Practices

1. **Encrypt at Rest:**
   - Strava tokens
   - Any API keys stored in database
   - Consider using PostgreSQL encryption extensions

2. **Row-Level Security:**
   - Enable RLS on all user-specific tables
   - Ensure users can only access their own data
   ```sql
   ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
   CREATE POLICY activities_user_policy ON activities
     FOR ALL USING (user_id = current_user_id());
   ```

3. **Parameterized Queries:**
   - Always use ORM or prepared statements
   - Never concatenate user input into SQL

4. **Audit Logging:**
   - Consider adding `created_by`, `updated_by` columns
   - Log sensitive operations (account deletion, data export)

---

## Backup Strategy

**Daily Backups:**
- Full database dump at 3 AM UTC
- Retain 30 days of daily backups

**Weekly Backups:**
- Full backup every Sunday
- Retain 12 weeks

**Monthly Backups:**
- First Sunday of month
- Retain 12 months

**Test Restores:**
- Quarterly restore test to staging environment
- Document restore procedures

---

## Sample Queries

### Get user's last 10 runs
```sql
SELECT
  a.name,
  a.distance / 1000 AS distance_km,
  a.duration / 60 AS duration_minutes,
  a.average_pace,
  a.started_at,
  r.name AS route_name
FROM activities a
LEFT JOIN routes r ON a.route_id = r.id
WHERE a.user_id = $1
  AND a.activity_type = 'run'
ORDER BY a.started_at DESC
LIMIT 10;
```

### Calculate monthly training volume
```sql
SELECT
  DATE_TRUNC('month', started_at) AS month,
  COUNT(*) AS total_workouts,
  SUM(total_volume) AS total_volume_kg,
  AVG(perceived_effort) AS avg_rpe
FROM workouts
WHERE user_id = $1
  AND started_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', started_at)
ORDER BY month DESC;
```

### Find PRs for an exercise
```sql
SELECT
  pr.weight,
  pr.reps,
  pr.achieved_at,
  e.name AS exercise_name
FROM personal_records pr
JOIN exercises e ON pr.exercise_id = e.id
WHERE pr.user_id = $1
  AND pr.exercise_id = $2
  AND pr.record_type = 'exercise_weight'
ORDER BY pr.weight DESC, pr.achieved_at DESC
LIMIT 1;
```

### Correlation query (Phase 4)
```sql
-- Find correlation between squat strength and running pace
WITH squat_progress AS (
  SELECT
    DATE_TRUNC('week', w.started_at) AS week,
    AVG(we.max_weight) AS avg_squat_weight
  FROM workouts w
  JOIN workout_exercises we ON w.id = we.workout_id
  JOIN exercises e ON we.exercise_id = e.id
  WHERE w.user_id = $1
    AND e.name = 'Back Squat'
    AND w.started_at >= NOW() - INTERVAL '6 months'
  GROUP BY week
),
running_pace AS (
  SELECT
    DATE_TRUNC('week', started_at) AS week,
    AVG(average_pace) AS avg_pace
  FROM activities
  WHERE user_id = $1
    AND activity_type = 'run'
    AND started_at >= NOW() - INTERVAL '6 months'
  GROUP BY week
)
SELECT
  s.week,
  s.avg_squat_weight,
  r.avg_pace,
  CORR(s.avg_squat_weight, r.avg_pace) OVER () AS correlation
FROM squat_progress s
JOIN running_pace r ON s.week = r.week
ORDER BY s.week;
```

---

**Last updated:** November 19, 2025
