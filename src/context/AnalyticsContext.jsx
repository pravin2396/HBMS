import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AnalyticsContext } from './AnalyticsContextCore';
import {
  getStoredAnalytics,
  getStoredBookings,
  initializeAnalyticsStorage
} from '../utils/analyticsStorage';
import {
  fetchAnalyticsApi,
  fetchBookingsApi,
  createBookingApi,
  checkInGuestApi
} from '../api/analyticsApi';

export const AnalyticsProvider = ({ children }) => {
  // Initialize state synchronously from LocalStorage to avoid UI flickers
  const [analytics, setAnalytics] = useState(() => {
    try {
      initializeAnalyticsStorage();
      return getStoredAnalytics();
    } catch {
      return null;
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      initializeAnalyticsStorage();
      return getStoredBookings();
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  // Trigger real HTTP network requests on mount to reflect in DevTools Network tab
  useEffect(() => {
    let isMounted = true;

    const loadRemoteAnalytics = async () => {
      try {
        const [remoteAnalytics, remoteBookings] = await Promise.all([
          fetchAnalyticsApi(),
          fetchBookingsApi()
        ]);
        if (isMounted) {
          if (remoteAnalytics) setAnalytics(remoteAnalytics);
          if (remoteBookings) setBookings(remoteBookings);
        }
      } catch (err) {
        console.error('Error synchronizing analytics via API:', err);
      }
    };

    loadRemoteAnalytics();

    // Listen for cross-module updates (e.g. Guest Management or Room Management changes)
    const handleDataSync = () => {
      if (isMounted) {
        setAnalytics(getStoredAnalytics());
        setBookings(getStoredBookings());
      }
    };

    window.addEventListener('storage', handleDataSync);
    window.addEventListener('hbms_data_updated', handleDataSync);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleDataSync);
      window.removeEventListener('hbms_data_updated', handleDataSync);
    };
  }, []);

  const openReservationModal = () => setIsReservationModalOpen(true);
  const closeReservationModal = () => setIsReservationModalOpen(false);

  /**
   * Create a new booking reservation
   */
  const createReservation = async (bookingData) => {
    setIsLoading(true);
    try {
      const result = await createBookingApi(bookingData);
      if (result) {
        setBookings(getStoredBookings());
        setAnalytics(getStoredAnalytics());
        toast.success(`Reservation confirmed for ${bookingData.guestName}! Room assigned.`);
        closeReservationModal();
        return result;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create reservation.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check in a guest
   */
  const checkInGuest = async (bookingId) => {
    try {
      const updated = await checkInGuestApi(bookingId);
      if (updated) {
        setBookings(getStoredBookings());
        setAnalytics(getStoredAnalytics());
        toast.success(`Guest ${updated.guestName} successfully checked into Room ${updated.roomNumber}!`);
        return updated;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to check in guest.');
      throw error;
    }
  };

  /**
   * Refresh all analytics via HTTP GET
   */
  const refreshAnalytics = async (options = {}) => {
    const silent = options && options.silent === true;
    if (!silent) setIsLoading(true);
    try {
      const [remoteAnalytics, remoteBookings] = await Promise.all([
        fetchAnalyticsApi(),
        fetchBookingsApi()
      ]);
      setAnalytics(remoteAnalytics);
      setBookings(remoteBookings);
      if (!silent) {
        toast.info('Dashboard analytics refreshed with latest data.');
      }
    } catch {
      if (!silent) {
        toast.error('Failed to refresh analytics.');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const value = {
    analytics,
    bookings,
    isLoading,
    isReservationModalOpen,
    openReservationModal,
    closeReservationModal,
    createReservation,
    checkInGuest,
    refreshAnalytics
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
