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
            <h1 className="text-3xl font-bold text-gray-900">Workout Templates</h1>
            <p className="mt-2 text-gray-600">Create and manage reusable workout plans</p>
          </div>
          <Link
            href="/workouts/templates/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            + Create Template
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
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl mb-4 block">📋</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Templates Yet</h2>
              <p className="text-gray-600 mb-6">
                Create workout templates to save time and stay consistent with your training!
              </p>
              <Link
                href="/workouts/templates/new"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Template
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden hover:border-blue-400 transition-colors">
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {template.name || 'Untitled Template'}
                  </h3>
                  {template.workoutType && (
                    <p className="text-sm text-gray-500 capitalize mb-3">
                      {template.workoutType}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{template.exercises.length}</span> exercise{template.exercises.length !== 1 ? 's' : ''}
                    </div>
                    {template.totalReps && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{template.totalReps}</span> total reps
                      </div>
                    )}
                  </div>

                  {template.notes && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {template.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartWorkout(template.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Start Workout
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, templateId: template.id })}
                      className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
