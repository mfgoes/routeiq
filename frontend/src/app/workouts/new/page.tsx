'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { workoutsAPI } from '@/lib/api';
import type { Exercise, WorkoutSet, WorkoutExerciseInput } from '@/types/workout';

interface SelectedExercise {
  exercise: Exercise;
  order: number;
  sets: WorkoutSet[];
  notes: string;
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    workoutType: 'strength',
    startedAt: new Date().toISOString().slice(0, 16),
    completedAt: '',
    perceivedEffort: '',
    energyLevel: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchExercises();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: SelectedExercise = {
      exercise,
      order: selectedExercises.length + 1,
      sets: [{ set: 1, reps: 10, weight: 0, restSeconds: 90, rpe: 7 }],
      notes: '',
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    // Re-order exercises
    const reordered = updated.map((ex, i) => ({ ...ex, order: i + 1 }));
    setSelectedExercises(reordered);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    const exercise = updated[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      set: exercise.sets.length + 1,
      reps: lastSet.reps,
      weight: lastSet.weight,
      restSeconds: lastSet.restSeconds,
      rpe: lastSet.rpe,
    };
    exercise.sets.push(newSet);
    setSelectedExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    // Re-number sets
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.map((s, i) => ({ ...s, set: i + 1 }));
    setSelectedExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      [field]: value === '' ? undefined : parseFloat(value),
    };
    setSelectedExercises(updated);
  };

  const updateExerciseNotes = (exerciseIndex: number, notes: string) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].notes = notes;
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedExercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const workoutExercises: WorkoutExerciseInput[] = selectedExercises.map(ex => ({
        exerciseId: ex.exercise.id,
        exerciseOrder: ex.order,
        sets: ex.sets,
        notes: ex.notes || undefined,
      }));

      const payload = {
        name: formData.name || undefined,
        workoutType: formData.workoutType || undefined,
        startedAt: new Date(formData.startedAt).toISOString(),
        completedAt: formData.completedAt ? new Date(formData.completedAt).toISOString() : undefined,
        perceivedEffort: formData.perceivedEffort ? parseInt(formData.perceivedEffort) : undefined,
        energyLevel: formData.energyLevel ? parseInt(formData.energyLevel) : undefined,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        exercises: workoutExercises,
      };

      await workoutsAPI.create(payload);
      router.push('/workouts');
    } catch (err: any) {
      console.error('Error creating workout:', err);
      setError(err.response?.data?.message || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ex.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(exercises.map(ex => ex.category)));

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Log Workout</h1>
          <p className="text-gray-600 mt-2">Track your strength training session</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workout Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Workout Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Name (optional)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Leg Day, Upper Body"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Type
                </label>
                <select
                  name="workoutType"
                  value={formData.workoutType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="strength">Strength</option>
                  <option value="hypertrophy">Hypertrophy</option>
                  <option value="endurance">Endurance</option>
                  <option value="power">Power</option>
                  <option value="circuit">Circuit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Started At *
                </label>
                <input
                  type="datetime-local"
                  name="startedAt"
                  value={formData.startedAt}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completed At (optional)
                </label>
                <input
                  type="datetime-local"
                  name="completedAt"
                  value={formData.completedAt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perceived Effort (1-10)
                </label>
                <input
                  type="number"
                  name="perceivedEffort"
                  value={formData.perceivedEffort}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  placeholder="7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Energy Level (1-10)
                </label>
                <input
                  type="number"
                  name="energyLevel"
                  value={formData.energyLevel}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  placeholder="7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Home Gym, 24H Fitness"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="How did the workout feel? Any observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Selected Exercises */}
          {selectedExercises.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Workout</h2>
              <div className="space-y-6">
                {selectedExercises.map((selectedEx, exIndex) => (
                  <div key={exIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {exIndex + 1}. {selectedEx.exercise.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {selectedEx.exercise.category.replace('_', ' ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExercise(exIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Sets Table */}
                    <div className="overflow-x-auto mb-3">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Set</th>
                            <th className="text-left py-2 px-2">Reps</th>
                            <th className="text-left py-2 px-2">Weight (kg)</th>
                            <th className="text-left py-2 px-2">Rest (sec)</th>
                            <th className="text-left py-2 px-2">RPE</th>
                            <th className="py-2 px-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEx.sets.map((set, setIndex) => (
                            <tr key={setIndex} className="border-b">
                              <td className="py-2 px-2">{set.set}</td>
                              <td className="py-2 px-2">
                                <input
                                  type="number"
                                  value={set.reps || ''}
                                  onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                                  className="w-16 px-2 py-1 border rounded"
                                  min="1"
                                  required
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  type="number"
                                  value={set.weight || ''}
                                  onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                                  className="w-16 px-2 py-1 border rounded"
                                  min="0"
                                  step="0.5"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  type="number"
                                  value={set.restSeconds || ''}
                                  onChange={(e) => updateSet(exIndex, setIndex, 'restSeconds', e.target.value)}
                                  className="w-16 px-2 py-1 border rounded"
                                  min="0"
                                  step="5"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  type="number"
                                  value={set.rpe || ''}
                                  onChange={(e) => updateSet(exIndex, setIndex, 'rpe', e.target.value)}
                                  className="w-16 px-2 py-1 border rounded"
                                  min="1"
                                  max="10"
                                />
                              </td>
                              <td className="py-2 px-2">
                                {selectedEx.sets.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSet(exIndex, setIndex)}
                                    className="text-red-600 hover:text-red-800 text-xs"
                                  >
                                    ×
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => addSet(exIndex)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                      >
                        + Add Set
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exercise Notes
                      </label>
                      <input
                        type="text"
                        value={selectedEx.notes}
                        onChange={(e) => updateExerciseNotes(exIndex, e.target.value)}
                        placeholder="Any notes for this exercise..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Library */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add Exercises</h2>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search exercises..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {loadingExercises ? (
              <p className="text-gray-500">Loading exercises...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredExercises.map(exercise => (
                  <div
                    key={exercise.id}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {exercise.category.replace('_', ' ')} • {exercise.muscleGroups.slice(0, 2).join(', ')}
                        </p>
                        {exercise.description && (
                          <p className="text-xs text-gray-600 mt-1">{exercise.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => addExercise(exercise)}
                        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        disabled={selectedExercises.some(ex => ex.exercise.id === exercise.id)}
                      >
                        {selectedExercises.some(ex => ex.exercise.id === exercise.id) ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/workouts')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedExercises.length === 0}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging Workout...' : 'Log Workout'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
