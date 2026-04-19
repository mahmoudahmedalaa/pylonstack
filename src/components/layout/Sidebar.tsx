'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Search,
  FolderKanban,
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
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
        'fixed top-0 left-0 z-40 flex h-screen flex-col border-r border-white/5 bg-[#050505] shadow-sm transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4">
        {/* P Monogram Logo */}
        <Logo className="h-8 w-8 shrink-0 text-white" />

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
                <span className="text-xl font-bold tracking-tighter text-white">Pylon</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav
        className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-6"
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
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold tracking-wide transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-500 hover:bg-white/5 hover:text-white',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                    isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white',
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
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Section & Collapse Toggle */}
      <div className="mt-auto border-t border-white/5">
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
                className="shadow-sm ring-2 ring-white/10"
              />
              <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#050505] bg-emerald-500" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] leading-tight font-bold text-white">
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-neutral-500">{user.email}</p>
              </div>
            )}

            {!collapsed && (
              <button
                onClick={signOut}
                className="shrink-0 rounded-lg p-2 text-neutral-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="px-3 pb-4">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-xl py-2 text-neutral-500 transition-all hover:bg-white/5 hover:text-white"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-xs font-bold tracking-widest uppercase opacity-50">
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
