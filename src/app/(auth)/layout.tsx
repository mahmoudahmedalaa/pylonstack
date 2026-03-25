import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4">
      {/* Subtle gradient orb background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary-500/[0.07] absolute -top-[20%] -left-[20%] h-[60vh] w-[60vh] rounded-full blur-[120px]" />
        <div className="bg-accent-500/[0.05] absolute -right-[10%] -bottom-[10%] h-[50vh] w-[50vh] rounded-full blur-[100px]" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <div className="from-primary-500 to-primary-600 shadow-primary-500/25 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
          <span className="text-lg font-black text-white">P</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pylon</span>
      </Link>

      {/* Card container */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl shadow-black/5">
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-8 text-xs text-[var(--muted-foreground)]">
        © {new Date().getFullYear()} Pylon. All rights reserved.
      </p>
    </div>
  );
}
