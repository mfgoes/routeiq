'use client';

import { useEffect, useState } from 'react';
import { activitiesAPI } from '@/lib/api';
import StatCard from '@/components/ui/StatCard';

interface Stats {
  totalRuns: number;
  totalDistance: number;
  totalDuration: number;
  averagePace: number;
  averageDistance: number;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await activitiesAPI.getStats({ period });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace % 1) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No activity data available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Period selector */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          {['week', 'month', 'year', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium ${
                period === p
                  ? 'bg-brand-red text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${p === 'week' ? 'rounded-l-lg' : ''} ${p === 'all' ? 'rounded-r-lg' : ''}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Runs"
          value={stats.totalRuns}
          icon={<span className="text-2xl">🏃</span>}
        />
        <StatCard
          title="Total Distance"
          value={formatDistance(stats.totalDistance)}
          subtitle={`Avg: ${formatDistance(stats.averageDistance)}`}
          icon={<span className="text-2xl">📏</span>}
        />
        <StatCard
          title="Total Time"
          value={formatDuration(stats.totalDuration)}
          icon={<span className="text-2xl">⏱️</span>}
        />
        <StatCard
          title="Average Pace"
          value={stats.averagePace > 0 ? formatPace(stats.averagePace) : 'N/A'}
          icon={<span className="text-2xl">⚡</span>}
        />
      </div>
    </div>
  );
}
