'use client';

import { useEffect, useState } from 'react';
import { workoutsAPI } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';

interface Workout {
  id: string;
  name: string;
  workoutType: string;
  completedAt: string;
  exercises: Array<{
    exercise: {
      name: string;
    };
  }>;
  totalVolume?: number;
  totalReps?: number;
}

export default function RecentWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutsAPI.list({ limit: 5, completedOnly: true });
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    return `${volume.toFixed(0)} kg`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No workouts yet</p>
          <Link
            href="/workouts/new?mode=execute"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Your First Workout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
        <Link
          href="/workouts"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {workouts.map((workout) => (
          <Link
            key={workout.id}
            href={`/workouts/${workout.id}`}
            className="block p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {workout.name || 'Untitled Workout'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(workout.completedAt), 'MMM dd, yyyy • h:mm a')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                  {workout.exercises.length > 0 && ` • ${workout.exercises[0].exercise.name}`}
                  {workout.exercises.length > 1 && ` + ${workout.exercises.length - 1} more`}
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatVolume(workout.totalVolume)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total volume
                </p>
                {workout.totalReps && (
                  <p className="text-xs text-gray-500 mt-1">
                    {workout.totalReps} reps
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
