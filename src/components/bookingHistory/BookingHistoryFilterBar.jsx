import React from 'react';
import {
  Search,
  X,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  Ban,
  RotateCcw
} from 'lucide-react';
import { useBookingHistory } from '../../context/useBookingHistory';

const BookingHistoryFilterBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateRangePreset,
    setDateRangePreset,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetFilters,
    filteredHistory
  } = useBookingHistory();

  const statusOptions = [
    { label: 'All Bookings', value: 'All' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Checked-In', value: 'Checked-In' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  const datePresets = [
    { label: 'All Dates', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Past 7 Days', value: 'week' },
    { label: 'Past 30 Days', value: 'month' },
    { label: 'Custom Date Range', value: 'custom' }
  ];

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'All' ||
    dateRangePreset !== 'all' ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      
      {/* Top Row: Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings by ID (BK-), guest name, room #, suite type, email, phone..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <select
              value={dateRangePreset}
              onChange={(e) => setDateRangePreset(e.target.value)}
              className="appearance-none bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              {datePresets.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
            <Calendar className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Pickers (Shown if 'custom' is selected) */}
      {dateRangePreset === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
          <span className="font-semibold text-amber-400">Date Range:</span>
          
          <div className="flex items-center gap-2">
            <label className="text-slate-400">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer ml-auto"
            >
              Clear dates
            </button>
          )}
        </div>
      )}

      {/* Bottom Row: Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Records Count */}
        <span className="text-[11px] text-slate-500 font-medium sm:ml-auto">
          {filteredHistory.length} historical bookings match
        </span>
      </div>

    </div>
  );
};

export default BookingHistoryFilterBar;
