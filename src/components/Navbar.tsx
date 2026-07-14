"use client";

import { useState } from "react";
import type { UserData } from "./UserAuthModal";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: UserData | null;
  onUserClick: () => void;
  onLogout: () => void;
  siteSettings?: Record<string, string>;
}

export default function Navbar({ 
  cartCount, 
  onCartClick, 
  onAdminClick, 
  searchQuery, 
  onSearchChange,
  user,
  onUserClick,
  onLogout,
  siteSettings,
}: NavbarProps) {
  const logoUrl = siteSettings?.siteLogoUrl || "/images/logo.svg";
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt={siteSettings?.siteName || "Apex Athletics"} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/logo.svg"; }} />
            <div>
              <h1 className="text-lg font-bold gradient-text">{siteSettings?.siteName || "Apex Athletics"}</h1>
              <p className="text-[10px] text-gray-400">{siteSettings?.siteDescription || "Digital Solutions"}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-2 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User Account */}
            <div className="relative">
              <button
                onClick={() => user ? setShowUserMenu(!showUserMenu) : onUserClick()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-surface hover:bg-primary/20 transition-colors"
              >
                {user ? (
                  <>
                    <div className="w-7 h-7 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-green-400">${user.walletBalance.toFixed(2)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden sm:inline text-sm text-gray-300">دخول</span>
                  </>
                )}
              </button>

              {/* User Dropdown */}
              {showUserMenu && user && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-dark-card rounded-xl shadow-2xl border border-primary/20 overflow-hidden">
                  <button
                    onClick={() => { setShowUserMenu(false); onUserClick(); }}
                    className="w-full px-4 py-3 text-right text-sm text-white hover:bg-primary/10 flex items-center gap-2"
                  >
                    <span>👛</span> المحفظة
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); onLogout(); }}
                    className="w-full px-4 py-3 text-right text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <span>🚪</span> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-xl bg-dark-surface hover:bg-primary/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin button removed from navbar - now in footer */}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="sm:hidden p-2 rounded-xl bg-dark-surface"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="sm:hidden pb-4 space-y-3">
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
            {/* Admin removed from mobile menu too */}
          </div>
        )}
      </div>
    </nav>
  );
}
