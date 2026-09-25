import React from 'react';
import {
  History,
  CalendarCheck,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useBookingHistory } from '../context/useBookingHistory';

import BookingHistoryStats from '../components/bookingHistory/BookingHistoryStats';
import BookingHistoryFilterBar from '../components/bookingHistory/BookingHistoryFilterBar';
import BookingHistoryTable from '../components/bookingHistory/BookingHistoryTable';
import BookingDetailsModal from '../components/bookingHistory/BookingDetailsModal';
import CancelBookingHistoryModal from '../components/bookingHistory/CancelBookingHistoryModal';
import CompleteBookingModal from '../components/bookingHistory/CompleteBookingModal';

const BookingHistory = () => {
  const { refreshHistory, isLoading } = useBookingHistory();

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 lg:p-6 space-y-6">
      
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 shrink-0">
              <History className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Booking History & Reservation Archive
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Comprehensive historical registry of guest reservations, stay duration audits, cancellation records, and completed checkout folios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refreshHistory}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync History'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Statistics Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Historical Performance & Retention
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time audit aggregation
          </span>
        </div>

        <BookingHistoryStats />
      </section>

      {/* 2. Filter & Search Bar */}
      <section>
        <BookingHistoryFilterBar />
      </section>

      {/* 3. History Table */}
      <section>
        <BookingHistoryTable />
      </section>

      {/* Modals */}
      <BookingDetailsModal />
      <CancelBookingHistoryModal />
      <CompleteBookingModal />

    </div>
  );
};

export default BookingHistory;
