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
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from 'lucide-react';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Catalog', href: '/catalog', icon: Search },
  { label: 'My Projects', href: '/project', icon: FolderKanban },
  { label: 'Create', href: '/create', icon: PlusCircle },
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
        'fixed top-0 left-0 z-40 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--card)] shadow-sm transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-4">
        <div className="group relative shrink-0">
          <div className="from-primary-600 absolute -inset-1 rounded-lg bg-gradient-to-r to-indigo-600 opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
          <div className="bg-primary-500 relative flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-lg">
            <Zap className="h-5 w-5 fill-current" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <Link href="/dashboard">
                <AnimatedGradientText className="text-xl font-bold tracking-tighter">
                  Pylon
                </AnimatedGradientText>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav
        className="scrollbar-hide flex-1 space-y-1.5 overflow-y-auto px-3 py-6"
        aria-label="Main navigation"
      >
        {navItems.map(({ label, href, icon: Icon }, index) => {
          const isActive = pathname.startsWith(href);
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Link
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary-500/20 text-primary-600'
                      : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                </div>

                <span
                  className={cn(
                    'whitespace-nowrap transition-all duration-300',
                    collapsed ? 'pointer-events-none w-0 opacity-0' : 'flex-1 opacity-100',
                  )}
                >
                  {label}
                </span>

                {isActive && !collapsed && (
                  <motion.div
                    layoutId="active-nav"
                    className="bg-primary-500 absolute right-2 h-1.5 w-1.5 rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Section & Collapse Toggle */}
      <div className="mt-auto border-t border-[var(--border)] bg-gradient-to-t from-[var(--muted)]/30 to-transparent">
        {/* User Info */}
        {user && (
          <div
            className={cn('flex items-center gap-3 px-4 py-4', collapsed ? 'justify-center' : '')}
          >
            <div className="relative">
              <Avatar
                alt={displayName}
                fallback={initials}
                size="sm"
                src={user.user_metadata?.avatar_url}
                className="shadow-sm ring-2 ring-white"
              />
              <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] leading-tight font-semibold text-[var(--foreground)]">
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-[var(--muted-foreground)]">{user.email}</p>
              </div>
            )}

            {!collapsed && (
              <button
                onClick={signOut}
                className="shrink-0 rounded-lg p-2 text-[var(--muted-foreground)] transition-all hover:bg-red-500/10 hover:text-red-500"
                title="Sign out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="px-3 pb-4">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-xl py-2 text-[var(--muted-foreground)] transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)] hover:shadow-sm"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-xs font-semibold tracking-wider uppercase opacity-60">
                  Collapse
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
