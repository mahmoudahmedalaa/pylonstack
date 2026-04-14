'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function CreateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Wizard Boundary Error:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center p-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-amber-500/10">
          <AlertTriangle className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Wizard Generation Error</h2>
        <p className="mt-2 max-w-md text-neutral-500">
          {error.message ||
            'There was a problem preparing the AI environment for your stack generation.'}
        </p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Wizard
          </button>
          <Link
            href="/project"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Return to Archives
          </Link>
        </div>
      </div>
    </div>
  );
}
