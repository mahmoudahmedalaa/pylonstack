'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Search, FolderKanban, PlusCircle, Settings, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Catalog', href: '/catalog', icon: Search },
  { label: 'My Projects', href: '/project', icon: FolderKanban },
  { label: 'Create', href: '/create', icon: PlusCircle },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen w-[280px] flex-col bg-[var(--card)] shadow-xl transition-transform duration-200 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
          <div className="flex items-center gap-3">
            <Logo className="text-primary-500 h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              Pylon
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-primary-400' : 'text-[var(--muted-foreground)]',
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
