import React from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw
} from 'lucide-react';
import { useRooms } from '../../context/useRooms';
import { ROOM_TYPES, ROOM_STATUSES } from '../../utils/roomStorage';

const RoomFilterBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    resetFilters,
    filteredRooms,
    rooms
  } = useRooms();

  const isFiltered = searchQuery || typeFilter !== 'All' || statusFilter !== 'All' || sortBy !== 'default';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      {/* Top Row: Search and Quick Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search Input (spans 5 cols) */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by room #, type, floor, or amenity..."
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

        {/* Room Type Filter (spans 3 cols) */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="All">All Room Types</option>
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>

        {/* Availability Filter (spans 2 cols) */}
        <div className="md:col-span-2 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="All">All Statuses</option>
            {ROOM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>

        {/* Sort by Price & Room (spans 2 cols) */}
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
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="room-asc">Room: Ascending</option>
            <option value="room-desc">Room: Descending</option>
            <option value="capacity-desc">Capacity: Highest</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>

      </div>

      {/* Bottom Sub-row: Results indicator, Active Filters, View Mode Toggle */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Results count & Reset button */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">
            Showing <strong className="text-amber-400 font-semibold">{filteredRooms.length}</strong> of{' '}
            <strong className="text-slate-200">{rooms.length}</strong> rooms
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

        {/* View Mode Toggle: Grid or Table */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Grid Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Compact Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoomFilterBar;
