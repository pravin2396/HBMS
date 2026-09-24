import React from 'react';
import {
  Users,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Globe,
  Hotel
} from 'lucide-react';
import { useGuests } from '../context/useGuests';
import GuestTable from '../components/guests/GuestTable';
import GuestCard from '../components/guests/GuestCard';
import GuestFilterBar from '../components/guests/GuestFilterBar';
import GuestPagination from '../components/guests/GuestPagination';
import GuestTableSkeleton from '../components/guests/GuestSkeleton';
import GuestModal from '../components/guests/GuestModal';
import GuestDeleteModal from '../components/guests/GuestDeleteModal';

const Guests = () => {
  const {
    paginatedGuests,
    filteredGuests,
    isLoading,
    error,
    stats,
    loadGuests,
    openAddModal,
    viewMode,
    resetFilters
  } = useGuests();

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Paradise Hospitality Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100 tracking-tight">
            Guest Directory & Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage registered patrons, contact information, identity verification, and VIP hospitality preferences.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => loadGuests()}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-md disabled:opacity-50 cursor-pointer"
            title="Refresh Guests Directory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Add New Guest Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Guest</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Guests */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Patrons</span>
            <span className="text-xl font-bold text-slate-100">{stats.total}</span>
          </div>
        </div>

        {/* In-House Guests */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Hotel className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">In-House</span>
            <span className="text-xl font-bold text-emerald-400">{stats.inHouse}</span>
          </div>
        </div>

        {/* International Guests */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Globe className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">International</span>
            <span className="text-xl font-bold text-cyan-400">{stats.international}</span>
          </div>
        </div>

        {/* VIP Members */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">VIP Tiers</span>
            <span className="text-xl font-bold text-purple-400">{stats.vipCount}</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <GuestFilterBar />

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-rose-300 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadGuests()}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Guests Directory Content */}
      {isLoading ? (
        <GuestTableSkeleton />
      ) : filteredGuests.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Users className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-100">No guests found</h3>
            <p className="text-xs text-slate-400">
              No registered patrons match your active search and filter parameters.
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
              + Register New Guest
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <GuestTable guests={paginatedGuests} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredGuests.length > 0 && <GuestPagination />}

      {/* Modals */}
      <GuestModal />
      <GuestDeleteModal />

    </div>
  );
};

export default Guests;
