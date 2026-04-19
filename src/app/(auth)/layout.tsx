import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Left: Branded illustration panel (hidden on mobile) */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {/* Pure black base */}
        <div className="absolute inset-0 bg-black" />

        {/* Subtle indigo radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(99,102,241,0.12),transparent_60%)]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Massive PYLON watermark */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex justify-center overflow-hidden mix-blend-screen">
          <span className="text-[18vw] leading-[0.8] font-black tracking-tighter text-[#18181b] select-none">
            PYLON
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start gap-8 px-16">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <Logo className="h-6 w-6 text-black" animate={false} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Pylon</span>
          </div>

          {/* Tagline */}
          <div className="max-w-sm">
            <h2 className="text-4xl leading-tight font-bold tracking-tight text-white">
              Architecture decisions made in minutes, not weeks.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-500">
              Generate precise tech stacks, calculate unit economics, and foresee integration risks
              — before you write a single line of code.
            </p>
          </div>

          {/* Social proof pill */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex -space-x-2">
              {['A', 'B', 'C'].map((l, i) => (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-black bg-neutral-700 text-[9px] font-bold text-white"
                >
                  {l}
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold text-neutral-400">
              Trusted by 2,000+ engineering teams
            </span>
          </div>
        </div>
      </div>

      {/* Right: Auth content */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#050505] px-4">
        {/* Logo (mobile only) */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80 lg:hidden"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <Logo className="h-5 w-5 text-black" animate={false} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Pylon</span>
        </Link>

        {/* Card container */}
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl">
            {children}
          </div>
        </div>

        <p className="mt-8 text-xs text-neutral-600">
          © {new Date().getFullYear()} Pylon Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
