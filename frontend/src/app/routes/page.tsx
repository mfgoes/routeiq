'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

export default function RoutesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Routes</h1>
            <p className="mt-2 text-gray-600">Discover and manage your running routes</p>
          </div>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
          >
            + Create Route
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="max-w-md mx-auto">
            <span className="text-6xl mb-4 block">🗺️</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Routes Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Map integration and route creation features are in development.
              Soon you'll be able to:
            </p>
            <ul className="text-left space-y-2 mb-8 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Create routes with interactive map drawing</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Browse public routes from other runners</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Save favorite routes for quick access</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>View elevation profiles and terrain data</span>
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
