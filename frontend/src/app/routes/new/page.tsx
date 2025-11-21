'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import dynamic from 'next/dynamic';
import { routesAPI } from '@/lib/api';

// Dynamically import to avoid SSR issues
const RouteDrawer = dynamic(() => import('@/components/map/RouteDrawer'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(coords: [number, number][]): number {
  if (coords.length < 2) return 0;

  let totalDistance = 0;

  for (let i = 0; i < coords.length - 1; i++) {
    const [lon1, lat1] = coords[i];
    const [lon2, lat2] = coords[i + 1];

    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    totalDistance += R * c;
  }

  return Math.round(totalDistance); // Return in meters
}

export default function NewRoutePage() {
  const router = useRouter();
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    routeType: 'loop',
    difficulty: 'moderate',
    surfaceType: ['road'],
    isPublic: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const distance = calculateDistance(routeCoordinates);
  const distanceKm = (distance / 1000).toFixed(2);

  const handleRouteChange = (coords: [number, number][]) => {
    setRouteCoordinates(coords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (routeCoordinates.length < 2) {
      setError('Please draw a route with at least 2 points');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter a route name');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const routeData = {
        name: formData.name,
        description: formData.description || undefined,
        distance,
        routeGeometry: {
          type: 'LineString',
          coordinates: routeCoordinates,
        },
        routeType: formData.routeType,
        difficulty: formData.difficulty,
        surfaceType: formData.surfaceType,
        isPublic: formData.isPublic,
      };

      const response = await routesAPI.create(routeData);
      console.log('Route created:', response.data);

      // Redirect to routes list
      router.push('/routes');
    } catch (err: any) {
      console.error('Error creating route:', err);
      setError(err.response?.data?.message || 'Failed to create route');
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Route</h1>
          <p className="mt-2 text-gray-600">Draw your route on the map and add details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Map */}
          <div>
            <RouteDrawer
              onRouteChange={handleRouteChange}
              height="500px"
            />
          </div>

          {/* Route Info */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Route Details</h2>

            {/* Distance (auto-calculated) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (auto-calculated)
              </label>
              <p className="text-2xl font-bold text-gray-900">
                {distanceKm} km
                <span className="text-sm font-normal text-gray-500 ml-2">({distance} meters)</span>
              </p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Route Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                placeholder="e.g., Morning Loop Through the Park"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                placeholder="Describe the route, scenery, or any notable features..."
              />
            </div>

            {/* Row: Route Type & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route Type */}
              <div>
                <label htmlFor="routeType" className="block text-sm font-medium text-gray-700 mb-1">
                  Route Type
                </label>
                <select
                  id="routeType"
                  value={formData.routeType}
                  onChange={(e) => setFormData({ ...formData, routeType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                >
                  <option value="loop">Loop (returns to start)</option>
                  <option value="out_and_back">Out and Back</option>
                  <option value="point_to_point">Point to Point</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                  <option value="very_hard">Very Hard</option>
                </select>
              </div>
            </div>

            {/* Surface Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface Type
              </label>
              <div className="flex flex-wrap gap-3">
                {['road', 'trail', 'track', 'mixed'].map((surface) => (
                  <label key={surface} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.surfaceType.includes(surface)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, surfaceType: [...formData.surfaceType, surface] });
                        } else {
                          setFormData({ ...formData, surfaceType: formData.surfaceType.filter(s => s !== surface) });
                        }
                      }}
                      className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{surface}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Public Checkbox */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Make this route public (allow others to discover it)
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || routeCoordinates.length < 2}
                className="flex-1 bg-brand-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create Route'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
