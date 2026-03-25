'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui';
import {
  LayoutDashboard,
  Search,
  FolderKanban,
  Wand2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Catalog', href: '/catalog', icon: Search },
  { label: 'My Projects', href: '/project', icon: FolderKanban },
  { label: 'Wizard', href: '/wizard', icon: Wand2 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.display_name ??
    user?.user_metadata?.full_name ??
    user?.email?.split('@')[0] ??
    'User';

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--card)] transition-[width] duration-200 ease-out',
        collapsed ? 'w-[68px]' : 'w-[240px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-4">
        <div className="bg-primary-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white">
          <Zap className="h-5 w-5" />
        </div>
        <span
          className={cn(
            'text-lg font-semibold tracking-tight text-[var(--foreground)] transition-opacity duration-200',
            collapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
          )}
        >
          Pylon
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive
                    ? 'text-primary-400'
                    : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]',
                )}
              />
              <span
                className={cn(
                  'whitespace-nowrap transition-opacity duration-200',
                  collapsed ? 'pointer-events-none w-0 opacity-0' : 'opacity-100',
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User section + collapse toggle */}
      <div className="border-t border-[var(--border)]">
        {/* User info */}
        {user && (
          <div
            className={cn('flex items-center gap-3 px-4 py-3', collapsed ? 'justify-center' : '')}
          >
            <Avatar
              alt={displayName}
              fallback={initials}
              size="sm"
              src={user.user_metadata?.avatar_url}
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {displayName}
                </p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={signOut}
                className="shrink-0 rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Collapse toggle */}
        <div className="p-3">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
