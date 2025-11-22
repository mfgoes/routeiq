import { useEffect, useState } from 'react';

interface WorkoutHeaderProps {
  startTime: Date;
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
}

export default function WorkoutHeader({
  startTime,
  totalExercises,
  completedExercises,
  totalSets,
  completedSets,
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
    <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="px-4 py-4">
        {/* Timer and stats */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-bold">{formatDuration(elapsedMinutes)}</span>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Progress</div>
            <div className="text-lg font-bold">
              {completedExercises}/{totalExercises} exercises
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Set counter */}
        <div className="mt-2 text-center text-sm opacity-90">
          {completedSets} / {totalSets} sets completed
        </div>
      </div>
    </div>
  );
}
