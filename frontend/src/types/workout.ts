export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  isCompound: boolean;
  difficultyLevel?: string;
  description?: string;
  instructions?: string;
  videoUrl?: string;
  isCustom: boolean;
  createdByUserId?: string;
  createdAt: string;
}

export interface WorkoutSet {
  set: number;
  reps: number;
  weight?: number;
  restSeconds?: number;
  rpe?: number;
  notes?: string;
}

export interface WorkoutExerciseInput {
  exerciseId: string;
  exerciseOrder: number;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exerciseOrder: number;
  sets: WorkoutSet[];
  totalSets?: number;
  totalReps?: number;
  totalVolume?: number;
  maxWeight?: number;
  notes?: string;
  isPersonalRecord: boolean;
  createdAt: string;
  exercise: Exercise;
}

export interface Workout {
  id: string;
  userId: string;
  name?: string;
  workoutType?: string;
  startedAt: string;
  completedAt?: string;
  totalDuration?: number;
  totalVolume?: number;
  totalReps?: number;
  perceivedEffort?: number;
  energyLevel?: number;
  notes?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutExercise[];
}

export interface CreateWorkoutInput {
  name?: string;
  workoutType?: string;
  startedAt: string;
  completedAt?: string;
  perceivedEffort?: number;
  energyLevel?: number;
  notes?: string;
  location?: string;
  exercises: WorkoutExerciseInput[];
}

export interface UpdateWorkoutInput {
  name?: string;
  workoutType?: string;
  perceivedEffort?: number;
  energyLevel?: number;
  notes?: string;
  location?: string;
}
