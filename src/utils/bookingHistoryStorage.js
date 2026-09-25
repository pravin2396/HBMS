import {
  getStoredBookings,
  saveStoredBookings,
  cancelBooking,
  updateBookingStatus
} from './bookingStorage';
import { getStoredRooms, saveStoredRooms } from './roomStorage';
import { getStoredGuests, saveStoredGuests } from './guestStorage';
import { getStoredAnalytics, saveStoredAnalytics } from './analyticsStorage';
import { computeStayDurationDetails } from './checkInOutStorage';

/**
 * Historical seed bookings ensuring complete coverage of all statuses:
 * Completed, Cancelled, Checked-In, Confirmed
 */
export const SAMPLE_HISTORICAL_BOOKINGS = [
  {
    id: 'BK-8901',
    guestId: 'GST-1008',
    guestName: 'Genevieve Dupond',
    guestEmail: 'g.dupond@couture.paris',
    guestPhone: '+33 1 42 68 55 00',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Gold VIP',
    roomNumber: '304',
    suiteType: 'Mediterranean Ocean Suite',
    checkIn: '2026-09-18',
    checkOut: '2026-09-22',
    nights: 4,
    stayDuration: '4 Nights',
    guestsCount: 2,
    status: 'Completed',
    amount: 2200,
    paymentStatus: 'Paid in Full',
    actualCheckOutTime: '2026-09-22T10:30:00.000Z',
    receptionAgent: 'Alexander Sterling (Duty Manager)',
    specialRequests: 'High floor, feather pillows, sea view',
    completionNotes: 'Guest departed smoothly. Key card returned. All mini-bar incidentals cleared.',
    createdAt: '2026-09-10T11:20:00.000Z'
  },
  {
    id: 'BK-8902',
    guestId: 'GST-1006',
    guestName: 'Kenji & Mei Takahashi',
    guestEmail: 'takahashi.k@tokyocorp.jp',
    guestPhone: '+81 3 5555 0143',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Diamond Elite',
    roomNumber: '205',
    suiteType: 'Zen Garden Deluxe Suite',
    checkIn: '2026-09-15',
    checkOut: '2026-09-19',
    nights: 4,
    stayDuration: '4 Nights',
    guestsCount: 2,
    status: 'Completed',
    amount: 1450,
    paymentStatus: 'Paid in Full',
    actualCheckOutTime: '2026-09-19T11:15:00.000Z',
    receptionAgent: 'Front Desk Duty Manager',
    specialRequests: 'Green tea ceremony setup upon arrival',
    completionNotes: 'Guest expressed outstanding appreciation for resort staff and garden ambiance.',
    createdAt: '2026-09-08T09:40:00.000Z'
  },
  {
    id: 'BK-8903',
    guestId: 'GST-1007',
    guestName: 'Harrison Ford-Smith',
    guestEmail: 'h.fordsmith@globalaviation.com',
    guestPhone: '+1 (555) 890-4412',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Standard Guest',
    roomNumber: '108',
    suiteType: 'Deluxe Courtyard Suite',
    checkIn: '2026-09-16',
    checkOut: '2026-09-19',
    nights: 3,
    stayDuration: '3 Nights',
    guestsCount: 1,
    status: 'Cancelled',
    amount: 980,
    paymentStatus: 'Refunded',
    cancelledAt: '2026-09-15T14:10:00.000Z',
    cancellationReason: 'Emergency business conference rescheduled; full refund provided under 48h policy.',
    receptionAgent: 'Alexander Sterling',
    createdAt: '2026-09-11T16:30:00.000Z'
  },
  {
    id: 'BK-8904',
    guestId: 'GST-1015',
    guestName: 'Baroness Charlotte Von Berg',
    guestEmail: 'c.vonberg@munich-private.de',
    guestPhone: '+49 89 2109 4321',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Diamond Elite',
    roomNumber: '601',
    suiteType: 'Penthouse Panorama Suite',
    checkIn: '2026-09-12',
    checkOut: '2026-09-16',
    nights: 4,
    stayDuration: '4 Nights',
    guestsCount: 2,
    status: 'Completed',
    amount: 3200,
    paymentStatus: 'Paid in Full',
    actualCheckOutTime: '2026-09-16T12:00:00.000Z',
    receptionAgent: 'Alexander Sterling',
    specialRequests: 'Private heliport pickup, chilled Dom Pérignon in suite',
    completionNotes: 'Luggage transferred directly to VIP limousine.',
    createdAt: '2026-09-05T13:00:00.000Z'
  }
];

/**
 * Retrieve all bookings and ensure historical sample bookings are incorporated
 */
export const getAllBookingHistoryRecords = () => {
  const current = getStoredBookings();
  let modified = false;

  // Check if historical seeds already exist
  SAMPLE_HISTORICAL_BOOKINGS.forEach((sample) => {
    if (!current.some((b) => String(b.id) === String(sample.id))) {
      current.push(sample);
      modified = true;
    }
  });

  if (modified) {
    saveStoredBookings(current);
  }

  // Sort newest by creation or check-in date
  return current.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.checkIn || 0).getTime();
    const timeB = new Date(b.createdAt || b.checkIn || 0).getTime();
    return timeB - timeA;
  });
};

