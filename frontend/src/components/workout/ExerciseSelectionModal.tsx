'use client';

import { useState, useEffect } from 'react';
import type { Exercise } from '@/types/workout';

interface ExerciseSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  allExercises: Exercise[];
  selectedExerciseIds: string[];
  onSelect: (exercise: Exercise) => void;
  loading?: boolean;
}

export default function ExerciseSelectionModal({
  isOpen,
  onClose,
  allExercises,
  selectedExerciseIds,
  onSelect,
  loading = false,
}: ExerciseSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter exercises
  const filteredExercises = allExercises.filter(ex => {
    const notSelected = !selectedExerciseIds.includes(ex.id);
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ex.category === categoryFilter;
    return notSelected && matchesSearch && matchesCategory;
  });

  // Get unique categories from all exercises
  const categories = Array.from(new Set(allExercises.map(ex => ex.category))).sort();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setCategoryFilter('all');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Add Exercise</h2>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? (
                'Loading exercises...'
              ) : (
                `${filteredExercises.length} ${filteredExercises.length === 1 ? 'exercise' : 'exercises'} available`
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-w-[48px] h-[48px] flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all active:scale-95 touch-manipulation"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-100 space-y-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises..."
            className="w-full h-[52px] px-4 text-base border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation"
            autoFocus
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-[52px] px-4 text-base border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-3"></div>
                <p className="text-gray-600">Loading exercises...</p>
              </div>
            </div>
          ) : filteredExercises.length > 0 ? (
            <div className="space-y-2">
              {filteredExercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100 transition-all active:scale-[0.98] touch-manipulation text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-base mb-1">
                        {exercise.name}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {exercise.category.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        ADD
                      </span>
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-semibold text-gray-700 mb-1">No exercises found</p>
              <p className="text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'All exercises have been added'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
