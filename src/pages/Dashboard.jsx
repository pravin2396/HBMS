import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';
import { useAnalytics } from '../context/useAnalytics';
import { useRooms } from '../context/useRooms';
import { useGuests } from '../context/useGuests';

import MetricCard from '../components/dashboard/MetricCard';
import RevenueSummary from '../components/dashboard/RevenueSummary';
import RecentBookingsTable from '../components/dashboard/RecentBookingsTable';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import NewReservationModal from '../components/dashboard/NewReservationModal';

import {
  Bed,
  DoorOpen,
  BedDouble,
  Users,
  LogIn,
  LogOut,
  BookOpenCheck,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Hotel
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    analytics,
    bookings,
    isLoading,
    isReservationModalOpen,
    openReservationModal,
    closeReservationModal,
    createReservation,
    checkInGuest,
    refreshAnalytics
  } = useAnalytics();
  const { rooms } = useRooms();
  const { guests } = useGuests();

  // On mount, silently sync latest bookings and analytics in the background
  useEffect(() => {
    refreshAnalytics({ silent: true });
  }, []);

  // Helper for quick express check-in button on the first pending reservation
  const handleQuickCheckInFirstPending = () => {
    const pendingBooking = bookings?.find(
      (b) => b.status === 'Today Check-In' || b.status === 'Confirmed'
    );
    if (pendingBooking) {
      checkInGuest(pendingBooking.id);
    } else {
      toast.info('All scheduled guests for today have already checked in!');
    }
  };

  // Derive real-time room metrics directly from rooms inventory so changes in Module 3 reflect immediately
  const totalRooms = rooms && rooms.length > 0 ? rooms.length : (analytics?.totalRooms ?? 120);
  const availableRooms = rooms && rooms.length > 0
    ? rooms.filter((r) => r.status === 'Available').length
    : (analytics?.availableRooms ?? 34);
  const occupiedRooms = rooms && rooms.length > 0
    ? rooms.filter((r) => r.status === 'Occupied').length
    : (analytics?.occupiedRooms ?? 86);

  // Derive real-time guest metrics directly from guests inventory so changes in Module 4 reflect immediately
  const initialGuestsCount = 12;
  const baseTotalGuests = 214;
  const totalGuests = guests && guests.length > 0
    ? Math.max(0, baseTotalGuests + (guests.length - initialGuestsCount))
    : (analytics?.totalGuests ?? 214);

  const todayCheckIns = analytics?.todayCheckIns ?? 18;
  const todayCheckOuts = analytics?.todayCheckOuts ?? 12;

  // Derive real-time bookings count so additions/removals reflect immediately
  const initialBookingsCount = 6;
  const baseTotalBookings = 438;
  const liveBookingsCount = bookings && bookings.length > 0 ? bookings.length : initialBookingsCount;
  const totalBookings = Math.max(0, baseTotalBookings + (liveBookingsCount - initialBookingsCount));

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 lg:p-6">
      <div className="w-full space-y-5">
        
        {/* Welcome & Overview Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Paradise'}`}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-500/60 shadow-lg shadow-amber-500/10"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {user?.role || 'Hotel Owner'}
                  </span>
                  <span className="text-xs text-slate-400">Live Hotel Analytics Monitor</span>
                </div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Welcome to Paradise, {user?.name}!
                </h1>
              </div>
            </div>

            {/* Quick Actions & Live Refresh in Header */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={refreshAnalytics}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Syncing...' : 'Sync Live Data'}</span>
              </button>

              <Link
                to="/profile"
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                Profile
              </Link>
            </div>
          </div>
        </div>

        {/* 7 Required Metrics Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hotel className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Key Performance Indicators (Real-Time Metrics)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              Updated live with every reservation & check-in
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* 1. Total Rooms */}
            <MetricCard
              title="Total Rooms"
              value={totalRooms}
              subtext="Total resort suite inventory"
              icon={Bed}
              trend="100% capacity"
              trendPositive={true}
              accent="from-slate-700 to-slate-800"
            />

            {/* 2. Available Rooms */}
            <MetricCard
              title="Available Rooms"
              value={availableRooms}
              subtext="Ready for immediate check-in"
              icon={DoorOpen}
              trend={`${Math.round((availableRooms / totalRooms) * 100)}% available`}
              trendPositive={availableRooms > 10}
              accent="from-emerald-500 to-teal-600"
            />

            {/* 3. Occupied Rooms */}
            <MetricCard
              title="Occupied Rooms"
              value={occupiedRooms}
              subtext="Suites currently in stay"
              icon={BedDouble}
              trend={`${occupancyRate}% occupancy`}
              trendPositive={true}
              accent="from-amber-500 to-amber-600"
            />

            {/* 4. Total Guests */}
            <MetricCard
              title="Total Guests"
              value={totalGuests}
              subtext="In-house luxury patrons"
              icon={Users}
              trend="+18 today"
              trendPositive={true}
              accent="from-blue-500 to-indigo-600"
            />

            {/* 5. Today's Check-Ins */}
            <MetricCard
              title="Today's Check-Ins"
              value={todayCheckIns}
              subtext="Expected arrivals today"
              icon={LogIn}
              trend="6 pending keys"
              trendPositive={true}
              accent="from-cyan-500 to-teal-600"
            />

            {/* 6. Today's Check-Outs */}
            <MetricCard
              title="Today's Check-Outs"
              value={todayCheckOuts}
              subtext="Scheduled departures"
              icon={LogOut}
              trend="8 completed"
              trendPositive={true}
              accent="from-purple-500 to-pink-600"
            />

            {/* 7. Total Bookings */}
            <MetricCard
              title="Total Bookings"
              value={totalBookings}
              subtext="Cumulative guest reservations"
              icon={BookOpenCheck}
              trend="+12.4% vs last month"
              trendPositive={true}
              accent="from-amber-500 to-rose-600"
            />

            {/* Bonus Operational Metric: Real-Time Occupancy Rate */}
            <MetricCard
              title="Occupancy Rate"
              value={`${occupancyRate}%`}
              subtext="Optimal luxury resort target"
              icon={Sparkles}
              trend="+5.2% target pacing"
              trendPositive={true}
              accent="from-yellow-500 to-amber-600"
            />

          </div>
        </div>

        {/* Quick Action Cards Component */}
        <QuickActionCards
          onOpenNewReservation={openReservationModal}
          onQuickCheckInFirstPending={handleQuickCheckInFirstPending}
          role={user?.role}
        />

        {/* Revenue Summary (Dummy Data) Component */}
        <RevenueSummary revenueData={analytics?.revenue || analytics?.revenueSummary} />

        {/* Recent Bookings Component */}
        <RecentBookingsTable
          bookings={bookings}
          onCheckInGuest={checkInGuest}
        />
      </div>

      {/* New Reservation Modal */}
      <NewReservationModal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
        onSubmitReservation={createReservation}
      />
    </div>
  );
};

export default Dashboard;
