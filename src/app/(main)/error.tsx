'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
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
    // Log the error to an error reporting service
    console.error('App Boundary Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--border)] bg-red-500/10 shadow-sm">
        <AlertOctagon className="h-10 w-10 text-red-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        Something went wrong
      </h2>
      <p className="mt-3 max-w-md text-[var(--muted-foreground)]">
        {error.message || 'We encountered an unexpected issue while loading this page.'}
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          onClick={() => reset()}
          size="lg"
          className="gap-2 rounded-lg bg-[var(--foreground)] px-6 text-[var(--background)] shadow-sm hover:bg-[var(--foreground)]/90"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/project">
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg px-6 hover:bg-[var(--card)]"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
