'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { workoutsAPI } from '@/lib/api';
import type { Exercise, WorkoutSet, WorkoutExerciseInput } from '@/types/workout';
import SetRow from '@/components/workout/SetRow';
import ExerciseProgress from '@/components/workout/ExerciseProgress';
import WorkoutSummary from '@/components/workout/WorkoutSummary';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ExerciseSubstitutionModal from '@/components/workout/ExerciseSubstitutionModal';
import ExerciseSelectionModal from '@/components/workout/ExerciseSelectionModal';
import { getWorkoutSettings } from '@/lib/workoutSettings';

interface SelectedExercise {
  exercise: Exercise;
  order: number;
  sets: WorkoutSet[];
  notes: string;
  suggestedWeight?: number;
  isSkipped?: boolean;
  isSubstitution?: boolean;
  progressiveOverload?: boolean;
  progressiveOverloadIncrement?: number;
}

const STORAGE_KEY = 'routeiq_active_workout';

export default function NewWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const workoutId = searchParams.get('workout'); // For repeating a workout
  const mode = searchParams.get('mode') || 'create'; // 'create' or 'execute'
  const isExecuteMode = mode === 'execute';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showSummary, setShowSummary] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [currentTemplateName, setCurrentTemplateName] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'default' | 'danger';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [substitutionModal, setSubstitutionModal] = useState<{
    isOpen: boolean;
    exerciseIndex: number | null;
  }>({ isOpen: false, exerciseIndex: null });
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);

  useEffect(() => {
    fetchExercises();
    fetchTemplates();

    if (templateId) {
      loadTemplate(templateId);
    } else if (workoutId) {
      loadWorkout(workoutId);
    } else {
      loadWorkoutFromStorage();
    }

    // Warning before leaving page
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (selectedExercises.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (selectedExercises.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedExercises,
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedExercises]);

  const loadWorkoutFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { selectedExercises: savedEx } = JSON.parse(stored);
        if (savedEx && Array.isArray(savedEx) && savedEx.length > 0) {
          setConfirmModal({
            isOpen: true,
            title: 'Continue Workout?',
            message: 'You have an unfinished workout. Continue where you left off?',
            onConfirm: () => {
              setSelectedExercises(savedEx);
              setConfirmModal({ ...confirmModal, isOpen: false });
            },
          });
        }
      } catch (e) {
        console.error('Error loading workout from storage', e);
      }
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await workoutsAPI.listTemplates();
      setTemplates(response.data.templates || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadTemplate = async (templateId: string) => {
    try {
      const response = await workoutsAPI.getTemplate(templateId);
      const template = response.data.template;

      const templateExercises: SelectedExercise[] = template.exercises.map((ex: any, index: number) => ({
        exercise: ex.exercise,
        order: index + 1,
        sets: ex.sets,
        notes: ex.notes || '',
      }));

      setSelectedExercises(templateExercises);
      setCurrentTemplateName(template.name);
    } catch (err) {
      console.error('Error loading template:', err);
      setError('Failed to load template');
    }
  };

  const loadWorkout = async (workoutId: string) => {
    try {
      const response = await workoutsAPI.get(workoutId);
      const workout = response.data.workout;

      const workoutExercises: SelectedExercise[] = workout.exercises.map((ex: any, index: number) => ({
        exercise: ex.exercise,
        order: index + 1,
        sets: ex.sets.map((set: any) => ({
          ...set,
          completed: false, // Reset completion status for repeat
        })),
        notes: ex.notes || '',
      }));

      setSelectedExercises(workoutExercises);
      setCurrentTemplateName(workout.name);
    } catch (err) {
      console.error('Error loading workout:', err);
      setError('Failed to load workout');
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await workoutsAPI.getExercises();
      setExercises(response.data.exercises || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoadingExercises(false);
    }
  };

  const addExercise = async (exercise: Exercise) => {
    const settings = getWorkoutSettings();
    let suggestedWeight: number | undefined;

    // Fetch last weight if auto-suggest is enabled
    if (settings.autoSuggestWeights) {
      try {
        const response = await workoutsAPI.getLastExerciseWeight(exercise.id);
        if (response.data.lastWeight) {
          suggestedWeight = response.data.lastWeight + settings.progressiveOverloadIncrement;
        }
      } catch (err) {
        console.log('Could not fetch last weight for exercise', err);
      }
    }

    const newExercise: SelectedExercise = {
      exercise,
      order: selectedExercises.length + 1,
      sets: [],
      notes: '',
      suggestedWeight,
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    const reordered = updated.map((ex, i) => ({ ...ex, order: i + 1 }));
    setSelectedExercises(reordered);
  };

  const applySetPreset = (exerciseIndex: number, preset: '3x10' | '4x8' | '5x5') => {
    const updated = [...selectedExercises];
    const exercise = updated[exerciseIndex];
    const settings = getWorkoutSettings();

    const presets = {
      '3x10': { count: 3, reps: 10, rest: 90 },
      '4x8': { count: 4, reps: 8, rest: 90 },
      '5x5': { count: 5, reps: 5, rest: 120 },
    };

    const config = presets[preset];
    const defaultWeight = exercise.suggestedWeight || 0;

    const newSets: WorkoutSet[] = Array.from({ length: config.count }, (_, i) => ({
      set: i + 1,
      reps: config.reps,
      weight: defaultWeight,
      restSeconds: config.rest,
      rpe: 7,
    }));

    updated[exerciseIndex].sets = newSets;
    setSelectedExercises(updated);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    const exercise = updated[exerciseIndex];
    const settings = getWorkoutSettings();

    const lastSet = exercise.sets.length > 0
      ? exercise.sets[exercise.sets.length - 1]
      : {
          reps: 10,
          weight: exercise.suggestedWeight || 0,
          restSeconds: settings.defaultRestTime,
          rpe: 7
        };

    // Apply progressive overload if enabled
    const increment = exercise.progressiveOverloadIncrement || 2.5;
    const baseWeight = lastSet.weight || 0;
    const newWeight = exercise.progressiveOverload
      ? baseWeight + increment
      : baseWeight;

    const newSet: WorkoutSet = {
      set: exercise.sets.length + 1,
      reps: lastSet.reps,
      weight: newWeight,
      restSeconds: lastSet.restSeconds,
      rpe: lastSet.rpe,
    };
    exercise.sets.push(newSet);
    setSelectedExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.map((s, i) => ({ ...s, set: i + 1 }));
    setSelectedExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setSelectedExercises(updated);
  };

  const skipExercise = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].isSkipped = !updated[exerciseIndex].isSkipped;
    setSelectedExercises(updated);
  };

  const markAsSubstitution = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].isSubstitution = !updated[exerciseIndex].isSubstitution;
    setSelectedExercises(updated);
  };

  const toggleProgressiveOverload = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].progressiveOverload = !updated[exerciseIndex].progressiveOverload;
    // Set default increment if not already set
    if (!updated[exerciseIndex].progressiveOverloadIncrement) {
      updated[exerciseIndex].progressiveOverloadIncrement = 2.5;
    }
    setSelectedExercises(updated);
  };

  const swapExercise = (exerciseIndex: number, newExercise: Exercise) => {
    const updated = [...selectedExercises];
    const oldExercise = updated[exerciseIndex];
    updated[exerciseIndex] = {
      ...oldExercise,
      exercise: newExercise,
      isSubstitution: true, // Mark as substitution when swapping
    };
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedExercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    const hasAnySets = selectedExercises.some(ex => ex.sets.length > 0);
    if (!hasAnySets) {
      setError('Please add sets to at least one exercise (use preset buttons like 3×10)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isExecuteMode) {
        // Execute mode: Save as completed workout (only completed sets)
        const hasCompletedSets = selectedExercises.some(ex =>
          ex.sets.some(set => set.completed === true)
        );

        if (!hasCompletedSets) {
          setError('Please check off at least one completed set before finishing');
          setLoading(false);
          return;
        }

        // Only include exercises with completed sets
        const workoutExercises: WorkoutExerciseInput[] = selectedExercises
          .map(ex => ({
            exerciseId: ex.exercise.id,
            exerciseOrder: ex.order,
            sets: ex.sets.filter(set => set.completed === true),
            notes: ex.notes || undefined,
          }))
          .filter(ex => ex.sets.length > 0);

        const workoutName = selectedExercises.length === 1
          ? selectedExercises[0].exercise.name
          : `${selectedExercises[0].exercise.name} + ${selectedExercises.length - 1} more`;

        const now = new Date();
        const payload = {
          name: workoutName,
          workoutType: 'strength',
          startedAt: now.toISOString(),
          completedAt: now.toISOString(),
          exercises: workoutExercises,
        };

        await workoutsAPI.create(payload);
        localStorage.removeItem(STORAGE_KEY);
        setShowSummary(true);
      } else {
        // Create mode: Save as template (all sets, no completion required)
        const templateExercises: WorkoutExerciseInput[] = selectedExercises
          .filter(ex => ex.sets.length > 0)
          .map(ex => ({
            exerciseId: ex.exercise.id,
            exerciseOrder: ex.order,
            sets: ex.sets,
            notes: ex.notes || undefined,
          }));

        const templateName = selectedExercises.length === 1
          ? selectedExercises[0].exercise.name
          : `${selectedExercises[0].exercise.name} + ${selectedExercises.length - 1} more`;

        const payload = {
          name: templateName,
          workoutType: 'strength',
          exercises: templateExercises,
        };

        await workoutsAPI.createTemplate(payload);
        localStorage.removeItem(STORAGE_KEY);
        router.push('/workouts/templates');
      }
    } catch (err: any) {
      console.error('Error saving:', err);
      setError(err.response?.data?.message || `Failed to save ${isExecuteMode ? 'workout' : 'template'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ex.category === categoryFilter;
    const notSelected = !selectedExercises.some(sel => sel.exercise.id === ex.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  const categories = Array.from(new Set(exercises.map(ex => ex.category)));

  // Calculate stats
  const totalSets = selectedExercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = selectedExercises.reduce((sum, ex) =>
    sum + ex.sets.filter(s => s.completed === true).length, 0
  );
  const completedExercises = selectedExercises.filter(ex =>
    ex.sets.length > 0 && ex.sets.every(s => s.completed === true)
  ).length;
  const totalVolume = selectedExercises.reduce((sum, ex) =>
    sum + ex.sets.reduce((s, set) => s + ((set.weight || 0) * (set.reps || 0)), 0), 0
  );
  const totalReps = selectedExercises.reduce((sum, ex) =>
    sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0), 0
  );

  if (showSummary) {
    const completedExercises = selectedExercises.filter(ex => !ex.isSkipped && ex.sets.length > 0).length;
    const plannedExercises = selectedExercises.length;
    const skippedExercises = selectedExercises.filter(ex => ex.isSkipped).length;

    return (
      <WorkoutSummary
        totalExercises={completedExercises}
        totalSets={totalSets}
        totalVolume={totalVolume}
        totalReps={totalReps}
        durationMinutes={0}
        plannedExercises={plannedExercises}
        skippedExercises={skippedExercises}
        onClose={() => router.push('/workouts')}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 pb-24">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {isExecuteMode
                  ? (currentTemplateName ? `Do Workout: ${currentTemplateName}` : "Do Workout")
                  : "Create Workout Template"
                }
              </h1>
              <p className="text-gray-600 mt-1">
                {isExecuteMode
                  ? "Check off sets as you complete them"
                  : "Build a reusable workout plan"
                }
              </p>
            </div>

            {/* Quick Add Exercise Button - Show when exercises exist */}
            {selectedExercises.length > 0 && (
              <button
                type="button"
                onClick={() => setQuickAddModalOpen(true)}
                className="min-w-[48px] h-[48px] px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:bg-blue-800 transition-all active:scale-95 touch-manipulation flex items-center gap-2 shadow-lg"
                aria-label="Add exercise"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Exercise</span>
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 font-medium">
              {error}
            </div>
          )}

          {/* Template Quick Select - Only show in create mode */}
          {!isExecuteMode && !currentTemplateName && selectedExercises.length === 0 && (
            <div className="mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Quick Start from Template</h2>
                <Link
                  href="/workouts/templates"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Templates →
                </Link>
              </div>

              {loadingTemplates ? (
                <div className="text-center py-8 text-gray-500">Loading templates...</div>
              ) : templates.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {templates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => loadTemplate(template.id)}
                      className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{template.name || 'Untitled'}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white border-2 border-gray-200 rounded-lg">
                  <p className="text-gray-600 mb-3">No templates yet</p>
                  <Link
                    href="/workouts/templates"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Create your first template →
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuickAddModalOpen(true)}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:bg-blue-800 transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start From Scratch
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected Exercises */}
            {selectedExercises.length > 0 && (
              <div className="space-y-4">
                {selectedExercises.map((selectedEx, exIndex) => {
                  const completedSetsForExercise = selectedEx.sets.filter(s => s.completed === true).length;
                  const isExerciseComplete = selectedEx.sets.length > 0 &&
                    completedSetsForExercise === selectedEx.sets.length;

                  return (
                    <div key={exIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      {/* Exercise header */}
                      <ExerciseProgress
                        exerciseName={`${exIndex + 1}. ${selectedEx.exercise.name}`}
                        category={selectedEx.exercise.category}
                        completedSets={completedSetsForExercise}
                        totalSets={selectedEx.sets.length}
                        isComplete={isExerciseComplete}
                        isSkipped={selectedEx.isSkipped}
                        isSubstitution={selectedEx.isSubstitution}
                        progressiveOverload={selectedEx.progressiveOverload}
                        onRemove={() => removeExercise(exIndex)}
                        onSkip={() => skipExercise(exIndex)}
                        onSwap={() => setSubstitutionModal({ isOpen: true, exerciseIndex: exIndex })}
                        onMarkSubstitution={() => markAsSubstitution(exIndex)}
                        onToggleProgressiveOverload={() => toggleProgressiveOverload(exIndex)}
                      />

                      {selectedEx.isSkipped ? (
                        <div className="p-6 text-center">
                          <p className="text-gray-500 italic">
                            Exercise skipped. Click the menu to un-skip or swap this exercise.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4">
                          {/* Suggested Weight Indicator */}
                          {selectedEx.suggestedWeight && selectedEx.sets.length === 0 && (
                            <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                              <p className="text-sm font-medium text-blue-900">
                                💡 Suggested weight: <span className="font-bold">{selectedEx.suggestedWeight} kg</span>
                                <span className="text-blue-700 text-xs ml-2">(progressive overload applied)</span>
                              </p>
                            </div>
                          )}

                          {/* Quick Set Presets */}
                          {selectedEx.sets.length === 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Quick start:</p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => applySetPreset(exIndex, '3x10')}
                                className="py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                              >
                                3×10
                              </button>
                              <button
                                type="button"
                                onClick={() => applySetPreset(exIndex, '4x8')}
                                className="py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                              >
                                4×8
                              </button>
                              <button
                                type="button"
                                onClick={() => applySetPreset(exIndex, '5x5')}
                                className="py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                              >
                                5×5
                              </button>
                              <button
                                type="button"
                                onClick={() => addSet(exIndex)}
                                className="py-3 bg-gray-200 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-300 active:bg-gray-400 transition-colors"
                              >
                                Custom
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Sets */}
                        {selectedEx.sets.length > 0 && (
                          <div className="space-y-3">
                            {selectedEx.sets.map((set, setIndex) => (
                              <SetRow
                                key={setIndex}
                                set={set}
                                setNumber={set.set}
                                onUpdate={(field, value) => updateSet(exIndex, setIndex, field, value)}
                                onRemove={() => removeSet(exIndex, setIndex)}
                                canRemove={selectedEx.sets.length > 1}
                                autoFocusWeight={setIndex === 0}
                                showCompletion={isExecuteMode}
                                onNext={() => {
                                  // Auto-advance to next set's weight
                                  if (setIndex < selectedEx.sets.length - 1) {
                                    // Focus next set
                                  }
                                }}
                              />
                            ))}

                            {/* Add Set button */}
                            <button
                              type="button"
                              onClick={() => addSet(exIndex)}
                              className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 active:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Add Set
                            </button>
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Submit button - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg">
              <div className="max-w-2xl mx-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedExercises.length > 0) {
                      setConfirmModal({
                        isOpen: true,
                        title: 'Cancel Workout?',
                        message: 'Are you sure? Your workout progress will be lost.',
                        variant: 'danger',
                        onConfirm: () => {
                          localStorage.removeItem(STORAGE_KEY);
                          router.push('/workouts');
                        },
                      });
                    } else {
                      router.push('/workouts');
                    }
                  }}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || selectedExercises.length === 0 || totalSets === 0}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  {loading
                    ? 'Saving...'
                    : isExecuteMode
                      ? `Finish Workout (${completedSets}/${totalSets} sets)`
                      : 'Save as Template'
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => {
          if (confirmModal.title === 'Continue Workout?') {
            localStorage.removeItem(STORAGE_KEY);
          }
          setConfirmModal({ ...confirmModal, isOpen: false });
        }}
      />

      <ExerciseSubstitutionModal
        isOpen={substitutionModal.isOpen}
        onClose={() => setSubstitutionModal({ isOpen: false, exerciseIndex: null })}
        currentExercise={
          substitutionModal.exerciseIndex !== null
            ? selectedExercises[substitutionModal.exerciseIndex].exercise
            : exercises[0] // Fallback
        }
        allExercises={exercises}
        onSelect={(exercise) => {
          if (substitutionModal.exerciseIndex !== null) {
            swapExercise(substitutionModal.exerciseIndex, exercise);
          }
        }}
      />

      <ExerciseSelectionModal
        isOpen={quickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
        allExercises={exercises}
        selectedExerciseIds={selectedExercises.map(ex => ex.exercise.id)}
        onSelect={(exercise) => {
          addExercise(exercise);
          setQuickAddModalOpen(false);
        }}
        loading={loadingExercises}
      />
    </DashboardLayout>
  );
}
