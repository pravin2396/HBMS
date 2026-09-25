import React, { useState } from 'react';
import {
  CalendarCheck,
  Eye,
  CheckCircle2,
  Ban,
  Clock,
  UserCheck,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useBookingHistory } from '../../context/useBookingHistory';

const getStatusBadge = (statusStr = '') => {
  const s = statusStr.toLowerCase();

  if (s === 'completed' || s === 'checked-out') {
    return {
      label: 'Completed',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      icon: CheckCircle2
    };
  }
  if (s === 'checked-in') {
    return {
      label: 'Checked-In',
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400',
      icon: UserCheck
    };
  }
  if (s === 'cancelled') {
    return {
      label: 'Cancelled',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400',
      icon: Ban
    };
  }
  return {
    label: 'Confirmed',
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
    icon: Clock
  };
};

const BookingHistoryTable = () => {
  const {
    filteredHistory,
    openBookingDetails,
    openCancelModal,
    openCompleteModal,
    resetFilters
  } = useBookingHistory();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;

  const paginatedList = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Table Header / Title */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-base font-bold text-white tracking-wide">
              Reservation Audit & Booking History
            </h3>
            <p className="text-[11px] text-slate-400">
              Chronological log of past, active, completed and cancelled reservations
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">
          Showing {paginatedList.length} of {filteredHistory.length}
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Guest Details</th>
              <th className="py-3 px-4">Suite / Room</th>
              <th className="py-3 px-4">Stay Schedule</th>
              <th className="py-3 px-4 text-right">Tariff / Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Booking Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedList.length > 0 ? (
              paginatedList.map((b) => {
                const statusInfo = getStatusBadge(b.status);
                const StatusIcon = statusInfo.icon;
                const isCheckedIn = (b.status || '').toLowerCase() === 'checked-in';
                const isCancelled = (b.status || '').toLowerCase() === 'cancelled';
                const isCompleted =
                  (b.status || '').toLowerCase() === 'completed' ||
                  (b.status || '').toLowerCase() === 'checked-out';

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openBookingDetails(b)}
                        className="font-mono text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline block text-left cursor-pointer"
                      >
                        {b.id}
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Direct Folio'}
                      </span>
                    </td>

                    {/* Guest Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            b.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${b.guestName || 'G'}`
                          }
                          alt={b.guestName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div className="truncate max-w-[140px] sm:max-w-[180px]">
                          <span className="font-medium text-white block truncate">
                            {b.guestName}
                          </span>
                          <span className="text-[10px] text-amber-400/90 font-medium block truncate">
                            {b.vipStatus || 'Standard Guest'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Room & Suite */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-200 text-xs block">
                        Suite {b.roomNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                        {b.suiteType}
                      </span>
                    </td>

                    {/* Stay Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{b.checkIn} → {b.checkOut}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block pl-5">
                        {b.stayDuration || `${b.nights || 1} Nights`}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-serif-luxury font-bold text-white text-sm block">
                        ${Number(b.amount || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {b.guestsCount || 2} Guests
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-xs text-slate-300 block font-medium">
                        {b.paymentStatus || 'Paid in Full'}
                      </span>
                    </td>

                    {/* Booking Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}
                        />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* View Booking Details */}
                        <button
                          type="button"
                          onClick={() => openBookingDetails(b)}
                          title="View Booking Details & Audit Folio"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Completed Action (for active in-house stays) */}
                        {isCheckedIn && (
                          <button
                            type="button"
                            onClick={() => openCompleteModal(b)}
                            title="Mark Stay as Completed"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/40 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Cancel Booking Action (if not already cancelled or completed) */}
                        {!isCancelled && !isCompleted && (
                          <button
                            type="button"
                            onClick={() => openCancelModal(b)}
                            title="Cancel Booking"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      No Historical Bookings Found
                    </h4>
                    <p className="text-xs text-slate-400">
                      No reservation records matched your search query or selected date range.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
          <div>
            Page <span className="text-white font-bold">{currentPage}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingHistoryTable;
