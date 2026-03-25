'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { Mail, AlertCircle, ArrowLeft, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="py-4 text-center">
        <div className="bg-primary-500/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <Check className="text-primary-400 h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          We&apos;ve sent a password reset link to{' '}
          <span className="font-medium text-[var(--foreground)]">{email}</span>
        </p>
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <button
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            try again
          </button>
        </p>
        <Link
          href="/login"
          className="text-primary-400 hover:text-primary-300 mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Reset your password
        </h1>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />

        <Button type="submit" variant="primary" className="w-full justify-center" loading={loading}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-primary-400 hover:text-primary-300 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </>
  );
}
