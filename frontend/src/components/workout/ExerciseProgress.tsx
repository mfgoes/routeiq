import { useState, useRef, useEffect } from 'react';

interface ExerciseProgressProps {
  exerciseName: string;
  category: string;
  completedSets: number;
  totalSets: number;
  isComplete: boolean;
  onRemove: () => void;
  onSkip?: () => void;
  onSwap?: () => void;
  onMarkSubstitution?: () => void;
  onToggleProgressiveOverload?: () => void;
  isSkipped?: boolean;
  isSubstitution?: boolean;
  progressiveOverload?: boolean;
  iconUrl?: string;
  muscleGroups?: string[];
  equipment?: string[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ExerciseProgress({
  exerciseName,
  category,
  completedSets,
  totalSets,
  isComplete,
  onRemove,
  onSkip,
  onSwap,
  onMarkSubstitution,
  onToggleProgressiveOverload,
  isSkipped = false,
  isSubstitution = false,
  progressiveOverload = false,
  iconUrl,
  muscleGroups,
  equipment,
  isCollapsed = false,
  onToggleCollapse,
}: ExerciseProgressProps) {
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative p-5 rounded-xl transition-all duration-300 ${
      isSkipped
        ? 'bg-gray-50 border-2 border-gray-300 opacity-75'
        : isComplete
        ? 'bg-green-50 border-2 border-green-400'
        : 'bg-white border-2 border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex-1 flex items-start gap-3 text-left cursor-pointer hover:opacity-80 transition-opacity"
          disabled={!onToggleCollapse}
        >
          {/* Exercise Icon */}
          {iconUrl && (
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 p-2">
              <img src={iconUrl} alt="" className="w-full h-full object-contain" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-xl sm:text-2xl font-bold ${isSkipped ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {exerciseName}
              </h3>
              {isComplete && !isSkipped && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 rounded-full shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-sm font-bold">DONE</span>
                </div>
              )}
              {isSkipped && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 rounded-full shadow-sm">
                  <span className="text-white text-sm font-bold">SKIPPED</span>
                </div>
              )}
              {isSubstitution && !isSkipped && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 rounded-full shadow-sm">
                  <span className="text-white text-sm font-bold">SUBSTITUTION</span>
                </div>
              )}

              {/* Collapse/Expand indicator */}
              {onToggleCollapse && (
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>

            {/* Muscle Groups & Equipment */}
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <span className="capitalize">{category.replace(/_/g, ' ')}</span>
              {muscleGroups && muscleGroups.length > 0 && (
                <>
                  <span>•</span>
                  <span className="capitalize">{muscleGroups.join(', ')}</span>
                </>
              )}
              {equipment && equipment.length > 0 && (
                <>
                  <span>•</span>
                  <span className="capitalize">{equipment.join(', ')}</span>
                </>
              )}
            </div>
          </div>
        </button>

        {/* Exercise menu */}
        <div className="flex items-center gap-2" ref={menuRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="min-w-[48px] h-[48px] flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all active:scale-95 touch-manipulation"
              aria-label="Exercise options"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border-2 border-gray-200 z-10 overflow-hidden">
                {onSkip && (
                  <button
                    type="button"
                    onClick={() => {
                      onSkip();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    <div>
                      <div className="font-semibold">Skip Exercise</div>
                      <div className="text-xs text-gray-500">Machine occupied</div>
                    </div>
                  </button>
                )}
                {onSwap && (
                  <button
                    type="button"
                    onClick={() => {
                      onSwap();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100 touch-manipulation"
                  >
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <div>
                      <div className="font-semibold">Swap Exercise</div>
                      <div className="text-xs text-gray-500">Find alternative</div>
                    </div>
                  </button>
                )}
                {onMarkSubstitution && (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkSubstitution();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100 touch-manipulation"
                  >
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <div className="font-semibold">Mark as Substitution</div>
                      <div className="text-xs text-gray-500">Track variation</div>
                    </div>
                  </button>
                )}
                {onToggleProgressiveOverload && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleProgressiveOverload();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100 touch-manipulation"
                  >
                    {progressiveOverload ? (
                      <>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            Progressive Overload
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">ON</span>
                          </div>
                          <div className="text-xs text-gray-500">Auto-increase weight</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <div>
                          <div className="font-semibold">Progressive Overload</div>
                          <div className="text-xs text-gray-500">Auto-increase weight per set</div>
                        </div>
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors border-t border-gray-100 touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <div>
                    <div className="font-semibold">Remove Exercise</div>
                    <div className="text-xs text-gray-500">Delete from workout</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar - More prominent */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        {/* Set counter - Now shown above on mobile */}
        <span className={`text-lg sm:text-base font-bold whitespace-nowrap sm:order-2 ${
          isComplete ? 'text-green-600' : 'text-blue-600'
        }`}>
          {completedSets}/{totalSets} sets
        </span>
        {/* Progress bar */}
        <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner sm:order-1">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              isComplete ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
