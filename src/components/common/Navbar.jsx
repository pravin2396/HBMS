import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useSidebar } from '../../context/useSidebar';
import { Hotel, Search, Bell, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  // Hide Navbar completely on all authentication screens
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white border border-slate-700 transition-colors cursor-pointer lg:hidden"
                title="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Hotel className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif-luxury text-xl font-bold tracking-wider text-amber-400 block">
                Paradise
              </span>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center relative max-w-md w-full mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search guests, suites, bookings..."
              className="w-full pl-9 pr-9 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-[10px] bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-400 font-mono font-medium">
                /
              </span>
            </div>
          </div>

          {/* Right Notification & User Capsule */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <button
                  type="button"
                  className="p-2 rounded-xl bg-slate-800/80 text-amber-400 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer relative shadow-sm"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900"></span>
                </button>

                {/* User Capsule Pill */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-950/80 shadow-md">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-500/50 shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline whitespace-nowrap">
                    {user?.name || 'Alexander Sterling'}
                  </span>
                </div>
              </>
            ) : ['/login', '/register', '/forgot-password'].includes(location.pathname) ? null : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
