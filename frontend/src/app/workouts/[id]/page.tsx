'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { workoutsAPI } from '@/lib/api';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function WorkoutDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetchWorkout();
  }, [workoutId]);

  const fetchWorkout = async () => {
    try {
      const response = await workoutsAPI.get(workoutId);
      setWorkout(response.data.workout);
    } catch (err: any) {
      console.error('Error fetching workout:', err);
      setError(err.response?.data?.message || 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await workoutsAPI.delete(workoutId);
      router.push('/workouts');
    } catch (err: any) {
      console.error('Error deleting workout:', err);
      setError(err.response?.data?.message || 'Failed to delete workout');
      setDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading workout...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !workout) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Workout not found'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {workout.name || 'Workout'}
            </h1>
            <p className="text-gray-600 mt-1">{formatDate(workout.startedAt)}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDeleteModal(true)}
              className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
            <p className="text-sm text-gray-600">Exercises</p>
            <p className="text-2xl font-bold text-gray-900">{workout.exercises.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900">
              {workout.totalVolume ? `${Math.round(Number(workout.totalVolume))} kg` : 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-2xl font-bold text-gray-900">{formatDuration(workout.totalDuration)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
            <p className="text-sm text-gray-600">Total Reps</p>
            <p className="text-2xl font-bold text-gray-900">{workout.totalReps || 0}</p>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Exercises</h2>
          {workout.exercises
            .sort((a: any, b: any) => a.exerciseOrder - b.exerciseOrder)
            .map((ex: any, index: number) => (
              <div key={ex.id} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden">
                {/* Exercise Header */}
                <div className="bg-gray-50 px-4 py-3 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-900">
                    {index + 1}. {ex.exercise.name}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {ex.exercise.category.replace('_', ' ')}
                  </p>
                </div>

                {/* Sets Table */}
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                        <th className="pb-2">Set</th>
                        <th className="pb-2">Reps</th>
                        <th className="pb-2">Weight</th>
                        <th className="pb-2">RPE</th>
                        <th className="pb-2">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ex.sets.map((set: any, setIndex: number) => (
                        <tr key={setIndex} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 font-medium">{set.set}</td>
                          <td className="py-2">{set.reps}</td>
                          <td className="py-2">{set.weight ? `${set.weight} kg` : '-'}</td>
                          <td className="py-2">{set.rpe || '-'}</td>
                          <td className="py-2">{set.restSeconds ? `${set.restSeconds}s` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {ex.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-gray-700">{ex.notes}</p>
                    </div>
                  )}

                  {/* Exercise Stats */}
                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Total Sets:</span>
                      <span className="font-medium ml-1">{ex.totalSets}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Reps:</span>
                      <span className="font-medium ml-1">{ex.totalReps}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Volume:</span>
                      <span className="font-medium ml-1">
                        {ex.totalVolume ? `${Math.round(Number(ex.totalVolume))} kg` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Workout Notes</h3>
            <p className="text-gray-700">{workout.notes}</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        title="Delete Workout?"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </DashboardLayout>
  );
}
