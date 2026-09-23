import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Hotel, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hide Navbar completely on all authentication screens
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Hotel Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Hotel className="w-7 h-7 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif-luxury text-2xl font-bold tracking-wider text-amber-400 block leading-tight">
                Paradise
              </span>
              <span className="text-[10px] tracking-[0.25em] text-slate-400 font-semibold uppercase block">
                Hotel & Resort
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === '/dashboard'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === '/profile'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* User Info Capsule */}
                <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-800">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/50"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {user?.name}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400">
                      <ShieldCheck className="w-3 h-3" />
                      {user?.role || 'User'}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : ['/login', '/register', '/forgot-password'].includes(location.pathname) ? null : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
