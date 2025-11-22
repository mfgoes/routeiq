export interface WorkoutSettings {
  progressiveOverloadIncrement: number;
  defaultRestTime: number;
  autoSuggestWeights: boolean;
}

export const DEFAULT_WORKOUT_SETTINGS: WorkoutSettings = {
  progressiveOverloadIncrement: 5,
  defaultRestTime: 90,
  autoSuggestWeights: true,
};

export function getWorkoutSettings(): WorkoutSettings {
  if (typeof window === 'undefined') return DEFAULT_WORKOUT_SETTINGS;

  const stored = localStorage.getItem('routeiq_workout_settings');
  if (stored) {
    try {
      return { ...DEFAULT_WORKOUT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Error loading workout settings', e);
    }
  }
  return DEFAULT_WORKOUT_SETTINGS;
}

export function saveWorkoutSettings(settings: WorkoutSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('routeiq_workout_settings', JSON.stringify(settings));
}
