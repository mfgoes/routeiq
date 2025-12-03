'use client';

interface RestTimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  onSkip: () => void;
}

export default function RestTimerDisplay({
  remainingSeconds,
  totalSeconds,
  onSkip,
}: RestTimerDisplayProps) {
  const progressPercent = (remainingSeconds / totalSeconds) * 100;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="bg-blue-600 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white font-bold text-lg">
            Rest: {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <button
          onClick={onSkip}
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-lg font-semibold text-sm transition-all active:scale-95 touch-manipulation"
        >
          Skip
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-white/20 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
