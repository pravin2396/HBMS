import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useSidebar } from '../../context/useSidebar';
import { useAnalytics } from '../../context/useAnalytics';
import {
  LayoutDashboard,
  CalendarPlus,
  LogOut,
  Hotel,
  BedDouble,
  Users,
  CalendarCheck,
  ArrowLeftRight,
  CreditCard,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isMobileOpen, closeSidebar } = useSidebar();
  const { openReservationModal } = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide Sidebar completely on auth pages or if unauthenticated
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  if (!isAuthenticated || isAuthPage) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';
  const isRooms = location.pathname.startsWith('/rooms');
  const isGuests = location.pathname.startsWith('/guests');
  const isBookings = location.pathname.startsWith('/bookings');
  const isCheckInOut = location.pathname.startsWith('/check-in-out');
  const isPayments = location.pathname.startsWith('/payments');

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-100 transition-all duration-300 shadow-2xl lg:static lg:z-auto shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Hotel className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div className="truncate">
              <span className="font-serif-luxury text-xl font-bold tracking-wider text-amber-400 block leading-tight">
                Paradise
              </span>
              <span className="text-[10px] tracking-[0.25em] text-slate-400 font-semibold uppercase block">
                Hotel & Resort
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          
          {/* Main Menu Section */}
          <div className="space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>

            {/* Dashboard Button */}
            <Link
              to="/dashboard"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isDashboard
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${isDashboard ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Dashboard</span>
            </Link>

            {/* Rooms & Suites Button */}
            <Link
              to="/rooms"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isRooms
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BedDouble className={`w-4 h-4 shrink-0 ${isRooms ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Rooms & Suites</span>
            </Link>

            {/* Guest Management Button */}
            <Link
              to="/guests"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isGuests
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Users className={`w-4 h-4 shrink-0 ${isGuests ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Guest Directory</span>
            </Link>

            {/* Room Booking Button (Module 5) */}
            <Link
              to="/bookings"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isBookings
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <CalendarCheck className={`w-4 h-4 shrink-0 ${isBookings ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Room Bookings</span>
            </Link>

            {/* Check-In / Out Button (Module 6) */}
            <Link
              to="/check-in-out"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isCheckInOut
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ArrowLeftRight className={`w-4 h-4 shrink-0 ${isCheckInOut ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Check-In / Out</span>
            </Link>

            {/* Payments Button (Module 7) */}
            <Link
              to="/payments"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isPayments
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <CreditCard className={`w-4 h-4 shrink-0 ${isPayments ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Payments & Invoices</span>
            </Link>
          </div>

          {/* Quick Action Section */}
          <div className="space-y-2 pt-2">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Action
            </div>

            <button
              type="button"
              onClick={() => {
                closeSidebar();
                openReservationModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 stroke-[2.2]" />
              <span>New Reservation</span>
            </button>
          </div>

        </div>

        {/* Sign Out Footer Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-white hover:bg-red-500/20 active:scale-[0.99] font-semibold text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2.2]" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