/**
 * Filter bookings list by date range preset or custom dates
 */
export const filterBookingsByDate = (bookings, preset = 'all', startDate = '', endDate = '') => {
  if (!Array.isArray(bookings)) return [];
  if (preset === 'all' && !startDate && !endDate) return bookings;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return bookings.filter((b) => {
    const checkIn = b.checkIn || '';
    const checkOut = b.checkOut || '';
    const created = b.createdAt ? b.createdAt.split('T')[0] : '';

    if (preset === 'today') {
      return checkIn === todayStr || checkOut === todayStr || created === todayStr;
    }

    if (preset === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const sevenDaysFuture = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return (checkIn >= sevenDaysAgo && checkIn <= sevenDaysFuture) || (created >= sevenDaysAgo);
    }

    if (preset === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return checkIn >= thirtyDaysAgo || created >= thirtyDaysAgo;
    }

    if (preset === 'custom' || (startDate && endDate)) {
      if (startDate && endDate) {
        return (checkIn >= startDate && checkIn <= endDate) ||
               (checkOut >= startDate && checkOut <= endDate) ||
               (checkIn <= startDate && checkOut >= endDate);
      }
      if (startDate) return checkIn >= startDate || checkOut >= startDate;
      if (endDate) return checkIn <= endDate || checkOut <= endDate;
    }

    return true;
  });
};

/**
 * Transition a booking to 'Completed' (or 'Checked-Out') status:
 * 1. Sets booking status to 'Completed' (and records actual check-out time)
 * 2. Frees room back to 'Available'
 * 3. Updates guest stay status to 'Checked-Out'
 * 4. Updates Analytics
 */
export const markBookingAsCompleted = (bookingId, completionData = {}) => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => String(b.id) === String(bookingId));
  if (index === -1) {
    throw new Error(`Booking record "${bookingId}" not found.`);
  }

  const booking = bookings[index];
  const nowIso = new Date().toISOString();
  const stayDetails = computeStayDurationDetails(booking.checkIn, nowIso);

  booking.status = 'Completed';
  booking.actualCheckOutTime = nowIso;
  booking.paymentStatus = 'Paid in Full';
  booking.completionNotes = completionData.notes || 'Stay successfully completed. Room released and final folio closed.';
  booking.receptionAgent = completionData.agent || 'Front Desk Duty Manager';
  booking.stayDuration = stayDetails.formattedDuration;

  bookings[index] = booking;
  saveStoredBookings(bookings);

  // Free room
  try {
    const rooms = getStoredRooms();
    const room = rooms.find((r) => String(r.roomNumber) === String(booking.roomNumber));
    if (room) {
      room.status = 'Available';
      saveStoredRooms(rooms);
    }
  } catch (e) {
    console.warn('Room release warning on completion:', e);
  }

  // Update Guest
  try {
    const guests = getStoredGuests();
    const guest = guests.find((g) => g.email?.toLowerCase() === booking.guestEmail?.toLowerCase());
    if (guest) {
      guest.stayStatus = 'Checked-Out';
      guest.roomAssigned = 'Unassigned';
      saveStoredGuests(guests);
    }
  } catch (e) {
    console.warn('Guest directory update warning on completion:', e);
  }

  // Update Analytics
  try {
    const analytics = getStoredAnalytics();
    analytics.availableRooms = (analytics.availableRooms || 34) + 1;
    if (analytics.occupiedRooms > 0) {
      analytics.occupiedRooms -= 1;
    }
    analytics.todayCheckOuts = (analytics.todayCheckOuts || 12) + 1;
    saveStoredAnalytics(analytics);
  } catch (e) {
    console.warn('Analytics update warning on completion:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return booking;
};

/**
 * Cancel a booking with custom reason
 */
export const cancelBookingWithReason = (bookingId, reason = '') => {
  return cancelBooking(bookingId, reason);
};

/**
 * Compute real-time booking history statistics
 */
export const computeBookingHistoryStats = (bookingsList) => {
  const list = Array.isArray(bookingsList) ? bookingsList : getAllBookingHistoryRecords();

  let total = list.length;
  let confirmed = 0;
  let checkedIn = 0;
  let completed = 0;
  let cancelled = 0;
  let totalRevenue = 0;
  let completedRevenue = 0;

  list.forEach((b) => {
    const st = (b.status || '').toLowerCase();
    const amt = Number(b.amount) || 0;

    if (st === 'confirmed' || st === 'today check-in' || st === 'pending') {
      confirmed++;
      totalRevenue += amt;
    } else if (st === 'checked-in') {
      checkedIn++;
      totalRevenue += amt;
    } else if (st === 'completed' || st === 'checked-out') {
      completed++;
      totalRevenue += amt;
      completedRevenue += amt;
    } else if (st === 'cancelled') {
      cancelled++;
    }
  });

  return {
    totalBookings: total,
    confirmedCount: confirmed,
    checkedInCount: checkedIn,
    completedCount: completed,
    cancelledCount: cancelled,
    totalRevenue,
    completedRevenue
  };
};
