'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0,
  };

  const isPasswordValid =
    passwordChecks.length && passwordChecks.uppercase && passwordChecks.number;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Please meet all password requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: authError } = await signUpWithEmail(email, password, fullName);

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('An account with this email already exists.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Supabase local dev auto-confirms; production sends verification email
    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError.message);
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
          <Check className="h-7 w-7 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Account created!
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          Start building smarter tech stacks
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google OAuth */}
      <Button
        variant="outline"
        className="w-full justify-center gap-2.5"
        onClick={handleGoogleSignUp}
        loading={googleLoading}
        disabled={loading}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
          or
        </span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      {/* Registration form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
          required
          autoComplete="name"
        />

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

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
          autoComplete="new-password"
        />

        {/* Password strength indicators */}
        {password.length > 0 && (
          <div className="space-y-1.5 rounded-lg bg-[var(--muted)]/50 p-3">
            {[
              { key: 'length', label: 'At least 8 characters', met: passwordChecks.length },
              { key: 'uppercase', label: 'One uppercase letter', met: passwordChecks.uppercase },
              { key: 'number', label: 'One number', met: passwordChecks.number },
            ].map(({ key, label, met }) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                    met
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  }`}
                >
                  <Check className="h-2.5 w-2.5" />
                </div>
                <span className={met ? 'text-green-400' : 'text-[var(--muted-foreground)]'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          required
          autoComplete="new-password"
          error={
            confirmPassword.length > 0 && !passwordChecks.match
              ? 'Passwords do not match'
              : undefined
          }
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          loading={loading}
          disabled={googleLoading || !isPasswordValid}
        >
          Create Account
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
