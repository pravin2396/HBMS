import {
  getStoredBookings as getAnalyticsStoredBookings,
  saveStoredBookings as saveAnalyticsStoredBookings,
  getStoredAnalytics,
  saveStoredAnalytics,
  BOOKINGS_STORAGE_KEY
} from './analyticsStorage';
import { getStoredRooms, saveStoredRooms } from './roomStorage';
import { getStoredGuests, saveStoredGuests } from './guestStorage';

export { BOOKINGS_STORAGE_KEY };

/**
 * Calculate the number of nights between check-in and check-out dates
 */
export const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 1;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};

/**
 * Calculate transparent pricing breakdown for a booking
 */
export const calculateBookingPricing = (pricePerNight, nights) => {
  const rate = Number(pricePerNight) || 350;
  const stayNights = Math.max(1, Number(nights) || 1);
  const subtotal = rate * stayNights;
  const luxuryTax = Math.round(subtotal * 0.12); // 12% Luxury Hotel & Tourism Tax
  const serviceFee = Math.round(subtotal * 0.05); // 5% Luxury Resort Amenities Fee
  const totalAmount = subtotal + luxuryTax + serviceFee;

  return {
    pricePerNight: rate,
    nights: stayNights,
    subtotal,
    luxuryTax,
    serviceFee,
    totalAmount
  };
};

/**
 * Check if a room has an active overlapping reservation (Prevent Double Booking)
 * Two intervals [startA, endA] and [startB, endB] overlap if:
 * startA < endB && endA > startB
 * 
 * Excludes cancelled or checked-out bookings.
 * Optionally excludes a current booking ID (for edits).
 */
export const checkDoubleBooking = (roomNumber, checkIn, checkOut, excludeBookingId = null) => {
  if (!roomNumber || !checkIn || !checkOut) {
    return { isDoubleBooked: false, conflictingBooking: null };
  }

  const bookings = getAnalyticsStoredBookings();
  const newStart = new Date(checkIn).getTime();
  const newEnd = new Date(checkOut).getTime();

  const conflictingBooking = bookings.find((b) => {
    // Only consider the same room
    if (String(b.roomNumber) !== String(roomNumber)) return false;

    // Ignore current booking if updating
    if (excludeBookingId && String(b.id) === String(excludeBookingId)) return false;

    // Ignore cancelled or checked-out bookings as the room is now free
    if (b.status === 'Cancelled' || b.status === 'Checked-Out') return false;

    const existingStart = new Date(b.checkIn).getTime();
    const existingEnd = new Date(b.checkOut).getTime();

    // Overlap condition
    return newStart < existingEnd && newEnd > existingStart;
  });

  return {
    isDoubleBooked: Boolean(conflictingBooking),
    conflictingBooking: conflictingBooking || null
  };
};

/**
 * Get available rooms for a specific date range from the rooms inventory
 */
export const getAvailableRoomsForDates = (checkIn, checkOut, excludeBookingId = null) => {
  const rooms = getStoredRooms();
  if (!checkIn || !checkOut) return rooms;

  return rooms.filter((room) => {
    const { isDoubleBooked } = checkDoubleBooking(room.roomNumber, checkIn, checkOut, excludeBookingId);
    return !isDoubleBooked;
  });
};

/**
 * Retrieve all stored bookings
 */
export const getStoredBookings = () => {
  return getAnalyticsStoredBookings();
};

/**
 * Save all bookings
 */
export const saveStoredBookings = (bookings) => {
  saveAnalyticsStoredBookings(bookings);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }
};

/**
 * Create a new luxury room booking with double-booking prevention & cross-module sync
 */
