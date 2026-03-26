import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] h-[50vh] w-[50vh] rounded-full bg-[var(--primary)]/5 blur-[120px]" />
        <div className="absolute -right-[15%] -bottom-[15%] h-[40vh] w-[40vh] rounded-full bg-[var(--color-accent-500)]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Illustration */}
        <Image
          src="/illustrations/undraw/not-found.svg"
          alt="Page not found"
          width={360}
          height={360}
          className="mb-8 drop-shadow-xl"
          priority
        />

        <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
          Page Not Found
        </h1>
        <p className="mb-8 max-w-md text-lg text-[var(--muted-foreground)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back on track.
        </p>

        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--primary)]/25 shadow-lg transition-all hover:shadow-xl hover:brightness-110"
          >
            ← Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-all hover:border-[var(--primary)]/30"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
