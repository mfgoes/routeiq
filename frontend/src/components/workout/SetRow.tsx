import { WorkoutSet } from '@/types/workout';
import IncrementInput from './IncrementInput';

interface SetRowProps {
  set: WorkoutSet;
  setNumber: number;
  onUpdate: (field: keyof WorkoutSet, value: any) => void;
  onRemove: () => void;
  onNext?: () => void;
  canRemove: boolean;
  autoFocusWeight?: boolean;
  showCompletion?: boolean; // Whether to show completion checkbox
}

export default function SetRow({
  set,
  setNumber,
  onUpdate,
  onRemove,
  onNext,
  canRemove,
  autoFocusWeight,
  showCompletion = true,
}: SetRowProps) {
  const isComplete = set.completed === true;

  return (
    <div
      className={`relative flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
        isComplete
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-white border-2 border-gray-200'
      }`}
    >
      {/* Header row with set number and remove button */}
      <div className="flex items-center justify-between sm:min-w-[100px]">
        {/* Set number or completion checkbox */}
        {showCompletion ? (
          <div className="flex flex-col items-start gap-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isComplete}
                onChange={(e) => onUpdate('completed', e.target.checked)}
                className="w-6 h-6 rounded cursor-pointer accent-green-500 touch-manipulation"
                aria-label={`Mark set ${setNumber} as complete`}
              />
              <span className="text-base font-semibold text-gray-700">
                Set {setNumber}
              </span>
            </label>
            {isComplete && (
              <span className="text-xs text-green-600 font-medium ml-8">✓ Done</span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-w-[52px] h-[52px] bg-gray-100 rounded-xl">
            <span className="text-xl font-bold text-gray-600">{setNumber}</span>
          </div>
        )}

        {/* Remove button (mobile: top-right) */}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="sm:hidden min-w-[48px] h-[48px] flex items-center justify-center text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all active:scale-95 touch-manipulation"
            aria-label="Remove set"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Inputs row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
        {/* Reps Input */}
        <div className="flex-1 min-w-0">
          <IncrementInput
            value={set.reps}
            onChange={(val) => onUpdate('reps', val)}
            min={1}
            step={1}
            decrements={[1]}
            increments={[1]}
            placeholder="0"
            label="Reps"
            required
            onEnterOrTab={onNext}
          />
        </div>

        {/* Weight Input */}
        <div className="flex-1 min-w-0">
          <IncrementInput
            value={set.weight}
            onChange={(val) => onUpdate('weight', val)}
            min={0}
            step={0.5}
            decrements={[5]}
            increments={[5]}
            placeholder="0"
            label="kg"
            autoFocus={autoFocusWeight}
            onEnterOrTab={onNext}
          />
        </div>
      </div>

      {/* Remove button (desktop: right side) */}
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hidden sm:flex min-w-[52px] h-[52px] items-center justify-center text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all active:scale-95 touch-manipulation"
          aria-label="Remove set"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
