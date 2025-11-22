interface ExerciseProgressProps {
  exerciseName: string;
  category: string;
  completedSets: number;
  totalSets: number;
  isComplete: boolean;
  onRemove: () => void;
}

export default function ExerciseProgress({
  exerciseName,
  category,
  completedSets,
  totalSets,
  isComplete,
  onRemove,
}: ExerciseProgressProps) {
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className={`p-4 rounded-lg transition-all duration-300 ${
      isComplete ? 'bg-green-50 border-2 border-green-400' : 'bg-white border-2 border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{exerciseName}</h3>
            {isComplete && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500 rounded-full">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white text-xs font-bold">DONE</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 capitalize">{category.replace('_', ' ')}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="min-w-[44px] h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove exercise"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={`text-sm font-bold whitespace-nowrap ${
          isComplete ? 'text-green-600' : 'text-gray-600'
        }`}>
          {completedSets}/{totalSets} sets
        </span>
      </div>
    </div>
  );
}
