export default function MedicinesLoading() {
  return (
    <main className="flex-1 bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-48"></div>
          <div className="h-12 bg-surface-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-surface-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
