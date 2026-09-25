import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { CheckInOutContext } from './CheckInOutContextCore';
import {
  getStoredCheckInHistory,
  getStoredCheckOutHistory,
  computeStayDurationDetails,
  seedSampleScheduledArrivals
} from '../utils/checkInOutStorage';
import {
  fetchCheckInHistoryApi,
  fetchCheckOutHistoryApi,
  checkInGuestApi,
  checkInNewWalkInGuestApi,
  checkOutGuestApi
} from '../api/checkInOutApi';
import { getStoredBookings } from '../utils/bookingStorage';
import { getStoredRooms } from '../utils/roomStorage';

export const CheckInOutProvider = ({ children }) => {
  const [checkInHistory, setCheckInHistory] = useState(() => {
    try {
      return getStoredCheckInHistory();
    } catch {
      return [];
    }
  });

  const [checkOutHistory, setCheckOutHistory] = useState(() => {
    try {
      return getStoredCheckOutHistory();
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      return getStoredBookings();
    } catch {
      return [];
    }
  });

  const [rooms, setRooms] = useState(() => {
    try {
      return getStoredRooms();
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [bookingForCheckIn, setBookingForCheckIn] = useState(null);

  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [bookingForCheckOut, setBookingForCheckOut] = useState(null);

  const [isStayDetailsModalOpen, setIsStayDetailsModalOpen] = useState(false);
  const [activeStayRecord, setActiveStayRecord] = useState(null);

  // Search & Filter state
  const [activeTab, setActiveTab] = useState('room-availability'); // 'room-availability' | 'checkin-history' | 'checkout-history'
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with storage and global events
  const syncLocalState = useCallback(() => {
    setCheckInHistory(getStoredCheckInHistory());
    setCheckOutHistory(getStoredCheckOutHistory());
    setBookings(getStoredBookings());
    setRooms(getStoredRooms());
  }, []);

  // Fetch initial history from mock API and attach listeners
  useEffect(() => {
    let isMounted = true;

    const loadRemoteHistories = async () => {
      try {
        const [inRes, outRes] = await Promise.all([
          fetchCheckInHistoryApi(),
          fetchCheckOutHistoryApi()
        ]);
        if (isMounted) {
          if (inRes?.history) setCheckInHistory(inRes.history);
          if (outRes?.history) setCheckOutHistory(outRes.history);
        }
      } catch (e) {
        console.warn('History fetch fallback:', e);
      }
    };

    loadRemoteHistories();

    window.addEventListener('storage', syncLocalState);
    window.addEventListener('hbms_data_updated', syncLocalState);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', syncLocalState);
      window.removeEventListener('hbms_data_updated', syncLocalState);
    };
  }, [syncLocalState]);

  // Derive Roster Lists
  // 1. All Pending Arrivals (Raw)
  const pendingArrivals = useMemo(() => {
    return bookings.filter(
      (b) => b.status !== 'Checked-In' && b.status !== 'Checked-Out' && b.status !== 'Cancelled'
    );
  }, [bookings]);

  // Available Rooms List
  const availableRooms = useMemo(() => {
    return rooms.filter((r) => r && (r.status === 'Available' || r.status === 'available'));
  }, [rooms]);

  // 1b. Filtered Pending Arrivals (Matches search query)
  const filteredPendingArrivals = useMemo(() => {
    if (!searchQuery.trim()) return pendingArrivals;
    const q = searchQuery.toLowerCase().trim();
    return pendingArrivals.filter((b) => {
      return (
        b.guestName?.toLowerCase().includes(q) ||
        b.guestEmail?.toLowerCase().includes(q) ||
        b.guestPhone?.includes(q) ||
        b.roomNumber?.includes(q) ||
        b.suiteType?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q) ||
        b.vipStatus?.toLowerCase().includes(q)
      );
    });
  }, [pendingArrivals, searchQuery]);

  // 2. All Active In-House Guests (Raw)
  const activeInHouseGuests = useMemo(() => {
    return bookings.filter((b) => b.status === 'Checked-In');
  }, [bookings]);

  // 2b. Filtered Active In-House Guests (Matches search query)
  const filteredActiveInHouseGuests = useMemo(() => {
    if (!searchQuery.trim()) return activeInHouseGuests;
    const q = searchQuery.toLowerCase().trim();
    return activeInHouseGuests.filter((b) => {
      return (
        b.guestName?.toLowerCase().includes(q) ||
        b.guestEmail?.toLowerCase().includes(q) ||
        b.guestPhone?.includes(q) ||
        b.roomNumber?.includes(q) ||
        b.suiteType?.toLowerCase().includes(q) ||
        b.keyCardId?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q) ||
        b.vipStatus?.toLowerCase().includes(q)
      );
    });
  }, [activeInHouseGuests, searchQuery]);

  // 3. Filtered Check-In History
  const filteredCheckInHistory = useMemo(() => {
    if (!searchQuery.trim()) return checkInHistory;
    const q = searchQuery.toLowerCase().trim();
    return checkInHistory.filter((item) => {
      return (
        item.guestName?.toLowerCase().includes(q) ||
        item.guestEmail?.toLowerCase().includes(q) ||
        item.guestPhone?.includes(q) ||
        item.roomNumber?.includes(q) ||
        item.suiteType?.toLowerCase().includes(q) ||
        item.bookingId?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q) ||
        item.keyCardId?.toLowerCase().includes(q) ||
        item.receptionAgent?.toLowerCase().includes(q) ||
        item.vipStatus?.toLowerCase().includes(q)
      );
    });
  }, [checkInHistory, searchQuery]);

  // 4. Filtered Check-Out History
  const filteredCheckOutHistory = useMemo(() => {
    if (!searchQuery.trim()) return checkOutHistory;
    const q = searchQuery.toLowerCase().trim();
    return checkOutHistory.filter((item) => {
      return (
        item.guestName?.toLowerCase().includes(q) ||
        item.guestEmail?.toLowerCase().includes(q) ||
        item.roomNumber?.includes(q) ||
        item.suiteType?.toLowerCase().includes(q) ||
        item.bookingId?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q) ||
        item.keyCardId?.toLowerCase().includes(q) ||
        item.receptionAgent?.toLowerCase().includes(q) ||
        item.paymentStatus?.toLowerCase().includes(q)
      );
    });
  }, [checkOutHistory, searchQuery]);

  // KPI Statistics
  const stats = useMemo(() => {
    const rawRooms = Array.isArray(rooms) && rooms.length > 0 ? rooms : getStoredRooms();
    const availableRoomsCount = rawRooms.filter((r) => r && String(r.status).toLowerCase() === 'available').length;
    const occupiedRoomsCount = rawRooms.filter((r) => r && String(r.status).toLowerCase() === 'occupied').length;
    const todayArrivalsCount = pendingArrivals.length;
    const inHouseCount = activeInHouseGuests.length;
    const completedCheckOutsCount = checkOutHistory.length;

    return {
      availableRoomsCount,
      occupiedRoomsCount,
      todayArrivalsCount,
      inHouseCount,
      completedCheckOutsCount,
      totalRoomsCount: rawRooms.length || 120
    };
  }, [rooms, pendingArrivals, activeInHouseGuests, checkOutHistory]);

  // Seed sample scheduled arrivals for testing when pending roster is empty
  const handleSeedScheduledArrivals = useCallback(() => {
    seedSampleScheduledArrivals();
    syncLocalState();
    toast.success('Sample scheduled reservations loaded! Ready for check-in.');
  }, [syncLocalState]);

  // Process Check-In Action
  const handleCheckIn = async (bookingId, checkInData = {}) => {
    setIsLoading(true);
    try {
      if (!bookingId || String(bookingId) === 'undefined') {
        const res = await checkInNewWalkInGuestApi({
          ...checkInData,
          roomNumber: checkInData.roomNumber || '101',
          guestName: checkInData.guestName || 'Walk-In Guest'
        });
        syncLocalState();
        toast.success(
          `Guest ${res.booking.guestName} successfully checked into Room ${res.booking.roomNumber}! Suite is now Occupied.`
        );
        closeCheckInModal();
        return { success: true, ...res };
      }

      const res = await checkInGuestApi(bookingId, checkInData);
      syncLocalState();
      toast.success(
        `Guest ${res.booking.guestName} successfully checked into Room ${res.booking.roomNumber}! Key card issued.`
      );
      closeCheckInModal();
      return { success: true, ...res };
    } catch (err) {
      const msg = err.message || 'Check-in failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Process Check-Out Action
  const handleCheckOut = async (bookingId, checkOutData = {}) => {
    setIsLoading(true);
    try {
      const res = await checkOutGuestApi(bookingId, checkOutData);
      syncLocalState();
      toast.success(
        `Check-out completed for ${res.booking.guestName}. Room ${res.booking.roomNumber} is now Available.`
      );
      closeCheckOutModal();
      return { success: true, ...res };
    } catch (err) {
      const msg = err.message || 'Check-out failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Process New / Walk-In Check-In Action
  const handleNewWalkInCheckIn = async (walkInData) => {
    setIsLoading(true);
    try {
      const res = await checkInNewWalkInGuestApi(walkInData);
      syncLocalState();
      toast.success(
        `Guest ${res.booking.guestName} successfully checked into Room ${res.booking.roomNumber}! Suite is now Occupied.`
      );
      closeCheckInModal();
      return { success: true, ...res };
    } catch (err) {
      const msg = err.message || 'Walk-in check-in failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Modal Controls
  const openCheckInModal = (booking) => {
    setBookingForCheckIn(booking);
    setIsCheckInModalOpen(true);
  };

  const closeCheckInModal = () => {
    setBookingForCheckIn(null);
    setIsCheckInModalOpen(false);
  };

  const openCheckOutModal = (booking) => {
    setBookingForCheckOut(booking);
    setIsCheckOutModalOpen(true);
  };

  const closeCheckOutModal = () => {
    setBookingForCheckOut(null);
    setIsCheckOutModalOpen(false);
  };

  const openStayDetailsModal = (record) => {
    setActiveStayRecord(record);
    setIsStayDetailsModalOpen(true);
  };

  const closeStayDetailsModal = () => {
    setActiveStayRecord(null);
    setIsStayDetailsModalOpen(false);
  };

  const value = {
    // Data lists
    rooms,
    setRooms,
    availableRooms,
    pendingArrivals,
    filteredPendingArrivals,
    activeInHouseGuests,
    filteredActiveInHouseGuests,
    checkInHistory,
    checkOutHistory,
    filteredCheckInHistory,
    filteredCheckOutHistory,
    stats,
    isLoading,

    // Tab & Search State
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    historySearchQuery: searchQuery,
    setHistorySearchQuery: setSearchQuery,

    // Actions
    handleCheckIn,
    handleNewWalkInCheckIn,
    handleCheckOut,
    syncLocalState,
    seedScheduledArrivals: handleSeedScheduledArrivals,
    computeStayDuration: computeStayDurationDetails,

    // Modals
    isCheckInModalOpen,
    bookingForCheckIn,
    openCheckInModal,
    closeCheckInModal,

    isCheckOutModalOpen,
    bookingForCheckOut,
    openCheckOutModal,
    closeCheckOutModal,

    isStayDetailsModalOpen,
    activeStayRecord,
    openStayDetailsModal,
    closeStayDetailsModal
  };

  return (
    <CheckInOutContext.Provider value={value}>
      {children}
    </CheckInOutContext.Provider>
  );
};

export default CheckInOutProvider;
