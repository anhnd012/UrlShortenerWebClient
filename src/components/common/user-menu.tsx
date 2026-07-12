import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/cn';

interface CurrentUser {
  displayName: string;
  email: string;
  avatarUrl?: string;
}

const developmentUser: CurrentUser = {
  displayName: 'SaaS User',
  email: 'user@example.com',
};

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  const user = developmentUser;

  // Derive initials (e.g. "SaaS User" -> "SU")
  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape, handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        // Focus first item or next item
        const activeIndex = menuItemsRef.current.indexOf(document.activeElement as any);
        const nextIndex = (activeIndex + 1) % menuItemsRef.current.length;
        menuItemsRef.current[nextIndex]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        const activeIndex = menuItemsRef.current.indexOf(document.activeElement as any);
        const prevIndex = activeIndex <= 0 ? menuItemsRef.current.length - 1 : activeIndex - 1;
        menuItemsRef.current[prevIndex]?.focus();
      }
    }
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      {/* Account trigger */}
      <button
        ref={triggerRef}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className="flex items-center gap-2 rounded-button p-1 hover:bg-surface-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="h-8 w-8 rounded-full bg-primary-soft flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
          {initials}
        </div>
        <span className="hidden text-sm font-medium text-text-secondary md:block">
          {user.displayName}
        </span>
        <ChevronDown className={cn('hidden h-4 w-4 text-text-secondary transition-transform md:block', isOpen && 'rotate-180')} />
      </button>

      {/* Account dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="menu"
          className="absolute right-0 mt-2 w-72 rounded-card border border-border bg-surface p-2 shadow-lg animate-slide-in z-50 focus:outline-none"
        >
          {/* User Account summary */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center text-primary font-semibold text-sm border border-primary/20">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-text-primary truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-text-secondary truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>

          <div className="my-1 border-t border-border" />

          {/* Profile */}
          <button
            ref={(el) => { menuItemsRef.current[0] = el; }}
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-left text-xs font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors focus:outline-none focus:bg-surface-muted"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4" />
            Profile (coming soon)
          </button>

          {/* Settings */}
          <button
            ref={(el) => { menuItemsRef.current[1] = el; }}
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-left text-xs font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors focus:outline-none focus:bg-surface-muted"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings (coming soon)
          </button>

          <div className="my-1 border-t border-border" />

          {/* Logout */}
          <div className="px-3 py-2">
            <button
              ref={(el) => { menuItemsRef.current[2] = el as any; }}
              role="menuitem"
              disabled
              className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-left text-xs font-semibold text-text-muted cursor-not-allowed opacity-50 focus:outline-none"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
            <p className="mt-1 px-3 text-[10px] font-medium text-text-muted italic">
              Authentication is not available yet
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
