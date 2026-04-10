'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
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
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <AlertTriangle className="h-8 w-8 text-amber-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
          Wizard Generation Error
        </h2>
        <p className="mt-2 max-w-md text-[var(--muted-foreground)]">
          {error.message || 'There was a problem preparing the AI environment for your stack generation.'}
        </p>
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => reset()}
            size="lg"
            className="gap-2 rounded-lg bg-[var(--foreground)] px-6 text-[var(--background)] shadow-sm hover:bg-[var(--foreground)]/90"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Wizard
          </Button>
          <Link href="/project">
            <Button
              variant="outline"
              size="lg"
              className="rounded-lg px-6 hover:bg-[var(--card)]"
            >
              Return to Archives
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
