'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { activitiesAPI, routesAPI } from '@/lib/api';

interface Route {
  id: string;
  name: string;
  distance: number;
}

export default function NewActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    routeId: searchParams.get('routeId') || '',
    activityType: 'run',
    startedAt: new Date().toISOString().slice(0, 16),
    distance: '',
    duration: '',
    averagePace: '',
    elevationGain: '',
    averageHeartRate: '',
    temperature: '',
    perceivedEffort: '',
    notes: '',
    isRace: false,
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await routesAPI.list();
      setRoutes(response.data.routes || []);
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert km to meters, minutes to seconds
      const distance = parseFloat(formData.distance) * 1000;
      const duration = parseFloat(formData.duration) * 60;

      const payload = {
        name: formData.name || undefined,
        routeId: formData.routeId || undefined,
        activityType: formData.activityType,
        startedAt: new Date(formData.startedAt).toISOString(),
        distance,
        duration,
        averagePace: formData.averagePace ? parseFloat(formData.averagePace) : undefined,
        elevationGain: formData.elevationGain ? parseFloat(formData.elevationGain) : undefined,
        averageHeartRate: formData.averageHeartRate ? parseInt(formData.averageHeartRate) : undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        perceivedEffort: formData.perceivedEffort ? parseInt(formData.perceivedEffort) : undefined,
        notes: formData.notes || undefined,
        isRace: formData.isRace,
      };

      await activitiesAPI.create(payload);
      router.push('/activities');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Log Activity</h1>
          <p className="mt-2 text-gray-600">Manually log a running activity</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
              placeholder="Morning Run"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Route (optional)</label>
            <select
              name="routeId"
              value={formData.routeId}
              onChange={handleChange}
              disabled={loadingRoutes}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
            >
              <option value="">No route selected</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.name} ({(route.distance / 1000).toFixed(1)} km)
                </option>
              ))}
            </select>
            {loadingRoutes && (
              <p className="mt-1 text-sm text-gray-500">Loading routes...</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
              >
                <option value="run">Run</option>
                <option value="trail_run">Trail Run</option>
                <option value="race">Race</option>
                <option value="recovery_run">Recovery Run</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input
                type="datetime-local"
                name="startedAt"
                value={formData.startedAt}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance (km) *</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
                placeholder="5.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Avg Pace (min/km)</label>
              <input
                type="number"
                name="averagePace"
                value={formData.averagePace}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
                placeholder="6.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Elevation Gain (m)</label>
              <input
                type="number"
                name="elevationGain"
                value={formData.elevationGain}
                onChange={handleChange}
                step="1"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Avg HR (bpm)</label>
              <input
                type="number"
                name="averageHeartRate"
                value={formData.averageHeartRate}
                onChange={handleChange}
                min="0"
                max="250"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
                placeholder="145"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
                placeholder="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Effort (1-10)</label>
              <input
                type="number"
                name="perceivedEffort"
                value={formData.perceivedEffort}
                onChange={handleChange}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
                placeholder="7"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm px-3 py-2 border"
              placeholder="How did you feel?"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isRace"
              checked={formData.isRace}
              onChange={handleChange}
              className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              This was a race
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
