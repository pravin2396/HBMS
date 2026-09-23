import React, { useState } from 'react';
import { Search, Calendar, UserCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const RecentBookingsTable = ({ bookings, onCheckInGuest }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filterList = ['All', 'Checked-In', 'Today Check-In', 'Confirmed', 'Pending'];
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = (bookings || []).filter((booking) => {
    const matchesSearch =
      booking.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.suiteType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomNumber?.includes(searchQuery);

    let matchesStatus = true;
    if (statusFilter === 'All') {
      matchesStatus = true;
    } else if (statusFilter === 'Today Check-In') {
      // Matches if marked 'Today Check-In' OR if the reservation's checkIn date is today
      matchesStatus =
        booking.status === 'Today Check-In' ||
        booking.checkIn === todayStr ||
        Boolean(booking.checkIn && booking.checkIn.startsWith(todayStr));
    } else if (statusFilter === 'Confirmed') {
      // Confirmed reservations include active confirmed bookings, today check-ins, and checked-in guests with paid confirmation
      matchesStatus =
        booking.status === 'Confirmed' ||
        booking.status === 'Checked-In' ||
        booking.status === 'Today Check-In' ||
        (booking.paymentStatus && booking.paymentStatus !== 'Pending');
    } else if (statusFilter === 'Checked-In') {
      matchesStatus = booking.status === 'Checked-In';
    } else if (statusFilter === 'Pending') {
      matchesStatus = booking.status === 'Pending' || booking.paymentStatus === 'Pending';
    } else {
      matchesStatus = booking.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return {
          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2
        };
      case 'Today Check-In':
        return {
          color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: Clock
        };
      case 'Confirmed':
        return {
          color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: CheckCircle2
        };
      case 'Pending':
        return {
          color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: AlertCircle
        };
      default:
        return {
          color: 'bg-slate-700/50 text-slate-300 border-slate-600',
          icon: Clock
        };
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recent Bookings & Guest Roster
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            View, search, and manage incoming guest reservations and suite check-ins
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest, ID, suite..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto">
            {filterList.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="pb-3 pl-3">Booking ID</th>
              <th className="pb-3">Guest Information</th>
              <th className="pb-3">Suite & Room</th>
              <th className="pb-3">Stay Dates</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Amount</th>
              <th className="pb-3 text-center pr-3">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => {
                const badge = getStatusBadge(b.status);
                const BadgeIcon = badge.icon;
                const canCheckIn = b.status === 'Today Check-In' || b.status === 'Confirmed';

                return (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors group">
                    
                    {/* Booking ID */}
                    <td className="py-4 pl-3 font-mono text-xs text-amber-400 font-semibold whitespace-nowrap">
                      {b.id}
                    </td>

                    {/* Guest Name & Avatar */}
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${b.guestName}`}
                          alt={b.guestName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-amber-500/50 transition-all"
                        />
                        <div>
                          <div className="font-semibold text-slate-200">{b.guestName}</div>
                          <div className="text-[11px] text-slate-400">{b.guestEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Suite & Room */}
                    <td className="py-4 whitespace-nowrap">
                      <div className="text-slate-200 font-medium">{b.suiteType}</div>
                      <div className="text-[11px] text-amber-400 font-mono">Room #{b.roomNumber}</div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 whitespace-nowrap">
                      <div className="text-slate-300 font-medium">
                        {b.checkIn} → {b.checkOut}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {b.stayDuration} • {b.guestsCount} {b.guestsCount === 1 ? 'Guest' : 'Guests'}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                        {b.status}
                      </span>
                    </td>

                    {/* Total Amount & Payment */}
                    <td className="py-4 text-right whitespace-nowrap">
                      <div className="font-semibold text-white font-mono text-sm">
                        ${b.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        {b.paymentStatus || 'Paid'}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 text-center pr-3 whitespace-nowrap">
                      {canCheckIn ? (
                        <button
                          type="button"
                          onClick={() => onCheckInGuest(b.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 transition-all cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Check In
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">
                          Checked-In
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                  No reservations found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>Showing {filteredBookings.length} of {bookings?.length || 0} reservations</span>
        <span className="text-amber-400">Real-time local database sync</span>
      </div>

    </div>
  );
};

export default RecentBookingsTable;
