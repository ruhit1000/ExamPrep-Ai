'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_PUBLIC = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const NAV_PRIVATE = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Explore', href: '/explore' },
  { label: 'Add Module', href: '/items/add' },
  { label: 'My Modules', href: '/items/manage' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = isAuthenticated ? NAV_PRIVATE : NAV_PUBLIC;

  const handleSignOut = async () => {
    await logout();
    setMobileOpen(false);
  };

  const isActive = (href) => pathname === href;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #10B981)' }}>
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg text-slate-900">
              Exam<span className="text-indigo-500">Prep</span>
              <span className="text-emerald-500"> AI</span>
            </span>
          </Link>

          {/* ── Desktop Nav ─────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.href)
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Auth Buttons (Desktop) ───────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 rounded-lg skeleton" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-indigo-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:border-red-300 hover:text-red-600 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #4f46e5)' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ───────────────────────── */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.href)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex gap-3 px-4">
              {isAuthenticated ? (
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="w-full py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-center text-sm font-medium border border-slate-200 rounded-xl text-slate-600">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-center text-sm font-semibold text-white rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #4f46e5)' }}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
