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
      className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
        isComplete
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-white border-2 border-gray-200'
      }`}
    >
      {/* Set number or completion checkbox */}
      {showCompletion ? (
        <div className="flex flex-col items-start gap-1 min-w-[90px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isComplete}
              onChange={(e) => onUpdate('completed', e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer accent-green-500"
              aria-label={`Mark set ${setNumber} as complete`}
            />
            <span className="text-sm font-medium text-gray-700">
              Set {setNumber}
            </span>
          </label>
          {isComplete && (
            <span className="text-xs text-green-600 ml-7">Completed</span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-w-[44px] h-[44px] bg-gray-100 rounded-lg">
          <span className="text-lg font-bold text-gray-600">{setNumber}</span>
        </div>
      )}

      {/* Reps Input */}
      <div className="flex-1">
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
      <div className="flex-1">
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

      {/* Remove button */}
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="min-w-[44px] h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end mb-1"
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
