'use client';

export default function MedicinesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 bg-surface-50 flex items-center justify-center min-h-[50vh]">
      <div className="text-center px-4">
        <h2 className="text-lg font-semibold text-surface-900 mb-2">Failed to load medicines</h2>
        <p className="text-surface-600 mb-4">{error.message || 'Please try again.'}</p>
        <button
          onClick={reset}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
