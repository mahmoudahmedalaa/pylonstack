'use client';

import { useState } from 'react';
import {
  User,
  Shield,
  Palette,
  Bell,
  CreditCard,
  AlertTriangle,
  Mail,
  Key,
  Globe,
  Moon,
  Sun,
} from 'lucide-react';
import { Button, Input, Select, Toggle, Badge, Avatar } from '@/components/ui';

// ── Settings Tabs ───────────────────────────────

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Palette },
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

function ProfileTab() {
  return (
    <div className="space-y-6">
      <Section title="Profile Information" description="Your public profile details.">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar fallback="JD" size="lg" />
            <div>
              <Button variant="ghost" size="sm">
                Change avatar
              </Button>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                JPG, PNG, or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <FieldRow label="Display Name" hint="How others will see you.">
              <Input defaultValue="John Doe" />
            </FieldRow>

            <FieldRow label="Email" hint="Used for notifications and login.">
              <div className="flex items-center gap-2">
                <Input defaultValue="john@example.com" type="email" />
                <Badge variant="default">Verified</Badge>
              </div>
            </FieldRow>

            <FieldRow label="Bio">
              <Input defaultValue="Full-stack developer building SaaS products." />
            </FieldRow>

            <FieldRow label="Website">
              <div className="relative">
                <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input defaultValue="https://johndoe.dev" className="pl-10" />
              </div>
            </FieldRow>
          </div>

          <div className="flex justify-end border-t border-[var(--border)]/50 pt-4">
            <Button variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ── Account Tab ─────────────────────────────────

function AccountTab() {
  return (
    <div className="space-y-6">
      <Section title="Password" description="Update your password to keep your account secure.">
        <div className="space-y-5">
          <FieldRow label="Current Password">
            <Input type="password" placeholder="Enter current password" />
          </FieldRow>
          <FieldRow label="New Password">
            <Input type="password" placeholder="Enter new password" />
          </FieldRow>
          <FieldRow label="Confirm Password">
            <Input type="password" placeholder="Confirm new password" />
          </FieldRow>
          <div className="flex justify-end border-t border-[var(--border)]/50 pt-4">
            <Button variant="primary" size="sm">
              <Key className="mr-1.5 h-4 w-4" />
              Update Password
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Subscription" description="Manage your plan and billing.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]/50">
              <CreditCard className="h-5 w-5 text-[var(--muted-foreground)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--foreground)]">Free Plan</p>
                <Badge variant="outline">Current</Badge>
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                3 projects, 50 tool comparisons/month
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Upgrade
          </Button>
        </div>
      </Section>

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
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
          >
            Delete
          </Button>
        </div>
      </Section>
    </div>
  );
}

// ── Preferences Tab ─────────────────────────────

function PreferencesTab() {
  return (
    <div className="space-y-6">
      <Section title="Appearance" description="Customize how Pylon looks and feels.">
        <div className="space-y-5">
          <FieldRow label="Theme" hint="Select your preferred color scheme.">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border-2 border-[var(--primary)] bg-[var(--primary)]/5 px-4 py-2.5 text-xs font-medium text-[var(--foreground)]">
                <Moon className="h-4 w-4" />
                Dark
              </button>
              <button className="flex items-center gap-2 rounded-lg border-2 border-[var(--border)] px-4 py-2.5 text-xs font-medium text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]/30">
                <Sun className="h-4 w-4" />
                Light
              </button>
            </div>
          </FieldRow>

          <FieldRow label="Default Currency" hint="Currency for cost estimates.">
            <Select defaultValue="usd">
              <option value="usd">USD — US Dollar</option>
              <option value="eur">EUR — Euro</option>
              <option value="gbp">GBP — British Pound</option>
            </Select>
          </FieldRow>
        </div>
      </Section>

      <Section title="Notifications" description="Control what notifications you receive.">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-sm text-[var(--foreground)]">AI Recommendations</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Get notified when new suggestions are available.
                </p>
              </div>
            </div>
            <Toggle defaultChecked />
          </div>
          <div className="border-t border-[var(--border)]/50" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-sm text-[var(--foreground)]">Email Digest</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Weekly summary of your stack activity.
                </p>
              </div>
            </div>
            <Toggle />
          </div>
          <div className="border-t border-[var(--border)]/50" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-sm text-[var(--foreground)]">Cost Alerts</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Alert when estimated costs exceed your budget.
                </p>
              </div>
            </div>
            <Toggle defaultChecked />
          </div>
        </div>
      </Section>
    </div>
  );
}

// ── Page: Settings ──────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Manage your account, preferences, and integrations.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-[var(--border)]">
        <nav className="-mb-px flex gap-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 pt-1 pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-[var(--primary)] text-[var(--foreground)]'
                    : 'border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'account' && <AccountTab />}
      {activeTab === 'preferences' && <PreferencesTab />}
    </div>
  );
}
