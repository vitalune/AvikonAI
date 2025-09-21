'use client';

interface GenerationProgressProps {
  progress: number;
  status?: string;
}

export function GenerationProgress({ progress, status = 'Generating your image...' }: GenerationProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {status}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress steps */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className={progress >= 25 ? 'text-blue-600 dark:text-blue-400' : ''}>
          Processing
        </span>
        <span className={progress >= 50 ? 'text-blue-600 dark:text-blue-400' : ''}>
          Generating
        </span>
        <span className={progress >= 75 ? 'text-blue-600 dark:text-blue-400' : ''}>
          Refining
        </span>
        <span className={progress >= 100 ? 'text-green-600 dark:text-green-400' : ''}>
          Complete
        </span>
      </div>
    </div>
  );
}