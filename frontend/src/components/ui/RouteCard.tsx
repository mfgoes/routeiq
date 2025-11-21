'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const RouteMap = dynamic(() => import('@/components/map/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-gray-100 animate-pulse rounded-t-lg flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface RouteCardProps {
  route: {
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
  };
}

export default function RouteCard({ route }: RouteCardProps) {
  // Format distance in km
  const distanceKm = (route.distance / 1000).toFixed(1);

  // Format elevation
  const elevationText = route.elevationGain
    ? `↗ ${Math.round(route.elevationGain)}m`
    : null;

  // Route type badge color
  const getRouteTypeColor = (type: string) => {
    switch (type) {
      case 'loop':
        return 'bg-blue-100 text-blue-800';
      case 'out_and_back':
        return 'bg-green-100 text-green-800';
      case 'point_to_point':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Difficulty badge color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-orange-100 text-orange-800';
      case 'very_hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/routes/${route.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {/* Map Preview */}
        <div className="h-48">
          <RouteMap
            routeGeometry={route.routeGeometry}
            height="192px"
            showMarkers={true}
            interactive={false}
          />
        </div>

        {/* Route Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">{route.name}</h3>
            {route.isFavorite && (
              <span className="text-red-500 text-xl">❤️</span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="font-medium">{distanceKm} km</span>
            {elevationText && (
              <span>{elevationText}</span>
            )}
            {route.completionCount > 0 && (
              <span>✓ {route.completionCount}x</span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRouteTypeColor(route.routeType)}`}>
              {route.routeType.replace('_', ' ')}
            </span>
            {route.difficulty && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                {route.difficulty}
              </span>
            )}
            {route.surfaceType && route.surfaceType.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {route.surfaceType[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
