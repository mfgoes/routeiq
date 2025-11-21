'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { routesAPI } from '@/lib/api';

// Dynamically import to avoid SSR issues
const RouteMap = dynamic(() => import('@/components/map/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface RouteData {
  id: string;
  name: string;
  description?: string;
  distance: number;
  elevationGain?: number;
  elevationLoss?: number;
  routeType: string;
  difficulty?: string;
  surfaceType?: string[];
  completionCount: number;
  isFavorite: boolean;
  isPublic: boolean;
  routeGeometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  createdAt: string;
}

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRoute();
  }, [params.id]);

  const fetchRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await routesAPI.get(params.id);
      setRoute(response.data.route);
    } catch (err: any) {
      console.error('Error fetching route:', err);
      setError(err.response?.data?.message || 'Failed to load route');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!route) return;
    try {
      await routesAPI.update(params.id, { isFavorite: !route.isFavorite });
      setRoute({ ...route, isFavorite: !route.isFavorite });
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await routesAPI.delete(params.id);
      router.push('/routes');
    } catch (err: any) {
      console.error('Error deleting route:', err);
      alert(err.response?.data?.message || 'Failed to delete route');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-[500px] bg-gray-200 rounded animate-pulse" />
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !route) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <p className="text-red-800 mb-4">{error || 'Route not found'}</p>
          <Link
            href="/routes"
            className="text-red-600 hover:text-red-800 underline"
          >
            ← Back to Routes
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const distanceKm = (route.distance / 1000).toFixed(1);

  const getRouteTypeLabel = (type: string) => {
    switch (type) {
      case 'loop':
        return 'Loop';
      case 'out_and_back':
        return 'Out and Back';
      case 'point_to_point':
        return 'Point to Point';
      default:
        return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{route.name}</h1>
              <button
                onClick={handleToggleFavorite}
                className="text-2xl hover:scale-110 transition-transform"
                title={route.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {route.isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
            {route.description && (
              <p className="text-gray-600">{route.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/activities/new?routeId=${route.id}`}
              className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700"
            >
              Use This Route
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Map */}
        <div>
          <RouteMap
            routeGeometry={route.routeGeometry}
            height="500px"
            showMarkers={true}
            interactive={true}
          />
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Route Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Distance */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Distance</p>
              <p className="text-2xl font-bold text-gray-900">{distanceKm} km</p>
            </div>

            {/* Elevation Gain */}
            {route.elevationGain !== null && route.elevationGain !== undefined && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Elevation Gain</p>
                <p className="text-2xl font-bold text-gray-900">↗ {Math.round(route.elevationGain)} m</p>
              </div>
            )}

            {/* Completion Count */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{route.completionCount}×</p>
            </div>

            {/* Difficulty */}
            {route.difficulty && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Difficulty</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{route.difficulty.replace('_', ' ')}</p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Route Type</p>
              <p className="text-gray-900 font-medium">{getRouteTypeLabel(route.routeType)}</p>
            </div>

            {route.surfaceType && route.surfaceType.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">Surface Type</p>
                <p className="text-gray-900 font-medium capitalize">{route.surfaceType.join(', ')}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Visibility</p>
              <p className="text-gray-900 font-medium">{route.isPublic ? '🌍 Public' : '🔒 Private'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-gray-900 font-medium">
                {new Date(route.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div>
          <Link
            href="/routes"
            className="text-brand-red hover:text-red-700 font-medium"
          >
            ← Back to Routes
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
