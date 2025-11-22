import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WorkoutSummaryProps {
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  totalReps: number;
  durationMinutes: number;
  onClose: () => void;
}

export default function WorkoutSummary({
  totalExercises,
  totalSets,
  totalVolume,
  totalReps,
  durationMinutes,
  onClose,
}: WorkoutSummaryProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
        {/* Celebration header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce-once">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Workout Complete!
          </h2>
          <p className="text-gray-600">Great job crushing it today</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{totalExercises}</div>
            <div className="text-sm text-gray-600 mt-1">Exercises</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{totalSets}</div>
            <div className="text-sm text-gray-600 mt-1">Sets</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(totalVolume)}
            </div>
            <div className="text-sm text-gray-600 mt-1">kg Volume</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{durationMinutes}</div>
            <div className="text-sm text-gray-600 mt-1">Minutes</div>
          </div>
        </div>

        {/* Additional stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Reps</span>
            <span className="font-bold text-gray-900">{totalReps}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/workouts')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            View All Workouts
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
