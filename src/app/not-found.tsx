import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] h-[50vh] w-[50vh] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute -right-[15%] -bottom-[15%] h-[40vh] w-[40vh] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* 404 Display */}
        <div className="mb-8 text-[12vw] leading-none font-bold tracking-tighter text-[#18181b] select-none">
          404
        </div>

        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">Page Not Found</h1>
        <p className="mb-8 max-w-md text-base text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
          >
            ← Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
