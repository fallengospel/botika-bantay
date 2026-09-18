'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 bg-surface-50 flex items-center justify-center min-h-[50vh]">
      <div className="text-center px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="text-lg font-semibold text-surface-900 mb-2">Something went wrong</h2>
        <p className="text-surface-600 mb-4">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
