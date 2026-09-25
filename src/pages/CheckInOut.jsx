import React from 'react';
import {
  ArrowLeftRight,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Calendar,
  History,
  CheckCircle2,
  BedDouble,
  Users
} from 'lucide-react';
import { useCheckInOut } from '../context/useCheckInOut';
import CheckInOutStats from '../components/checkinout/CheckInOutStats';
import CheckInHistoryTable from '../components/checkinout/CheckInHistoryTable';
import CheckOutHistoryTable from '../components/checkinout/CheckOutHistoryTable';
import RoomAvailabilityTracker from '../components/checkinout/RoomAvailabilityTracker';
import CheckInModal from '../components/checkinout/CheckInModal';
import CheckOutModal from '../components/checkinout/CheckOutModal';

const CheckInOut = () => {
  const {
    rooms,
    availableRooms,
    pendingArrivals,
    filteredPendingArrivals,
    activeInHouseGuests,
    filteredActiveInHouseGuests,
    filteredCheckInHistory,
    filteredCheckOutHistory,
    stats,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,

    // Actions
    handleCheckIn,
    handleNewWalkInCheckIn,
    handleCheckOut,
    syncLocalState,
    seedScheduledArrivals,

    // Modals
    isCheckInModalOpen,
    bookingForCheckIn,
    openCheckInModal,
    closeCheckInModal,

    isCheckOutModalOpen,
    bookingForCheckOut,
    openCheckOutModal,
    closeCheckOutModal
  } = useCheckInOut();

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 lg:p-6 space-y-6">
      
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0">
              <ArrowLeftRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Check-In & Check-Out Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Process guest check-in & check-out, synchronize room availability, update booking statuses, and view history
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={syncLocalState}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              title="Sync live room and booking status"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Sync Status'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <CheckInOutStats stats={stats} />

      {/* Operations Tabs & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            {/* Tab: Update Room Availability Tracker */}
            <button
              type="button"
              onClick={() => setActiveTab('room-availability')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'room-availability'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Room Availability</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'room-availability' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                {stats.availableRoomsCount} Avail
              </span>
            </button>

            {/* Tab 4: Check-In History */}
            <button
              type="button"
              onClick={() => setActiveTab('checkin-history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'checkin-history'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Check-In History</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'checkin-history' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                {filteredCheckInHistory.length}
              </span>
            </button>

            {/* Tab 5: Check-Out History */}
            <button
              type="button"
              onClick={() => setActiveTab('checkout-history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'checkout-history'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check-Out History</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'checkout-history' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                {filteredCheckOutHistory.length}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Tab Content: ROOM AVAILABILITY TRACKER */}
      {activeTab === 'room-availability' && (
        <div className="space-y-6 animate-fadeIn">
          <RoomAvailabilityTracker
            rooms={rooms}
            activeInHouseGuests={activeInHouseGuests}
            pendingArrivals={pendingArrivals}
            onOpenCheckIn={openCheckInModal}
            onOpenCheckOut={openCheckOutModal}
          />
        </div>
      )}

      {/* Tab Content 4: CHECK-IN HISTORY */}
      {activeTab === 'checkin-history' && (
        <div className="animate-fadeIn">
          <CheckInHistoryTable history={filteredCheckInHistory} />
        </div>
      )}

      {/* Tab Content 5: CHECK-OUT HISTORY */}
      {activeTab === 'checkout-history' && (
        <div className="animate-fadeIn">
          <CheckOutHistoryTable history={filteredCheckOutHistory} />
        </div>
      )}

      {/* Modals */}
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={closeCheckInModal}
        booking={bookingForCheckIn}
        pendingArrivals={pendingArrivals}
        availableRooms={availableRooms}
        rooms={rooms}
        onConfirmCheckIn={handleCheckIn}
        onNewWalkInCheckIn={handleNewWalkInCheckIn}
        onSeedScheduledArrivals={seedScheduledArrivals}
        isLoading={isLoading}
      />

      <CheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={closeCheckOutModal}
        booking={bookingForCheckOut}
        inHouseGuests={activeInHouseGuests}
        onConfirmCheckOut={handleCheckOut}
        isLoading={isLoading}
      />

    </div>
  );
};

export default CheckInOut;
