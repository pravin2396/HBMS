import React from 'react';
import {
  Calendar,
  User,
  BedDouble,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  LogIn,
  LogOut,
  Ban,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const BookingTable = ({
  bookings,
  onViewSummary,
  onCheckIn,
  onCheckOut,
  onCancelBooking
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
          label: 'Checked-In'
        };
      case 'Today Check-In':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400 animate-pulse',
          icon: Clock,
          label: 'Today Check-In'
        };
      case 'Confirmed':
        return {
          bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
          icon: CheckCircle2,
          label: 'Confirmed'
        };
      case 'Checked-Out':
        return {
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
          dot: 'bg-slate-400',
          icon: CheckCircle2,
          label: 'Checked-Out'
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: XCircle,
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
          dot: 'bg-slate-400',
          icon: Clock,
          label: status || 'Pending'
        };
    }
  };

  const getVipBadge = (vip) => {
    if (!vip || vip === 'Standard Guest') return null;
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        {vip}
      </span>
    );
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">
          No Reservations Found
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          No bookings match the specified filters or search criteria. Try modifying your search or create a new reservation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
              <th className="py-4 px-4 sm:px-6">Booking ID</th>
              <th className="py-4 px-4 sm:px-6">Guest Details</th>
              <th className="py-4 px-4 sm:px-6">Assigned Suite</th>
              <th className="py-4 px-4 sm:px-6">Stay Schedule</th>
              <th className="py-4 px-4 sm:px-6">Nights</th>
              <th className="py-4 px-4 sm:px-6">Amount</th>
              <th className="py-4 px-4 sm:px-6">Booking Status</th>
              <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {bookings.map((booking) => {
              const statusCfg = getStatusBadge(booking.status);
              const StatusIcon = statusCfg.icon;

              return (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* 1. Booking ID */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
                      {booking.id}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">
                      {booking.paymentStatus || 'Paid'}
                    </span>
                  </td>

                  {/* 2. Guest Details */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(booking.guestName)}`}
                        alt={booking.guestName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                            {booking.guestName}
                          </span>
                          {getVipBadge(booking.vipStatus)}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {booking.guestEmail}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {booking.guestPhone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 3. Assigned Suite */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <BedDouble className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Room {booking.roomNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {booking.suiteType}
                      </p>
                    </div>
                  </td>

                  {/* 4. Stay Schedule */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="text-[10px] uppercase font-semibold text-slate-500">In:</span>
                        <span>{booking.checkIn}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="text-[10px] uppercase font-semibold text-slate-500">Out:</span>
                        <span>{booking.checkOut}</span>
                      </div>
                    </div>
                  </td>

                  {/* 5. Auto Calculated Nights */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                      🌙 {booking.nights || booking.stayDuration || '3 Nights'}
                    </span>
                  </td>

                  {/* 6. Total Amount */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div className="font-serif-luxury text-sm font-bold text-white">
                      ${Number(booking.amount).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Inc. Luxury Tax
                    </span>
                  </td>

                  {/* 7. Booking Status */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusCfg.label}</span>
                    </span>
                  </td>

                  {/* 8. Action Buttons */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* View Summary / Receipt Voucher */}
                      <button
                        type="button"
                        onClick={() => onViewSummary(booking)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        title="View Booking Summary & Receipt"
                      >
                        <Eye className="w-4 h-4 text-amber-400" />
                      </button>

                      {/* Check-In Action (if Confirmed or Today Check-In) */}
                      {(booking.status === 'Confirmed' || booking.status === 'Today Check-In') && (
                        <button
                          type="button"
                          onClick={() => onCheckIn(booking.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Check In Guest"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Check In</span>
                        </button>
                      )}

                      {/* Check-Out Action (if Checked-In) */}
                      {booking.status === 'Checked-In' && (
                        <button
                          type="button"
                          onClick={() => onCheckOut(booking.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Check Out Guest"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      )}

                      {/* Cancel Action (if not already cancelled or completed) */}
                      {booking.status !== 'Cancelled' && booking.status !== 'Checked-Out' && (
                        <button
                          type="button"
                          onClick={() => onCancelBooking(booking)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Cancel Reservation"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