export const createNewBooking = (bookingData) => {
  const { roomNumber, checkIn, checkOut } = bookingData;

  // 1. Double Booking Prevention Guard
  const { isDoubleBooked, conflictingBooking } = checkDoubleBooking(roomNumber, checkIn, checkOut);
  if (isDoubleBooked && conflictingBooking) {
    throw new Error(
      `Double Booking Prevented: Room ${roomNumber} is already reserved by ${conflictingBooking.guestName} from ${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}.`
    );
  }

  const nights = calculateNights(checkIn, checkOut);
  const pricing = calculateBookingPricing(bookingData.pricePerNight || 450, nights);
  const finalAmount = Number(bookingData.amount) || pricing.totalAmount;

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = checkIn === todayStr;
  const initialStatus = bookingData.status || (isToday ? 'Today Check-In' : 'Confirmed');

  const newBooking = {
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    guestId: bookingData.guestId || null,
    guestName: bookingData.guestName.trim(),
    guestEmail: bookingData.guestEmail.trim().toLowerCase(),
    guestPhone: bookingData.guestPhone ? bookingData.guestPhone.trim() : '+1 (555) 000-0000',
    avatar: bookingData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(bookingData.guestName)}`,
    vipStatus: bookingData.vipStatus || 'Standard Guest',
    nationality: bookingData.nationality || 'United States',
    roomId: bookingData.roomId || null,
    roomNumber: String(roomNumber),
    suiteType: bookingData.suiteType || `Deluxe Suite (Room ${roomNumber})`,
    pricePerNight: pricing.pricePerNight,
    checkIn,
    checkOut,
    nights,
    stayDuration: `${nights} ${nights === 1 ? 'Night' : 'Nights'}`,
    guestsCount: Number(bookingData.guestsCount) || 1,
    subtotal: pricing.subtotal,
    luxuryTax: pricing.luxuryTax,
    serviceFee: pricing.serviceFee,
    amount: finalAmount,
    paymentStatus: bookingData.paymentStatus || 'Paid',
    paymentMethod: bookingData.paymentMethod || 'Credit Card (Stripe Gateway)',
    status: initialStatus,
    specialRequests: bookingData.specialRequests ? bookingData.specialRequests.trim() : 'Standard VIP service requested.',
    createdAt: new Date().toISOString()
  };

  const bookings = getStoredBookings();
  bookings.unshift(newBooking);
  saveStoredBookings(bookings);

  // 2. Synchronize with Room inventory: If checked in, set room to Occupied
  try {
    const rooms = getStoredRooms();
    const targetRoom = rooms.find((r) => String(r.roomNumber) === String(roomNumber));
    if (targetRoom) {
      if (initialStatus === 'Checked-In') {
        targetRoom.status = 'Occupied';
      }
      saveStoredRooms(rooms);
    }
  } catch (err) {
    console.warn('Room sync warning on booking creation:', err);
  }

  // 3. Synchronize with Guest inventory: Update room assigned or stay count
  try {
    const guests = getStoredGuests();
    const targetGuest = guests.find(
      (g) => (newBooking.guestId && String(g.id) === String(newBooking.guestId)) ||
             g.email.toLowerCase() === newBooking.guestEmail.toLowerCase()
    );
    if (targetGuest) {
      targetGuest.roomAssigned = `Suite ${roomNumber} (${newBooking.suiteType})`;
      targetGuest.stayStatus = initialStatus;
      targetGuest.totalStays = (targetGuest.totalStays || 1) + 1;
      saveStoredGuests(guests);
    }
  } catch (err) {
    console.warn('Guest sync warning on booking creation:', err);
  }

  // 4. Synchronize Analytics
  try {
    const analytics = getStoredAnalytics();
    analytics.totalBookings = (analytics.totalBookings || 438) + 1;
    analytics.totalGuests = (analytics.totalGuests || 214) + newBooking.guestsCount;
    analytics.revenue.grossRevenue = (analytics.revenue.grossRevenue || 248500) + finalAmount;
    if (initialStatus === 'Checked-In' && analytics.availableRooms > 0) {
      analytics.availableRooms -= 1;
      analytics.occupiedRooms += 1;
    }
    saveStoredAnalytics(analytics);
  } catch (err) {
    console.warn('Analytics sync warning on booking creation:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return newBooking;
};

/**
 * Update a booking's status (Confirmed, Checked-In, Checked-Out, Cancelled)
 */
export const updateBookingStatus = (bookingId, newStatus) => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => String(b.id) === String(bookingId));
  if (index === -1) {
    throw new Error('Booking record not found.');
  }

  const oldStatus = bookings[index].status;
  bookings[index].status = newStatus;
  saveStoredBookings(bookings);

  // Sync Room inventory according to new status
  try {
    const rooms = getStoredRooms();
    const targetRoom = rooms.find((r) => String(r.roomNumber) === String(bookings[index].roomNumber));
    if (targetRoom) {
      if (newStatus === 'Checked-In') {
        targetRoom.status = 'Occupied';
      } else if (newStatus === 'Checked-Out' || newStatus === 'Cancelled') {
        targetRoom.status = 'Available';
      }
      saveStoredRooms(rooms);
    }
  } catch (err) {
    console.warn('Room sync warning on status change:', err);
  }

  // Sync Guest inventory
  try {
    const guests = getStoredGuests();
    const targetGuest = guests.find(
      (g) => g.email.toLowerCase() === bookings[index].guestEmail.toLowerCase()
    );
    if (targetGuest) {
      targetGuest.stayStatus = newStatus;
      if (newStatus === 'Checked-Out' || newStatus === 'Cancelled') {
        targetGuest.roomAssigned = 'Unassigned';
      }
      saveStoredGuests(guests);
    }
  } catch (err) {
    console.warn('Guest sync warning on status change:', err);
  }

  // Sync Analytics
  try {
    const analytics = getStoredAnalytics();
    if (newStatus === 'Checked-In' && oldStatus !== 'Checked-In') {
      if (analytics.availableRooms > 0) {
        analytics.availableRooms -= 1;
        analytics.occupiedRooms += 1;
      }
      if (analytics.todayCheckIns > 0) {
        analytics.todayCheckIns -= 1;
      }
    } else if (newStatus === 'Checked-Out') {
      analytics.availableRooms += 1;
      if (analytics.occupiedRooms > 0) {
        analytics.occupiedRooms -= 1;
      }
      analytics.todayCheckOuts = (analytics.todayCheckOuts || 12) + 1;
    }
    saveStoredAnalytics(analytics);
  } catch (err) {
    console.warn('Analytics sync warning on status change:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return bookings[index];
};

/**
 * Cancel a booking and free up room
 */
export const cancelBooking = (bookingId, cancellationReason = '') => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => String(b.id) === String(bookingId));
  if (index === -1) {
    throw new Error('Booking record not found.');
  }

  bookings[index].status = 'Cancelled';
  bookings[index].cancellationReason = cancellationReason || 'Guest requested cancellation';
  bookings[index].cancelledAt = new Date().toISOString();
  saveStoredBookings(bookings);

  // Free up room
  try {
    const rooms = getStoredRooms();
    const targetRoom = rooms.find((r) => String(r.roomNumber) === String(bookings[index].roomNumber));
    if (targetRoom) {
      targetRoom.status = 'Available';
      saveStoredRooms(rooms);
    }
  } catch (err) {
    console.warn('Room release warning on cancellation:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return bookings[index];
};

/**
 * Delete a booking record
 */
export const deleteBooking = (bookingId) => {
  const bookings = getStoredBookings();
  const target = bookings.find((b) => String(b.id) === String(bookingId));
  const filtered = bookings.filter((b) => String(b.id) !== String(bookingId));
  if (filtered.length === bookings.length) {
    throw new Error('Booking record not found.');
  }

  saveStoredBookings(filtered);

  // If deleted booking was occupying a room, make it available
  if (target && target.status === 'Checked-In') {
    try {
      const rooms = getStoredRooms();
      const targetRoom = rooms.find((r) => String(r.roomNumber) === String(target.roomNumber));
      if (targetRoom) {
        targetRoom.status = 'Available';
        saveStoredRooms(rooms);
      }
    } catch (e) {
      console.warn('Error freeing room upon deletion:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return true;
};
