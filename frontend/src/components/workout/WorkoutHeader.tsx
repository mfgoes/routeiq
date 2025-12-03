import { useEffect, useState } from 'react';
import RestTimerDisplay from './RestTimerDisplay';

interface WorkoutHeaderProps {
  startTime: Date;
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
  currentExerciseName?: string;
  currentExerciseIcon?: string;
  restTimer?: {
    remainingSeconds: number;
    totalSeconds: number;
  } | null;
  onSkipRest?: () => void;
}

export default function WorkoutHeader({
  startTime,
  totalExercises,
  completedExercises,
  totalSets,
  completedSets,
  currentExerciseName,
  currentExerciseIcon,
  restTimer,
  onSkipRest,
}: WorkoutHeaderProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60);
      setElapsedMinutes(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50 to-white border-b-2 border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        {/* Top row: Timer and progress */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">{formatDuration(elapsedMinutes)}</span>
            <span className="text-sm text-gray-600">
              {completedExercises}/{totalExercises} exercises • {completedSets}/{totalSets} sets
            </span>
          </div>
        </div>

        {/* Rest Timer Row (conditional) */}
        {restTimer && onSkipRest && (
          <div className="mb-2">
            <RestTimerDisplay
              remainingSeconds={restTimer.remainingSeconds}
              totalSeconds={restTimer.totalSeconds}
              onSkip={onSkipRest}
            />
          </div>
        )}

        {/* Current Exercise Row */}
        {currentExerciseName && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 mb-2">
            {currentExerciseIcon && (
              <img src={currentExerciseIcon} alt="" className="w-6 h-6 object-contain" />
            )}
            <span className="text-sm font-semibold text-blue-900">
              Current: {currentExerciseName}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
