'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function NewTemplatePage() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('');

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Workout Template</h1>
          <p className="mt-2 text-gray-600">Build a reusable workout plan</p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-900 font-medium mb-4">
            Template creation is coming soon! For now, you can save any completed workout as a template.
          </p>
          <p className="text-blue-700 text-sm mb-6">
            Pro tip: Create a workout with your desired exercises and sets, then it will automatically appear in your templates.
          </p>
          <button
            onClick={() => router.push('/workouts/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Create Workout Instead
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
