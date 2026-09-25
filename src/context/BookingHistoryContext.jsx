import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { BookingHistoryContext } from './BookingHistoryContextCore';
import {
  getAllBookingHistoryRecords,
  filterBookingsByDate,
  markBookingAsCompleted,
  cancelBookingWithReason,
  computeBookingHistoryStats
} from '../utils/bookingHistoryStorage';

export const BookingHistoryProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      return getAllBookingHistoryRecords();
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled'
  const [dateRangePreset, setDateRangePreset] = useState('all'); // 'all' | 'today' | 'week' | 'month' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [bookingToComplete, setBookingToComplete] = useState(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // Sync data with storage & global events
  const syncLocalHistory = useCallback(() => {
    try {
      const records = getAllBookingHistoryRecords();
      setBookings(records);
    } catch (err) {
      console.warn('Error syncing booking history:', err);
    }
  }, []);

  useEffect(() => {
    syncLocalHistory();

    window.addEventListener('storage', syncLocalHistory);
    window.addEventListener('hbms_data_updated', syncLocalHistory);

    return () => {
      window.removeEventListener('storage', syncLocalHistory);
      window.removeEventListener('hbms_data_updated', syncLocalHistory);
    };
  }, [syncLocalHistory]);

  // Overall Statistics
  const stats = useMemo(() => {
    return computeBookingHistoryStats(bookings);
  }, [bookings]);

  // Filtered Bookings History
  const filteredHistory = useMemo(() => {
    let result = [...bookings];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        return (
          b.id?.toLowerCase().includes(q) ||
          b.guestName?.toLowerCase().includes(q) ||
          b.guestEmail?.toLowerCase().includes(q) ||
          b.guestPhone?.includes(q) ||
          b.roomNumber?.includes(q) ||
          b.suiteType?.toLowerCase().includes(q) ||
          b.vipStatus?.toLowerCase().includes(q) ||
          b.paymentStatus?.toLowerCase().includes(q)
        );
      });
    }

    // 2. Status Filter
    if (statusFilter !== 'All') {
      result = result.filter((b) => {
        const s = (b.status || '').toLowerCase();
        if (statusFilter === 'Completed') {
          return s === 'completed' || s === 'checked-out';
        }
        if (statusFilter === 'Confirmed') {
          return s === 'confirmed' || s === 'today check-in' || s === 'pending';
        }
        if (statusFilter === 'Checked-In') {
          return s === 'checked-in';
        }
        if (statusFilter === 'Cancelled') {
          return s === 'cancelled';
        }
        return true;
      });
    }

    // 3. Date Range Filter
    result = filterBookingsByDate(result, dateRangePreset, startDate, endDate);

    return result;
  }, [bookings, searchQuery, statusFilter, dateRangePreset, startDate, endDate]);

  // Modal Handlers
  const openBookingDetails = (booking) => {
    setSelectedBookingDetails(booking);
    setIsDetailsModalOpen(true);
  };

  const closeBookingDetails = () => {
    setSelectedBookingDetails(null);
    setIsDetailsModalOpen(false);
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setBookingToCancel(null);
    setIsCancelModalOpen(false);
  };

  const openCompleteModal = (booking) => {
    setBookingToComplete(booking);
    setIsCompleteModalOpen(true);
  };

  const closeCompleteModal = () => {
    setBookingToComplete(null);
    setIsCompleteModalOpen(false);
  };

  // Actions
  const handleCancelBooking = async (bookingId, reason) => {
    setIsLoading(true);
    try {
      const res = cancelBookingWithReason(bookingId, reason);
      syncLocalHistory();
      toast.info(`Booking ${bookingId} has been cancelled. Suite is now available.`);
      closeCancelModal();
      if (selectedBookingDetails && selectedBookingDetails.id === bookingId) {
        setSelectedBookingDetails(res);
      }
      return { success: true, booking: res };
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkCompleted = async (bookingId, completionData = {}) => {
    setIsLoading(true);
    try {
      const res = markBookingAsCompleted(bookingId, completionData);
      syncLocalHistory();
      toast.success(`Booking ${bookingId} marked as Completed! Suite ${res.roomNumber} released.`);
      closeCompleteModal();
      if (selectedBookingDetails && selectedBookingDetails.id === bookingId) {
        setSelectedBookingDetails(res);
      }
      return { success: true, booking: res };
    } catch (err) {
      toast.error(err.message || 'Failed to complete booking.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateRangePreset('all');
    setStartDate('');
    setEndDate('');
  };

  const value = {
    bookings,
    filteredHistory,
    stats,
    isLoading,
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
    refreshHistory: syncLocalHistory,

    // Modals & Handlers
    selectedBookingDetails,
    isDetailsModalOpen,
    openBookingDetails,
    closeBookingDetails,

    bookingToCancel,
    isCancelModalOpen,
    openCancelModal,
    closeCancelModal,
    handleCancelBooking,

    bookingToComplete,
    isCompleteModalOpen,
    openCompleteModal,
    closeCompleteModal,
    handleMarkCompleted
  };

  return (
    <BookingHistoryContext.Provider value={value}>
      {children}
    </BookingHistoryContext.Provider>
  );
};
