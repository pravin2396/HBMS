import React from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw,
  Globe
} from 'lucide-react';
import { useGuests } from '../../context/useGuests';
import { NATIONALITY_OPTIONS, VIP_TIERS } from '../../utils/guestStorage';

const GuestFilterBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    nationalityFilter,
    setNationalityFilter,
    vipFilter,
    setVipFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    resetFilters,
    filteredGuests,
    guests
  } = useGuests();

  const isFiltered = searchQuery || nationalityFilter !== 'All' || vipFilter !== 'All' || sortBy !== 'default';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      {/* Top Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search input (5 cols) */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, ID proof, address..."
            className="w-full pl-10 pr-9 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nationality Filter (3 cols) */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <select
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="All">All Nationalities</option>
            {NATIONALITY_OPTIONS.map((nat) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>

        {/* VIP Status Filter (2 cols) */}
        <div className="md:col-span-2 relative">
          <select
            value={vipFilter}
            onChange={(e) => setVipFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="All">All Tiers</option>
            {VIP_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>

        {/* Sort Options (2 cols) */}
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="default">Sort: Default</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="stays-desc">Most Stays</option>
            <option value="newest">Newest First</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>

      </div>

      {/* Sub-row: Results indicator, active filters, reset button, and view mode toggle */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2">
          <span className="text-slate-400">
            Showing <strong className="text-amber-400 font-semibold">{filteredGuests.length}</strong> of{' '}
            <strong className="text-slate-200">{guests.length}</strong> guests
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle: Table or Grid */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuestFilterBar;
