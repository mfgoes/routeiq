'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '@/types/workout';

interface ExerciseSubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: Exercise;
  allExercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
}

export default function ExerciseSubstitutionModal({
  isOpen,
  onClose,
  currentExercise,
  allExercises,
  onSelect,
}: ExerciseSubstitutionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllExercises, setShowAllExercises] = useState(false);

  // Filter exercises by same category
  const sameCategoryExercises = allExercises.filter(
    (ex) => ex.category === currentExercise.category && ex.id !== currentExercise.id
  );

  // Quick suggestions (first 3 from same category)
  const quickSuggestions = sameCategoryExercises.slice(0, 3);

  // Filtered exercises for search
  const filteredExercises = allExercises.filter((ex) => {
    if (ex.id === currentExercise.id) return false;
    if (!searchQuery) return true;
    return (
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setShowAllExercises(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Swap Exercise</h2>
            <p className="text-sm text-gray-500 mt-1">
              Replace <span className="font-semibold text-gray-700">{currentExercise.name}</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Suggestions */}
          {!showAllExercises && quickSuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Alternatives
              </h3>
              <div className="space-y-2">
                {quickSuggestions.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelect(exercise)}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 active:bg-blue-200 transition-all active:scale-[0.98] touch-manipulation text-left"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{exercise.name}</div>
                      <div className="text-sm text-gray-600 capitalize mt-1">
                        {exercise.category.replace('_', ' ')}
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Browse All Button */}
          {!showAllExercises && (
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => setShowAllExercises(true)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all active:scale-[0.98] touch-manipulation font-semibold text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse All Exercises
              </button>
            </div>
          )}

          {/* All Exercises with Search */}
          {showAllExercises && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setShowAllExercises(false)}
                  className="min-w-[48px] h-[48px] flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all active:scale-95 touch-manipulation"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="flex-1 h-[52px] px-4 text-base border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => {
                    const isSameCategory = exercise.category === currentExercise.category;
                    return (
                      <button
                        key={exercise.id}
                        onClick={() => handleSelect(exercise)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all active:scale-[0.98] touch-manipulation text-left ${
                          isSameCategory
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 active:bg-blue-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{exercise.name}</div>
                          <div className="text-sm text-gray-600 capitalize mt-1">
                            {exercise.category.replace('_', ' ')}
                            {isSameCategory && (
                              <span className="ml-2 text-xs font-semibold text-blue-600">• Same muscle group</span>
                            )}
                          </div>
                        </div>
                        <svg className={`w-6 h-6 ${isSameCategory ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>No exercises found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
