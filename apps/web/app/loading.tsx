export default function Loading() {
  return (
    <main className="flex-1 bg-surface-50 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-surface-600">Loading...</p>
      </div>
    </main>
  );
}
