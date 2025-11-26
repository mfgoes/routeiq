'use client';

import { useEffect, useState } from 'react';
import { activitiesAPI } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';

interface Activity {
  id: string;
  name: string;
  activityType: string;
  startedAt: string;
  distance: number;
  duration: number;
  averagePace?: number;
  route?: {
    id: string;
    name: string;
  };
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activitiesAPI.list({ limit: 5 });
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(1) + ' km';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatPace = (pace?: number) => {
    if (!pace) return 'N/A';
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace % 1) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
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

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Runs</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3 text-sm">No runs logged yet</p>
          <p className="text-xs text-gray-400">Route tracking coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Recent Runs</h2>
        <Link
          href="/activities"
          className="text-sm text-brand-red hover:text-red-700 font-medium"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {activity.name || 'Untitled Run'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(activity.startedAt), 'MMM dd, yyyy • h:mm a')}
                </p>
                {activity.route && (
                  <p className="text-xs text-gray-400 mt-1">
                    Route: {activity.route.name}
                  </p>
                )}
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatDistance(activity.distance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDuration(activity.duration)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPace(activity.averagePace)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
