'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getWorkoutSettings, saveWorkoutSettings, type WorkoutSettings } from '@/lib/workoutSettings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<WorkoutSettings>(getWorkoutSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getWorkoutSettings());
  }, []);

  const handleSave = () => {
    saveWorkoutSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Customize your workout tracking experience</p>
        </div>

        {saved && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg font-medium">
            Settings saved successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Workout Preferences</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Progressive Overload Increment */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Progressive Overload Increment
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Default weight increase for progressive overload. This will be suggested when you start a new workout based on your last performance.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={settings.progressiveOverloadIncrement}
                  onChange={(e) => setSettings({
                    ...settings,
                    progressiveOverloadIncrement: parseFloat(e.target.value) || 0
                  })}
                  step="0.5"
                  min="0"
                  max="20"
                  className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-medium"
                />
                <span className="text-gray-600 font-medium">kg</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, progressiveOverloadIncrement: 2.5 })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  2.5 kg
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, progressiveOverloadIncrement: 5 })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  5 kg
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, progressiveOverloadIncrement: 10 })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  10 kg
                </button>
              </div>
            </div>

            {/* Default Rest Time */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Default Rest Time Between Sets
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Default rest period automatically filled when adding sets.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={settings.defaultRestTime}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultRestTime: parseInt(e.target.value) || 0
                  })}
                  step="15"
                  min="0"
                  max="600"
                  className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-medium"
                />
                <span className="text-gray-600 font-medium">seconds</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, defaultRestTime: 60 })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  60s
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, defaultRestTime: 90 })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  90s
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, defaultRestTime: 120 })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  2m
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, defaultRestTime: 180 })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  3m
                </button>
              </div>
            </div>

            {/* Auto-suggest Weights */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.autoSuggestWeights}
                  onChange={(e) => setSettings({
                    ...settings,
                    autoSuggestWeights: e.target.checked
                  })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Auto-suggest weights based on workout history
                  </div>
                  <p className="text-sm text-gray-600">
                    Automatically suggest weights for exercises based on your last workout with progressive overload applied.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
