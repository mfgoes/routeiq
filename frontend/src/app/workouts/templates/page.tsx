'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { workoutsAPI } from '@/lib/api';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface WorkoutTemplate {
  id: string;
  name: string;
  workoutType: string;
  exercises: any[];
  totalVolume?: number;
  totalReps?: number;
  notes?: string;
  createdAt: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    templateId: string | null;
  }>({ isOpen: false, templateId: null });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await workoutsAPI.listTemplates();
      setTemplates(response.data.templates || []);
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError(err.response?.data?.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.templateId) return;

    try {
      await workoutsAPI.deleteTemplate(deleteModal.templateId);
      setTemplates(templates.filter(t => t.id !== deleteModal.templateId));
      setDeleteModal({ isOpen: false, templateId: null });
    } catch (err: any) {
      console.error('Error deleting template:', err);
      setError(err.response?.data?.message || 'Failed to delete template');
      setDeleteModal({ isOpen: false, templateId: null });
    }
  };

  const handleStartWorkout = (templateId: string) => {
    router.push(`/workouts/new?template=${templateId}&mode=execute`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Training Plan</h1>
            <p className="mt-2 text-gray-600">Build your weekly workout program</p>
          </div>
          <Link
            href="/workouts/templates/new"
            className="inline-flex items-center gap-2 px-5 py-3 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Workout
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-12 text-center border-2 border-blue-200">
            <div className="max-w-md mx-auto">
              <span className="text-7xl mb-4 block">💪</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Build Your Training Plan</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Create your weekly workout program. Whether it's Push/Pull/Legs, Upper/Lower, or your custom split - design workouts that fit your goals!
              </p>
              <Link
                href="/workouts/templates/new"
                className="inline-flex items-center gap-2 px-8 py-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Workout
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Info banner */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Your Weekly Program</h3>
                  <p className="text-sm text-blue-800">
                    Each workout below is part of your training plan. Click "Start Workout" when you're ready, and feel free to skip or swap exercises if needed!
                  </p>
                </div>
              </div>
            </div>

            {/* Template cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {templates.map((template, index) => (
                <div
                  key={template.id}
                  className="group bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  {/* Colored header stripe */}
                  <div className={`h-2 ${
                    index % 6 === 0 ? 'bg-blue-500' :
                    index % 6 === 1 ? 'bg-green-500' :
                    index % 6 === 2 ? 'bg-purple-500' :
                    index % 6 === 3 ? 'bg-orange-500' :
                    index % 6 === 4 ? 'bg-pink-500' : 'bg-teal-500'
                  }`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {template.name || 'Untitled Workout'}
                        </h3>
                        {template.workoutType && (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full capitalize">
                            {template.workoutType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-semibold">{template.exercises.length}</span> exercises
                      </div>
                      {template.totalReps && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">{template.totalReps}</span> reps
                        </div>
                      )}
                    </div>

                    {template.notes && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">
                        "{template.notes}"
                      </p>
                    )}

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleStartWorkout(template.id)}
                        className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-sm hover:shadow-md"
                      >
                        Start Workout
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, templateId: template.id })}
                        className="px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all active:scale-95"
                        aria-label="Delete workout"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Template?"
        message="Are you sure you want to delete this template? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, templateId: null })}
      />
    </DashboardLayout>
  );
}
