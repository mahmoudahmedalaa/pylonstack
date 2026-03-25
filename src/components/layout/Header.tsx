'use client';

import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from '@/components/ui';
import { Bell, Menu, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

export function Header({ onMenuToggle, pageTitle }: HeaderProps) {
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] lg:hidden"
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      {pageTitle && (
        <h1 className="hidden text-lg font-semibold text-[var(--foreground)] sm:block">
          {pageTitle}
        </h1>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="bg-primary-500 absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User avatar + dropdown */}
        {!loading && user ? (
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:ring-primary-500/30 rounded-full transition-shadow hover:ring-2"
            >
              <Avatar
                alt={displayName}
                fallback={initials}
                size="sm"
                src={user.user_metadata?.avatar_url}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/10">
                {/* User info */}
                <div className="border-b border-[var(--border)] px-4 py-3">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>

                {/* Sign out */}
                <div className="border-t border-[var(--border)] py-1.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !loading ? (
          <Link
            href="/login"
            className="bg-primary-500 hover:bg-primary-600 ml-1 rounded-lg px-3.5 py-1.5 text-sm font-medium text-white transition-colors"
          >
            Log in
          </Link>
        ) : (
          <div className="ml-1 h-8 w-8 animate-pulse rounded-full bg-[var(--muted)]" />
        )}
      </div>
    </header>
  );
}
