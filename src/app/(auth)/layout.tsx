import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Left: Illustration panel (hidden on mobile) */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-500)]/10 via-transparent to-[var(--color-accent-500)]/10" />

        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-[300px] w-[300px] rounded-full bg-[var(--color-accent-500)]/8 blur-[100px]" />

        {/* Main illustration */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-12">
          <Image
            src="/illustrations/undraw/login.svg"
            alt="Welcome illustration"
            width={380}
            height={380}
            className="drop-shadow-2xl"
            priority
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Architect Your <span className="text-[var(--primary)]">Perfect Stack</span>
            </h2>
            <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
              Join thousands of developers using AI to make smarter technology decisions.
            </p>
          </div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Right: Auth content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="from-primary-500 to-primary-600 shadow-primary-500/25 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
            <span className="text-lg font-black text-white">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pylon</span>
        </Link>

        {/* Card container */}
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl shadow-black/5">
            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Pylon. All rights reserved.
        </p>
      </div>
    </div>
  );
}
