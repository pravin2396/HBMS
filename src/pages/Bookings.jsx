import React from 'react';
import {
  CalendarCheck,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { useBookings } from '../context/useBookings';
import BookingStats from '../components/bookings/BookingStats';
import BookingFilterBar from '../components/bookings/BookingFilterBar';
import BookingTable from '../components/bookings/BookingTable';
import BookingPagination from '../components/bookings/BookingPagination';
import NewBookingModal from '../components/bookings/NewBookingModal';
import BookingSummaryModal from '../components/bookings/BookingSummaryModal';
import BookingConfirmationModal from '../components/bookings/BookingConfirmationModal';
import CancelBookingModal from '../components/bookings/CancelBookingModal';

const Bookings = () => {
  const {
    bookings,
    filteredBookings,
    paginatedBookings,
    isLoading,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    resetFilters,

    // Actions
    checkIn,
    checkOut,
    cancelBookingRecord,
    refreshBookings,

    // Modals
    isNewBookingModalOpen,
    openNewBookingModal,
    closeNewBookingModal,
    isSummaryModalOpen,
    openSummaryModal,
    closeSummaryModal,
    selectedBooking,
    isConfirmationModalOpen,
    closeConfirmationModal,
    confirmedBooking,
    isCancelModalOpen,
    openCancelModal,
    closeCancelModal
  } = useBookings();

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 lg:p-6 space-y-6">
      
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
              <CalendarCheck className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Room Booking Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage guest suite reservations, automated nights & pricing, and double-booking protection
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => refreshBookings(false)}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Bookings'}</span>
            </button>

            <button
              type="button"
              onClick={openNewBookingModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <BookingStats stats={stats} />

      {/* Filter Bar */}
      <BookingFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={resetFilters}
        onOpenNewBooking={openNewBookingModal}
        totalResults={filteredBookings.length}
      />

      {/* Bookings Table */}
      <BookingTable
        bookings={paginatedBookings}
        onViewSummary={openSummaryModal}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
        onCancelBooking={openCancelModal}
      />

      {/* Pagination */}
      <BookingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={filteredBookings.length}
      />

      {/* Modals */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={closeNewBookingModal}
      />

      <BookingSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={closeSummaryModal}
        booking={selectedBooking}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
      />

      <BookingConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        booking={confirmedBooking}
      />

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        booking={selectedBooking}
        onConfirmCancel={cancelBookingRecord}
      />

    </div>
  );
};

export default Bookings;
