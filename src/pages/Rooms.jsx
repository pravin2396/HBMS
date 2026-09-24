import React, { useState } from 'react';
import {
  Hotel,
  Plus,
  RefreshCw,
  AlertCircle,
  Sparkles,
  BedDouble,
  CheckCircle2,
  Clock,
  Wrench,
  DollarSign,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { useRooms } from '../context/useRooms';
import RoomCard from '../components/rooms/RoomCard';
import RoomTableView from '../components/rooms/RoomTableView';
import RoomFilterBar from '../components/rooms/RoomFilterBar';
import RoomPagination from '../components/rooms/RoomPagination';
import RoomSkeletonGrid from '../components/rooms/RoomSkeleton';
import RoomModal from '../components/rooms/RoomModal';
import RoomDeleteModal from '../components/rooms/RoomDeleteModal';
import ApiProviderModal from '../components/rooms/ApiProviderModal';

const Rooms = () => {
  const {
    paginatedRooms,
    filteredRooms,
    isLoading,
    error,
    apiSource,
    stats,
    loadRooms,
    openAddModal,
    viewMode,
    resetFilters
  } = useRooms();

  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Hotel className="w-3.5 h-3.5" />
            <span>Paradise Hotel Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100 tracking-tight">
            Room & Suite Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage accommodations, real-time rates, availability status, and third-party API synchronization.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Third-Party API Integration Badge / Trigger */}
          <button
            type="button"
            onClick={() => setIsApiModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
            title="Configure Third-Party API Provider"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>API: <strong className="text-amber-400 font-bold capitalize">{apiSource}</strong></span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => loadRooms()}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-md disabled:opacity-50 cursor-pointer"
            title="Refresh Rooms from API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Add New Room Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Rooms */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <BedDouble className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Rooms</span>
            <span className="text-xl font-bold text-slate-100">{stats.total}</span>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Available</span>
            <span className="text-xl font-bold text-emerald-400">{stats.available}</span>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Occupied</span>
            <span className="text-xl font-bold text-amber-400">{stats.occupied}</span>
          </div>
        </div>

        {/* Under Maintenance */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Wrench className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Maintenance</span>
            <span className="text-xl font-bold text-rose-400">{stats.maintenance}</span>
          </div>
        </div>

        {/* Average Rate */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
            <DollarSign className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Avg Rate</span>
            <span className="text-xl font-bold text-amber-400">${stats.avgPrice}</span>
          </div>
        </div>

      </div>

      {/* Filter, Search, Sort Bar */}
      <RoomFilterBar />

      {/* Error Banner with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-rose-300 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadRooms()}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Room List Content */}
      {isLoading ? (
        <RoomSkeletonGrid count={6} />
      ) : filteredRooms.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <BedDouble className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-100">No rooms found</h3>
            <p className="text-xs text-slate-400">
              No rooms match your active search and filter criteria. Try adjusting your parameters or clear all filters.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
            >
              + Add New Room
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        /* Compact Table View */
        <RoomTableView rooms={paginatedRooms} />
      )}

      {/* Pagination */}
      {!isLoading && filteredRooms.length > 0 && <RoomPagination />}

      {/* Modals */}
      <RoomModal />
      <RoomDeleteModal />
      <ApiProviderModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />

    </div>
  );
};

export default Rooms;
