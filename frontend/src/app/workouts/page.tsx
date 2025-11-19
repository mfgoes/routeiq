'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

export default function WorkoutsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
            <p className="mt-2 text-gray-600">Track your strength training and cross-training</p>
          </div>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
          >
            + Log Workout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="max-w-md mx-auto">
            <span className="text-6xl mb-4 block">💪</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Workout Tracking - Phase 3</h2>
            <p className="text-gray-600 mb-6">
              Strength training and workout logging features are planned for Phase 3.
              This will include:
            </p>
            <ul className="text-left space-y-2 mb-8 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Log workouts with sets, reps, and weight</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Track progressive overload over time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>22+ pre-loaded runner-focused exercises</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Personal record tracking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-red">★</span>
                <span className="font-medium text-brand-red">
                  Cross-training insights: See how your strength gains impact your running pace!
                </span>
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
