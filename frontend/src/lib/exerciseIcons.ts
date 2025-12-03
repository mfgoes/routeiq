import type { Exercise } from '@/types/workout';

// Map exercise categories to icon filenames
const CATEGORY_ICONS: Record<string, string> = {
  'chest': 'equipment-chest-press.png',
  'back': 'body-part-muscle.png',
  'legs': 'body-part-leg.png',
  'shoulders': 'body-part-muscle.png',
  'arms': 'body-part-muscle.png',
  'biceps': 'body-part-muscle.png',
  'triceps': 'body-part-muscle.png',
  'core': 'body-part-six-pack.png',
  'abs': 'body-part-six-pack.png',
  'cardio': 'workout-run.png',
  'full_body': 'workout-sport.png',
  'olympic_lifts': 'equipment-weightlifting.png',
  'stretching': 'workout-stretching.png',
  'warmup': 'workout-warm-up.png',
};

// Map equipment types to icon filenames
const EQUIPMENT_ICONS: Record<string, string> = {
  'barbell': 'equipment-weightlifting.png',
  'dumbbell': 'dumbbell-01.png',
  'dumbbells': 'dumbbell-01.png',
  'kettlebell': 'kettlebell.png',
  'bodyweight': 'body-weight.png',
  'body weight': 'body-weight.png',
  'machine': 'equipment-gym-01.png',
  'cable': 'equipment-gym-02.png',
  'resistance_band': 'expander.png',
  'resistance band': 'expander.png',
  'bench': 'equipment-bench-press.png',
  'pull_up_bar': 'gymnastic-rings.png',
  'rings': 'gymnastic-rings.png',
  'battle_ropes': 'workout-battle-ropes.png',
  'battle ropes': 'workout-battle-ropes.png',
  'box': 'equipment-gym-03.png',
  'treadmill': 'treadmill-01.png',
  'rowing_machine': 'equipment-gym-02.png',
  'yoga_mat': 'yoga-mat.png',
  'yoga mat': 'yoga-mat.png',
};

/**
 * Get the appropriate icon URL for an exercise
 * Priority: equipment > category > default
 */
export function getExerciseIcon(exercise: Exercise): string {
  // Check equipment first (higher priority)
  const equipment = exercise.equipment?.[0]?.toLowerCase().replace(/_/g, ' ');
  if (equipment && EQUIPMENT_ICONS[equipment]) {
    return `/icons/gym/${EQUIPMENT_ICONS[equipment]}`;
  }

  // Fall back to category
  const category = exercise.category.toLowerCase().replace(/_/g, ' ');
  if (CATEGORY_ICONS[category]) {
    return `/icons/gym/${CATEGORY_ICONS[category]}`;
  }

  // Default fallback
  return `/icons/gym/dumbbell-01.png`;
}
