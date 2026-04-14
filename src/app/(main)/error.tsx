'use client';

import { useEffect } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Boundary Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-red-500/10">
        <AlertOctagon className="h-10 w-10 text-red-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-white">Something went wrong</h2>
      <p className="mt-3 max-w-md text-neutral-500">
        {error.message || 'We encountered an unexpected issue while loading this page.'}
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
