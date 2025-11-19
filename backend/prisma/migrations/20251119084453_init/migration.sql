-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "date_of_birth" DATE,
    "gender" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "subscription_tier" TEXT NOT NULL DEFAULT 'free',
    "subscription_expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "distance_unit" TEXT NOT NULL DEFAULT 'km',
    "elevation_unit" TEXT NOT NULL DEFAULT 'm',
    "weight_unit" TEXT NOT NULL DEFAULT 'kg',
    "temperature_unit" TEXT NOT NULL DEFAULT 'celsius',
    "fitness_level" TEXT NOT NULL DEFAULT 'intermediate',
    "primary_goal" TEXT,
    "weekly_mileage_target" DECIMAL(5,2),
    "profile_visibility" TEXT NOT NULL DEFAULT 'private',
    "share_routes_default" BOOLEAN NOT NULL DEFAULT false,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "weekly_summary" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strava_connections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "strava_athlete_id" BIGINT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "token_expires_at" TIMESTAMP(3) NOT NULL,
    "scope" TEXT,
    "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_sync_at" TIMESTAMP(3),
    "auto_sync" BOOLEAN NOT NULL DEFAULT true,
    "sync_activities" BOOLEAN NOT NULL DEFAULT true,
    "sync_routes" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "strava_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "distance" DECIMAL(6,2) NOT NULL,
    "elevation_gain" DECIMAL(6,2),
    "elevation_loss" DECIMAL(6,2),
    "route_geometry" JSONB NOT NULL,
    "start_point_lat" DECIMAL(10,7),
    "start_point_lng" DECIMAL(10,7),
    "end_point_lat" DECIMAL(10,7),
    "end_point_lng" DECIMAL(10,7),
    "route_type" TEXT NOT NULL DEFAULT 'loop',
    "surface_types" TEXT[],
    "difficulty_rating" TEXT,
    "estimated_time" INTEGER,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "times_completed" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'generated',
    "strava_route_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "route_id" TEXT,
    "name" TEXT,
    "activity_type" TEXT NOT NULL DEFAULT 'run',
    "started_at" TIMESTAMP(3) NOT NULL,
    "distance" DECIMAL(6,2) NOT NULL,
    "duration" INTEGER NOT NULL,
    "moving_time" INTEGER,
    "elevation_gain" DECIMAL(6,2),
    "elevation_loss" DECIMAL(6,2),
    "average_pace" DECIMAL(5,2),
    "average_speed" DECIMAL(5,2),
    "max_speed" DECIMAL(5,2),
    "average_heart_rate" INTEGER,
    "max_heart_rate" INTEGER,
    "calories" INTEGER,
    "temperature" DECIMAL(4,1),
    "weather_conditions" TEXT,
    "perceived_effort" INTEGER,
    "gps_data" JSONB,
    "splits" JSONB,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "strava_activity_id" BIGINT,
    "external_id" TEXT,
    "notes" TEXT,
    "is_race" BOOLEAN NOT NULL DEFAULT false,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "muscle_groups" TEXT[],
    "equipment" TEXT[],
    "is_compound" BOOLEAN NOT NULL DEFAULT false,
    "difficulty_level" TEXT,
    "description" TEXT,
    "instructions" TEXT,
    "video_url" TEXT,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "workout_type" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "total_duration" INTEGER,
    "total_volume" DECIMAL(10,2),
    "total_reps" INTEGER,
    "perceived_effort" INTEGER,
    "energy_level" INTEGER,
    "notes" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_exercises" (
    "id" TEXT NOT NULL,
    "workout_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "exercise_order" INTEGER NOT NULL,
    "sets" JSONB NOT NULL,
    "total_sets" INTEGER,
    "total_reps" INTEGER,
    "total_volume" DECIMAL(10,2),
    "max_weight" DECIMAL(6,2),
    "notes" TEXT,
    "is_personal_record" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "goal_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "target_date" DATE,
    "target_distance" DECIMAL(6,2),
    "target_time" INTEGER,
    "target_weight" DECIMAL(6,2),
    "status" TEXT NOT NULL DEFAULT 'active',
    "progress_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "record_type" TEXT NOT NULL,
    "distance" DECIMAL(6,2),
    "duration" INTEGER,
    "activity_id" TEXT,
    "exercise_id" TEXT,
    "weight" DECIMAL(6,2),
    "reps" INTEGER,
    "workout_exercise_id" TEXT,
    "achieved_at" TIMESTAMP(3) NOT NULL,
    "previous_record_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "strava_connections_user_id_key" ON "strava_connections"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "strava_connections_strava_athlete_id_key" ON "strava_connections"("strava_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "routes_strava_route_id_key" ON "routes"("strava_route_id");

-- CreateIndex
CREATE INDEX "routes_user_id_idx" ON "routes"("user_id");

-- CreateIndex
CREATE INDEX "routes_is_public_idx" ON "routes"("is_public");

-- CreateIndex
CREATE INDEX "routes_user_id_is_favorite_idx" ON "routes"("user_id", "is_favorite");

-- CreateIndex
CREATE UNIQUE INDEX "activities_strava_activity_id_key" ON "activities"("strava_activity_id");

-- CreateIndex
CREATE INDEX "activities_user_id_idx" ON "activities"("user_id");

-- CreateIndex
CREATE INDEX "activities_user_id_started_at_idx" ON "activities"("user_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "activities_route_id_idx" ON "activities"("route_id");

-- CreateIndex
CREATE INDEX "activities_activity_type_idx" ON "activities"("activity_type");

-- CreateIndex
CREATE INDEX "exercises_category_idx" ON "exercises"("category");

-- CreateIndex
CREATE INDEX "workouts_user_id_idx" ON "workouts"("user_id");

-- CreateIndex
CREATE INDEX "workouts_user_id_started_at_idx" ON "workouts"("user_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "workout_exercises_workout_id_idx" ON "workout_exercises"("workout_id");

-- CreateIndex
CREATE INDEX "workout_exercises_exercise_id_idx" ON "workout_exercises"("exercise_id");

-- CreateIndex
CREATE INDEX "workout_exercises_workout_id_exercise_order_idx" ON "workout_exercises"("workout_id", "exercise_order");

-- CreateIndex
CREATE INDEX "goals_user_id_idx" ON "goals"("user_id");

-- CreateIndex
CREATE INDEX "goals_user_id_status_idx" ON "goals"("user_id", "status");

-- CreateIndex
CREATE INDEX "personal_records_user_id_idx" ON "personal_records"("user_id");

-- CreateIndex
CREATE INDEX "personal_records_user_id_record_type_idx" ON "personal_records"("user_id", "record_type");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strava_connections" ADD CONSTRAINT "strava_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
