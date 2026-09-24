import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { BookingContext } from './BookingContextCore';
import {
  fetchBookingsApi,
  createBookingApi,
  updateBookingStatusApi,
  cancelBookingApi,
  deleteBookingApi
} from '../api/bookingApi';
import {
  getStoredBookings,
  checkDoubleBooking,
  calculateNights,
  calculateBookingPricing,
  getAvailableRoomsForDates
} from '../utils/bookingStorage';

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      return getStoredBookings();
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modals state
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Fetch bookings from mock API
  const loadBookings = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await fetchBookingsApi();
      if (res && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError(err.message || 'Failed to load bookings');
      if (!silent) toast.error('Failed to load bookings');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Initial load and cross-module sync listener
  useEffect(() => {
    loadBookings(true);

    const handleSync = () => {
      setBookings(getStoredBookings());
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('hbms_data_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('hbms_data_updated', handleSync);
    };
  }, [loadBookings]);

  // Compute filtered & sorted bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    const todayStr = new Date().toISOString().split('T')[0];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const matchName = String(b.guestName || '').toLowerCase().includes(q);
        const matchId = String(b.id || '').toLowerCase().includes(q);
        const matchRoom = String(b.roomNumber || '').includes(q);
        const matchSuite = String(b.suiteType || '').toLowerCase().includes(q);
        const matchEmail = String(b.guestEmail || '').toLowerCase().includes(q);
        const matchPhone = String(b.guestPhone || '').includes(q);
        return matchName || matchId || matchRoom || matchSuite || matchEmail || matchPhone;
      });
    }

    // Status filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Today Check-In') {
        result = result.filter(
          (b) => b.status === 'Today Check-In' || b.checkIn === todayStr
        );
      } else {
        result = result.filter((b) => b.status === statusFilter);
      }
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || b.checkIn || 0) - new Date(a.createdAt || a.checkIn || 0));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || a.checkIn || 0) - new Date(b.createdAt || b.checkIn || 0));
        break;
      case 'checkin-asc':
        result.sort((a, b) => new Date(a.checkIn || 0) - new Date(b.checkIn || 0));
        break;
      case 'amount-desc':
        result.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
        break;
      case 'amount-asc':
        result.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
        break;
      case 'guest-asc':
        result.sort((a, b) => (a.guestName || '').localeCompare(b.guestName || ''));
        break;
      default:
        break;
    }

    return result;
  }, [bookings, searchQuery, statusFilter, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  // KPI Statistics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = bookings.length;
    const checkedIn = bookings.filter((b) => b.status === 'Checked-In').length;
    const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
    const todayArrivals = bookings.filter(
      (b) => b.status === 'Today Check-In' || (b.checkIn === todayStr && b.status !== 'Cancelled')
    ).length;
    const cancelled = bookings.filter((b) => b.status === 'Cancelled').length;
    const totalRevenue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    return { total, checkedIn, confirmed, todayArrivals, cancelled, totalRevenue };
  }, [bookings]);

  // Double Booking Prevention Check Helper
  const checkAvailability = useCallback((roomNumber, checkIn, checkOut, excludeBookingId = null) => {
    return checkDoubleBooking(roomNumber, checkIn, checkOut, excludeBookingId);
  }, []);

  // Pricing Calculation Helper
  const calculatePricing = useCallback((pricePerNight, nights) => {
    return calculateBookingPricing(pricePerNight, nights);
  }, []);

  // Nights Calculation Helper
  const getNights = useCallback((checkIn, checkOut) => {
    return calculateNights(checkIn, checkOut);
  }, []);

  // Get Available Rooms Helper
  const getAvailableRooms = useCallback((checkIn, checkOut) => {
    return getAvailableRoomsForDates(checkIn, checkOut);
  }, []);

  // Create Booking
  const createBooking = async (bookingData) => {
    setIsLoading(true);
    try {
      const res = await createBookingApi(bookingData);
      setBookings(getStoredBookings());
      setConfirmedBooking(res.booking);
      setIsNewBookingModalOpen(false);
      setIsConfirmationModalOpen(true);
      toast.success(`Booking ${res.booking.id} confirmed for ${res.booking.guestName}!`);
      return { success: true, booking: res.booking };
    } catch (err) {
      const msg = err.message || 'Failed to create booking';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      const res = await updateBookingStatusApi(id, status);
      setBookings(getStoredBookings());
      toast.success(`Booking ${id} status updated to "${status}".`);
      return { success: true, booking: res.booking };
    } catch (err) {
      const msg = err.message || 'Failed to update status';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Check In
  const checkIn = async (id) => {
    return updateStatus(id, 'Checked-In');
  };

  // Check Out
  const checkOut = async (id) => {
    return updateStatus(id, 'Checked-Out');
  };

  // Cancel Booking
  const cancelBookingRecord = async (id, reason) => {
    try {
      const res = await cancelBookingApi(id, reason);
      setBookings(getStoredBookings());
      toast.info(`Booking ${id} has been cancelled. Suite is now released.`);
      setIsCancelModalOpen(false);
      setSelectedBooking(null);
      return { success: true, booking: res.booking };
    } catch (err) {
      const msg = err.message || 'Failed to cancel booking';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Delete Booking
  const deleteBookingRecord = async (id) => {
    try {
      await deleteBookingApi(id);
      setBookings(getStoredBookings());
      toast.success(`Booking ${id} deleted.`);
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Failed to delete booking';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Modal controls
  const openNewBookingModal = () => setIsNewBookingModalOpen(true);
  const closeNewBookingModal = () => setIsNewBookingModalOpen(false);

  const openSummaryModal = (booking) => {
    setSelectedBooking(booking);
    setIsSummaryModalOpen(true);
  };
  const closeSummaryModal = () => {
    setSelectedBooking(null);
    setIsSummaryModalOpen(false);
  };

  const openConfirmationModal = (booking) => {
    setConfirmedBooking(booking);
    setIsConfirmationModalOpen(true);
  };
  const closeConfirmationModal = () => {
    setConfirmedBooking(null);
    setIsConfirmationModalOpen(false);
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };
  const closeCancelModal = () => {
    setSelectedBooking(null);
    setIsCancelModalOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const value = {
    bookings,
    filteredBookings,
    paginatedBookings,
    isLoading,
    error,
    stats,

    // Filters & Pagination
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
    createBooking,
    updateStatus,
    checkIn,
    checkOut,
    cancelBookingRecord,
    deleteBookingRecord,
    refreshBookings: loadBookings,

    // Helpers
    checkAvailability,
    calculatePricing,
    getNights,
    getAvailableRooms,

    // Modals
    isNewBookingModalOpen,
    openNewBookingModal,
    closeNewBookingModal,
    isSummaryModalOpen,
    openSummaryModal,
    closeSummaryModal,
    selectedBooking,
    isConfirmationModalOpen,
    openConfirmationModal,
    closeConfirmationModal,
    confirmedBooking,
    isCancelModalOpen,
    openCancelModal,
    closeCancelModal
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;
