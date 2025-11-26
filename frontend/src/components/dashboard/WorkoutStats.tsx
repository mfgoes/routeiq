'use client';

import { useEffect, useState } from 'react';
import { workoutsAPI } from '@/lib/api';
import StatCard from '@/components/ui/StatCard';

interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  totalExercises: number;
  averageWorkoutDuration: number;
}

export default function WorkoutStats() {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await workoutsAPI.getStats({ period });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch workout stats:', error);
      // Set default empty stats on error
      setStats({
        totalWorkouts: 0,
        totalVolume: 0,
        totalExercises: 0,
        averageWorkoutDuration: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatVolume = (kg: number) => {
    if (!kg || kg === 0) return '0 kg';
    const numKg = typeof kg === 'string' ? parseFloat(kg) : kg;
    if (isNaN(numKg)) return '0 kg';
    return `${numKg.toFixed(0)} kg`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
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
        <p className="text-gray-500">No workout data available</p>
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
                  ? 'bg-blue-600 text-white'
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
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={<span className="text-2xl">💪</span>}
        />
        <StatCard
          title="Total Volume"
          value={formatVolume(stats.totalVolume)}
          icon={<span className="text-2xl">🏋️</span>}
        />
        <StatCard
          title="Exercises Completed"
          value={stats.totalExercises}
          icon={<span className="text-2xl">📋</span>}
        />
        <StatCard
          title="Avg Duration"
          value={formatDuration(stats.averageWorkoutDuration)}
          icon={<span className="text-2xl">⏱️</span>}
        />
      </div>
    </div>
  );
}
