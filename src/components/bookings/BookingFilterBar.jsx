import React from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
  SlidersHorizontal,
  CalendarCheck
} from 'lucide-react';

const STATUS_FILTERS = [
  'All',
  'Confirmed',
  'Checked-In',
  'Today Check-In',
  'Checked-Out',
  'Cancelled'
];

const BookingFilterBar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  onOpenNewBooking,
  totalResults
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Bar: Search, Status Quick Tabs, New Booking Button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bookings by guest name, booking ID, room #, suite type..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort & New Booking Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative min-w-[170px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="checkin-asc">Sort: Check-In Date</option>
              <option value="amount-desc">Sort: Amount High → Low</option>
              <option value="amount-asc">Sort: Amount Low → High</option>
              <option value="guest-asc">Sort: Guest Name (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={onResetFilters}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* New Booking Primary CTA */}
          <button
            type="button"
            onClick={onOpenNewBooking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>New Booking</span>
          </button>
        </div>

      </div>

      {/* Bottom Bar: Status Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-amber-400" />
            Status:
          </span>
          {STATUS_FILTERS.map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-amber-400">{totalResults}</span> {totalResults === 1 ? 'reservation' : 'reservations'}
        </div>
      </div>
    </div>
  );
};

export default BookingFilterBar;
