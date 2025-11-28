'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkoutStats from '@/components/dashboard/WorkoutStats';
import RecentWorkouts from '@/components/dashboard/RecentWorkouts';
import RecentActivities from '@/components/dashboard/RecentActivities';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeWorkout, setActiveWorkout] = useState<{ exerciseCount: number } | null>(null);

  useEffect(() => {
    // Check for active workout in localStorage
    const stored = localStorage.getItem('routeiq_active_workout');
    if (stored) {
      try {
        const { selectedExercises } = JSON.parse(stored);
        if (selectedExercises && Array.isArray(selectedExercises) && selectedExercises.length > 0) {
          setActiveWorkout({ exerciseCount: selectedExercises.length });
        }
      } catch (e) {
        console.error('Error loading active workout', e);
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Track your fitness journey with workouts and runs.</p>
          </div>
          <a
            href="/static-landing/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-red hover:text-brand-red-dark transition-colors border border-brand-red rounded-lg hover:bg-brand-red/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More About RouteIQ
          </a>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/workouts/new?mode=execute"
            className={`relative flex items-center gap-4 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${
              activeWorkout
                ? 'bg-gradient-to-r from-green-600 to-green-700'
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
            }`}
          >
            {activeWorkout && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                IN PROGRESS
              </div>
            )}
            <div className="bg-white/20 p-4 rounded-lg">
              <span className="text-4xl">💪</span>
            </div>
            <div className="flex-1 text-white">
              {activeWorkout ? (
                <>
                  <h3 className="text-xl font-bold">Continue Workout</h3>
                  <p className="text-green-100 text-sm mt-1">
                    Resume your {activeWorkout.exerciseCount} exercise{activeWorkout.exerciseCount > 1 ? 's' : ''} workout
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold">Start Workout</h3>
                  <p className="text-blue-100 text-sm mt-1">Log your strength training</p>
                </>
              )}
            </div>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl shadow-lg opacity-60 cursor-not-allowed">
            <div className="bg-white/20 p-4 rounded-lg">
              <span className="text-4xl">🏃</span>
            </div>
            <div className="flex-1 text-white">
              <h3 className="text-xl font-bold">Log Run</h3>
              <p className="text-gray-100 text-sm mt-1">Coming soon - Route tracking</p>
            </div>
          </div>
        </div>

        {/* Workout Stats */}
        <WorkoutStats />

        {/* Recent Workouts */}
        <RecentWorkouts />

        {/* Recent Runs - Smaller card */}
        <RecentActivities />
      </div>
    </DashboardLayout>
  );
}
