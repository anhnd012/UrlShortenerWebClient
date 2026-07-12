import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Link2, Menu, X } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Marketing Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-text-primary">
              LinkFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              Features
            </a>
            <NavLink
              to="/login"
              className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              Log in
            </NavLink>
            <NavLink
              to="/login" // pointing to login placeholder for signup in MVP
              className="inline-flex items-center justify-center rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
            >
              Sign up
            </NavLink>
          </nav>

          {/* Mobile Menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded p-2 text-text-secondary hover:bg-surface-muted md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="border-t border-border bg-surface px-4 py-4 space-y-3 md:hidden animate-slide-in">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-button px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            >
              Features
            </a>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-button px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            >
              Log in
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center rounded-button bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm"
            >
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-[1280px] px-4 text-center text-xs text-text-secondary sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} LinkFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default PublicLayout;
