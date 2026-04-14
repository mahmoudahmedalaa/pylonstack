'use client';

import { useState, useRef, useEffect } from 'react';
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
    <header className="glass-panel sticky top-0 z-30 flex h-16 items-center gap-4 rounded-none border-x-0 border-t-0 px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      {pageTitle && (
        <h1 className="hidden text-2xl font-bold tracking-tight text-white sm:block">
          {pageTitle}
        </h1>
      )}

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {!loading && user ? (
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="rounded-full transition-shadow hover:ring-2 hover:ring-white/20"
            >
              <Avatar
                alt={displayName}
                fallback={initials}
                size="sm"
                src={user.user_metadata?.avatar_url}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl backdrop-blur-xl">
                <div className="border-b border-white/5 px-4 py-3">
                  <p className="truncate text-sm font-bold text-white">{displayName}</p>
                  <p className="truncate text-xs text-neutral-500">{user.email}</p>
                </div>
                <div className="py-1.5">
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-white/5 py-1.5">
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
            className="ml-1 rounded-lg bg-white px-3.5 py-1.5 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
          >
            Log in
          </Link>
        ) : (
          <div className="ml-1 h-8 w-8 animate-pulse rounded-full bg-white/5" />
        )}
      </div>
    </header>
  );
}
