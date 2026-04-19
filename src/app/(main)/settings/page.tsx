'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { createClient } from '@/lib/supabase/client';
import { User, Shield, CreditCard, AlertTriangle, Key, Globe, Check, Loader2 } from 'lucide-react';
import { Button, Input, Badge, Avatar } from '@/components/ui';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal, useUpgradeModal } from '@/components/UpgradeModal';
import { ProBadge } from '@/components/ProBadge';

// ── Settings Tabs ───────────────────────────────

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  // { id: 'preferences', label: 'Preferences', icon: Palette }, // Phase 2: Deferred features
] as const;

type TabId = (typeof TABS)[number]['id'];

// ── Section Wrapper ─────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h3 className="text-sm font-medium text-[var(--foreground)]">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Field Row ───────────────────────────────────

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-3 sm:items-start sm:gap-4">
      <div className="sm:pt-2">
        <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>
        {hint && <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

// ── Profile Tab ─────────────────────────────────

function ProfileTab({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.display_name || user.user_metadata?.full_name || '');
      setBio(user.user_metadata?.bio || '');
      setWebsite(user.user_metadata?.website || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        full_name: displayName,
        bio,
        website,
      },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="space-y-6">
      <Section title="Profile Information" description="Your public profile details.">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar fallback={initials} size="lg" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {displayName || 'User'}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                {user?.email || 'No email'}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <FieldRow label="Display Name" hint="How others will see you.">
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </FieldRow>

            <FieldRow label="Email" hint="Used for notifications and login.">
              <div className="flex items-center gap-2">
                <Input value={user?.email || ''} type="email" disabled />
                <Badge variant="default">
                  {user?.email_confirmed_at ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </FieldRow>

            <FieldRow label="Bio">
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </FieldRow>

            <FieldRow label="Website">
              <div className="relative">
                <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="pl-10"
                  placeholder="https://yoursite.com"
                />
              </div>
            </FieldRow>
          </div>

          <div className="flex justify-end border-t border-[var(--border)]/50 pt-4">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="mr-1.5 h-4 w-4" /> Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ── Subscription Section ────────────────────────

const TIER_CONFIG = {
  free: {
    label: 'Free',
    color: 'var(--muted-foreground)',
    limits: '3 projects · 2 tool comparisons · No AI · No export',
  },
  pro: {
    label: 'Pro',
    color: 'var(--primary)',
    limits: 'Unlimited projects · Unlimited comparisons · AI advisor · Export',
  },
  team: {
    label: 'Team',
    color: '#a78bfa',
    limits: 'Everything in Pro + team collaboration · Priority support',
  },
} as const;

function SubscriptionSection() {
  const { tier, loading, isPro } = useSubscription();
  const { open, reason, show, hide } = useUpgradeModal();
  const config = TIER_CONFIG[tier];

  return (
    <>
      <Section title="Subscription" description="Manage your plan and billing.">
        {loading ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--muted-foreground)]" />
            <span className="text-sm text-[var(--muted-foreground)]">Loading plan…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Plan Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: `color-mix(in srgb, ${config.color} 15%, transparent)` }}
                >
                  <CreditCard className="h-5 w-5" style={{ color: config.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {config.label} Plan
                    </p>
                    <Badge
                      variant="default"
                      style={{ borderColor: config.color, color: config.color }}
                    >
                      Current
                    </Badge>
                    {isPro && <ProBadge />}
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{config.limits}</p>
                </div>
              </div>
              {!isPro && (
                <Button variant="primary" size="sm" onClick={() => show('settings')}>
                  Upgrade to Pro
                </Button>
              )}
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Projects', free: '3', pro: '∞' },
                { label: 'Compare', free: '2 tools', pro: '∞' },
                { label: 'AI Advisor', free: '—', pro: '✓' },
                { label: 'Export', free: '—', pro: '✓' },
              ].map((feat) => (
                <div
                  key={feat.label}
                  className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 px-3 py-2 text-center"
                >
                  <p className="text-xs text-[var(--muted-foreground)]">{feat.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
                    {isPro ? feat.pro : feat.free}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      <UpgradeModal open={open} onClose={hide} reason={reason} />
    </>
  );
}

// ── Account Tab ─────────────────────────────────

function AccountTab({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdatePassword = async () => {
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  // Determine if user signed in via OAuth (no password to change)
  const isOAuth = user?.app_metadata?.provider !== 'email';

  return (
    <div className="space-y-6">
      <Section title="Password" description="Update your password to keep your account secure.">
        {isOAuth ? (
          <div className="flex items-center gap-3 rounded-lg bg-[var(--muted)]/30 p-4">
            <Shield className="h-5 w-5 text-[var(--muted-foreground)]" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">OAuth Account</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                You signed in with {user?.app_metadata?.provider || 'an external provider'}.
                Password management is handled by your provider.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <FieldRow label="Current Password">
              <Input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </FieldRow>
            <FieldRow label="New Password">
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FieldRow>
            <FieldRow label="Confirm Password">
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FieldRow>
            <div className="flex justify-end border-t border-[var(--border)]/50 pt-4">
              <Button variant="primary" size="sm" onClick={handleUpdatePassword} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : saved ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4" /> Updated!
                  </>
                ) : (
                  <>
                    <Key className="mr-1.5 h-4 w-4" /> Update Password
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Section>

      <SubscriptionSection />

      <Section title="Danger Zone" description="Irreversible actions.">
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/5 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--color-error)]" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Delete Account</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Permanently delete your account and all projects.
              </p>
            </div>
          </div>
          {showDeleteConfirm ? (
            <div className="flex flex-col items-end gap-2">
              {deleteError && <p className="text-xs text-[var(--color-error)]">{deleteError}</p>}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError(null);
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    setDeleteError(null);
                    try {
                      const res = await fetch('/api/account', { method: 'DELETE' });
                      if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || 'Failed to delete account');
                      }
                      // Sign out and redirect
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      router.push('/login');
                    } catch (err) {
                      setDeleteError(
                        err instanceof Error ? err.message : 'Failed to delete account',
                      );
                      setDeleting(false);
                    }
                  }}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> Deleting...
                    </>
                  ) : (
                    'Confirm Delete'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </Section>
    </div>
  );
}

// ── Page: Settings ──────────────────────────────

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your account, preferences, and integrations.
        </p>
      </div>

      {/* ── Tabs (pill-style) ── */}
      <div className="flex w-fit gap-2 rounded-full border border-white/10 bg-white/5 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tracking-wide transition-all ${
                isActive ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'profile' && <ProfileTab user={user} />}
      {activeTab === 'account' && <AccountTab user={user} />}
    </div>
  );
}
