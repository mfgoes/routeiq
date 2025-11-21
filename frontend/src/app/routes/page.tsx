'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RouteCard from '@/components/ui/RouteCard';
import Link from 'next/link';
import { routesAPI } from '@/lib/api';

interface Route {
  id: string;
  name: string;
  distance: number;
  elevationGain?: number;
  elevationLoss?: number;
  routeType: string;
  difficulty?: string;
  surfaceType?: string[];
  completionCount: number;
  isFavorite: boolean;
  routeGeometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    fetchRoutes();
  }, [filter]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter === 'favorites' ? { favorite: true } : {};
      const response = await routesAPI.list(params);
      setRoutes(response.data.routes || []);
    } catch (err: any) {
      console.error('Error fetching routes:', err);
      setError(err.response?.data?.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Routes</h1>
            <p className="mt-2 text-gray-600">Discover and manage your running routes</p>
          </div>
          <Link
            href="/routes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700"
          >
            + Create Route
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`${
                filter === 'all'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              All Routes
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`${
                filter === 'favorites'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              ❤️ Favorites
            </button>
          </nav>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchRoutes}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && routes.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl mb-4 block">🗺️</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {filter === 'favorites' ? 'No favorite routes yet' : 'No routes yet'}
              </h2>
              <p className="text-gray-600 mb-6">
                {filter === 'favorites'
                  ? 'Mark routes as favorites to see them here.'
                  : 'Create your first route to get started. Draw on the map and save it for your next run!'}
              </p>
              <Link
                href="/routes/new"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-red hover:bg-red-700"
              >
                + Create Your First Route
              </Link>
            </div>
          </div>
        )}

        {/* Routes Grid */}
        {!loading && !error && routes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
