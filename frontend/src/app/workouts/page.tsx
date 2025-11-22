'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { workoutsAPI } from '@/lib/api';
import type { Workout } from '@/types/workout';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface WorkoutTemplate {
  id: string;
  name: string;
  workoutType: string;
  exercises: any[];
  totalVolume?: number;
  totalReps?: number;
  notes?: string;
  createdAt: string;
}

export default function WorkoutsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    workoutId: string | null;
  }>({ isOpen: false, workoutId: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workoutsRes, templatesRes] = await Promise.all([
        workoutsAPI.list({ limit: 50 }),
        workoutsAPI.listTemplates()
      ]);
      setWorkouts(workoutsRes.data.workouts || []);
      setTemplates(templatesRes.data.templates || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.workoutId) return;

    try {
      await workoutsAPI.delete(deleteModal.workoutId);
      setWorkouts(workouts.filter(w => w.id !== deleteModal.workoutId));
      setDeleteModal({ isOpen: false, workoutId: null });
    } catch (err: any) {
      console.error('Error deleting workout:', err);
      setError(err.response?.data?.message || 'Failed to delete workout');
      setDeleteModal({ isOpen: false, workoutId: null });
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStartWorkout = (templateId: string) => {
    router.push(`/workouts/new?template=${templateId}&mode=execute`);
  };

  const handleRepeatWorkout = (workoutId: string) => {
    router.push(`/workouts/new?workout=${workoutId}&mode=execute`);
  };

  const getWorkoutTypeBadgeColor = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';

    const colors: Record<string, string> = {
      strength: 'bg-blue-100 text-blue-800',
      cardio: 'bg-red-100 text-red-800',
      flexibility: 'bg-green-100 text-green-800',
      sports: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };

    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const groupWorkoutsByDate = (workouts: Workout[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    const groups: Record<string, Workout[]> = {
      Today: [],
      'This Week': [],
      'Last Week': [],
      Earlier: [],
    };

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.startedAt);
      const workoutDay = new Date(workoutDate.getFullYear(), workoutDate.getMonth(), workoutDate.getDate());

      if (workoutDay.getTime() === today.getTime()) {
        groups.Today.push(workout);
      } else if (workoutDay >= thisWeekStart) {
        groups['This Week'].push(workout);
      } else if (workoutDay >= lastWeekStart) {
        groups['Last Week'].push(workout);
      } else {
        groups.Earlier.push(workout);
      }
    });

    return groups;
  };

  const getThisWeekStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const thisWeekWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.startedAt);
      return workoutDate >= thisWeekStart;
    });

    const totalVolume = thisWeekWorkouts.reduce((sum, w) => sum + (Number(w.totalVolume) || 0), 0);

    return {
      count: thisWeekWorkouts.length,
      totalVolume: Math.round(totalVolume),
    };
  };

  const recentTemplates = templates.slice(0, 3);
  const groupedWorkouts = groupWorkoutsByDate(workouts);
  const thisWeekStats = getThisWeekStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
            <p className="mt-2 text-gray-600">Track your strength training and cross-training</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/workouts/templates"
              className="inline-flex items-center px-4 py-2 border-2 border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/workouts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              + Create Template
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Loading workouts...</p>
          </div>
        ) : workouts.length === 0 && templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl mb-4 block">💪</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Workouts Yet</h2>
              <p className="text-gray-600 mb-6">
                Start tracking your strength training sessions to see how they impact your running performance!
              </p>
              <Link
                href="/workouts/new"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Your First Workout
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            {(recentTemplates.length > 0 || workouts.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Recent Templates */}
                {recentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                        {template.name || 'Untitled Template'}
                      </h3>
                      {template.workoutType && (
                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getWorkoutTypeBadgeColor(template.workoutType)}`}>
                          {template.workoutType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                    </p>
                    <button
                      onClick={() => handleStartWorkout(template.id)}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Start Workout
                    </button>
                  </div>
                ))}

                {/* This Week Stats */}
                {workouts.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border-2 border-blue-200 p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">This Week</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Workouts</p>
                        <p className="text-2xl font-bold text-blue-900">{thisWeekStats.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Volume</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {thisWeekStats.totalVolume > 0 ? `${thisWeekStats.totalVolume} kg` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Workout History */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b-2 border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Workout History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Workout
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exercises
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effort
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(groupedWorkouts).map(([groupName, groupWorkouts]) =>
                      groupWorkouts.length > 0 ? (
                        <React.Fragment key={groupName}>
                          <tr className="bg-gray-50">
                            <td colSpan={7} className="px-6 py-2">
                              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                {groupName}
                              </h3>
                            </td>
                          </tr>
                          {groupWorkouts.map((workout) => (
                            <tr key={workout.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {workout.name || 'Workout'}
                                  </div>
                                  {workout.workoutType && (
                                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getWorkoutTypeBadgeColor(workout.workoutType)}`}>
                                      {workout.workoutType}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(workout.startedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {workout.totalVolume ? `${Math.round(Number(workout.totalVolume))} kg` : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDuration(workout.totalDuration)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {workout.perceivedEffort ? (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    {workout.perceivedEffort}/10
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/workouts/${workout.id}`}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  View
                                </Link>
                                <button
                                  onClick={() => handleRepeatWorkout(workout.id)}
                                  className="text-green-600 hover:text-green-900 mr-4"
                                >
                                  Repeat
                                </button>
                                <button
                                  onClick={() => setDeleteModal({ isOpen: true, workoutId: workout.id })}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ) : null
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Workout?"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, workoutId: null })}
      />
    </DashboardLayout>
  );
}
