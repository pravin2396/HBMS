import {
  getStoredBookings,
  saveStoredBookings,
  updateBookingStatus,
  calculateNights
} from './bookingStorage';
import { getStoredRooms, saveStoredRooms } from './roomStorage';
import { getStoredGuests, saveStoredGuests } from './guestStorage';
import { getStoredAnalytics, saveStoredAnalytics } from './analyticsStorage';

export const CHECKIN_HISTORY_KEY = 'hbms_checkin_history';
export const CHECKOUT_HISTORY_KEY = 'hbms_checkout_history';

/**
 * Seed or replenish sample scheduled arrivals (status: 'Confirmed')
 * Ensures there are always scheduled reservations for testing check-in
 */
export const seedSampleScheduledArrivals = () => {
  const bookings = getStoredBookings();
  const rooms = getStoredRooms();
  const today = new Date().toISOString().split('T')[0];
  const d2 = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const d3 = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const d5 = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

  const sampleArrivals = [
    {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestId: 'GST-1011',
      guestName: 'Marcus Sterling',
      guestEmail: 'm.sterling@invest.com',
      guestPhone: '+1 (555) 782-9904',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      vipStatus: 'Diamond Elite',
      suiteType: 'Royal Oceanfront Villa',
      roomNumber: '404',
      checkIn: today,
      checkOut: d3,
      nights: 3,
      stayDuration: '3 Nights',
      guestsCount: 2,
      status: 'Confirmed',
      amount: 2800,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    },
    {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestId: 'GST-1012',
      guestName: 'Dr. Clara Thorne',
      guestEmail: 'clara.thorne@medcenter.org',
      guestPhone: '+1 (555) 671-3321',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      vipStatus: 'VIP Platinum',
      suiteType: 'Executive Diplomat Suite',
      roomNumber: '302',
      checkIn: today,
      checkOut: d5,
      nights: 5,
      stayDuration: '5 Nights',
      guestsCount: 2,
      status: 'Confirmed',
      amount: 3100,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    },
    {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestId: 'GST-1013',
      guestName: 'Sophia Laurent',
      guestEmail: 'sophia.laurent@vogue.fr',
      guestPhone: '+1 (555) 345-9812',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      vipStatus: 'Gold VIP',
      suiteType: 'Deluxe Room',
      roomNumber: '102',
      checkIn: today,
      checkOut: d2,
      nights: 2,
      stayDuration: '2 Nights',
      guestsCount: 2,
      status: 'Confirmed',
      amount: 1450,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    }
  ];

  // Set the associated rooms to 'Available' so checking them in transitions them cleanly to 'Occupied'
  sampleArrivals.forEach((arrival) => {
    const rm = rooms.find((r) => String(r.roomNumber) === String(arrival.roomNumber));
    if (rm) {
      rm.status = 'Available';
    }
  });
  saveStoredRooms(rooms);

  // Filter out any stale duplicate bookings for the same room that aren't checked in
  const remainingBookings = bookings.filter(
    (b) => !sampleArrivals.some((sa) => String(sa.roomNumber) === String(b.roomNumber) && b.status !== 'Checked-In')
  );

  const updatedBookings = [...sampleArrivals, ...remainingBookings];
  saveStoredBookings(updatedBookings);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return sampleArrivals;
};

// Pre-seeded Check-In History
export const INITIAL_CHECKIN_HISTORY = [
  {
    id: 'CHK-IN-1001',
    bookingId: 'BK-9021',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.vance@luxury.com',
    guestPhone: '+1 (555) 234-8891',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    roomNumber: '701',
    suiteType: 'Presidential Penthouse (Suite 701)',
    vipStatus: 'VIP Platinum',
    checkInTime: '2026-09-23T14:30:00.000Z',
    expectedCheckOut: '2026-09-28',
    stayDuration: '5 Nights',
    scheduledNights: 5,
    keyCardId: 'RFID-701-A',
    luggageCount: 3,
    depositAmount: 1000,
    depositMethod: 'Credit Card Authorization',
    receptionAgent: 'Alexander Sterling (Front Desk Mgr)',
    notes: 'Arrived via private resort chauffeur. Welcome Dom Pérignon Champagne delivered to penthouse.'
  },
  {
    id: 'CHK-IN-1002',
    bookingId: 'BK-9022',
    guestName: 'Marcus Sterling',
    guestEmail: 'm.sterling@invest.com',
    guestPhone: '+1 (555) 782-9904',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    roomNumber: '404',
    suiteType: 'Royal Oceanfront Villa (Suite 404)',
    vipStatus: 'Diamond Elite',
    checkInTime: '2026-09-23T16:15:00.000Z',
    expectedCheckOut: '2026-09-26',
    stayDuration: '3 Nights',
    scheduledNights: 3,
    keyCardId: 'RFID-404-B',
    luggageCount: 4,
    depositAmount: 1500,
    depositMethod: 'Amex Black Centurion',
    receptionAgent: 'Sophia Montgomery (Concierge)',
    notes: 'Early morning Bloomberg terminal verified. Private cabana reserved at Infinity Beach.'
  },
  {
    id: 'CHK-IN-1003',
    bookingId: 'BK-9024',
    guestName: 'Liam O’Connor',
    guestEmail: 'liam.oconnor@creative.co',
    guestPhone: '+1 (555) 890-4412',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    roomNumber: '112',
    suiteType: 'Deluxe Heritage King (Suite 112)',
    vipStatus: 'Silver Preferred',
    checkInTime: '2026-09-24T11:45:00.000Z',
    expectedCheckOut: '2026-09-27',
    stayDuration: '3 Nights',
    scheduledNights: 3,
    keyCardId: 'RFID-112-A',
    luggageCount: 2,
    depositAmount: 500,
    depositMethod: 'Visa Signature',
    receptionAgent: 'Alexander Sterling (Front Desk Mgr)',
    notes: 'Photography equipment handled with care. Balcony garden view confirmed.'
  }
];

// Pre-seeded Check-Out History
export const INITIAL_CHECKOUT_HISTORY = [
  {
    id: 'CHK-OUT-2001',
    bookingId: 'BK-8991',
    guestName: 'Victoria Harrison',
    guestEmail: 'v.harrison@horizon.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    roomNumber: '204',
    suiteType: 'Executive Diplomat Suite',
    checkInDate: '2026-09-20',
    checkOutTime: '2026-09-23T10:45:00.000Z',
    stayDuration: '3 Nights',
    nightsStayed: 3,
    keyCardReturned: true,
    keyCardId: 'RFID-204-A',
    roomInspectionStatus: 'Passed (Flawless Condition)',
    incidentalsAmount: 245, // Spa & Fine Dining
    roomTotalAmount: 1860,
    finalSettledAmount: 2105,
    paymentStatus: 'Paid in Full',
    receptionAgent: 'Sophia Montgomery (Front Desk)',
    feedbackRating: 5,
    feedbackNotes: 'Exquisite service and world-class spa treatments. Highly praised the concierge team.'
  },
  {
    id: 'CHK-OUT-2002',
    bookingId: 'BK-8994',
    guestName: 'Julian Beaumont',
    guestEmail: 'julian.b@beaumont.fr',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    roomNumber: '318',
    suiteType: 'Lagoon Garden Bungalow',
    checkInDate: '2026-09-19',
    checkOutTime: '2026-09-23T11:30:00.000Z',
    stayDuration: '4 Nights',
    nightsStayed: 4,
    keyCardReturned: true,
    keyCardId: 'RFID-318-C',
    roomInspectionStatus: 'Passed (No Damage)',
    incidentalsAmount: 380, // Minibar & Lagoon Chauffeur
    roomTotalAmount: 1920,
    finalSettledAmount: 2300,
    paymentStatus: 'Paid in Full',
    receptionAgent: 'Alexander Sterling (Front Desk Mgr)',
    feedbackRating: 5,
    feedbackNotes: 'Loved the private plunge pool and midnight room service.'
  }
];

/**
 * Get Check-In History
 */
export const getStoredCheckInHistory = () => {
  try {
    const raw = localStorage.getItem(CHECKIN_HISTORY_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CHECKIN_HISTORY;
  } catch (err) {
    console.error('Error reading check-in history:', err);
    return INITIAL_CHECKIN_HISTORY;
  }
};

/**
 * Save Check-In History
 */
export const saveStoredCheckInHistory = (history) => {
  try {
    localStorage.setItem(CHECKIN_HISTORY_KEY, JSON.stringify(history));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hbms_data_updated'));
    }
  } catch (err) {
    console.error('Error saving check-in history:', err);
  }
};

/**
 * Get Check-Out History
 */
export const getStoredCheckOutHistory = () => {
  try {
    const raw = localStorage.getItem(CHECKOUT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CHECKOUT_HISTORY;
  } catch (err) {
    console.error('Error reading check-out history:', err);
    return INITIAL_CHECKOUT_HISTORY;
  }
};

/**
 * Save Check-Out History
 */
export const saveStoredCheckOutHistory = (history) => {
  try {
    localStorage.setItem(CHECKOUT_HISTORY_KEY, JSON.stringify(history));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hbms_data_updated'));
    }
  } catch (err) {
    console.error('Error saving check-out history:', err);
  }
};

/**
 * Helper to compute stay duration details
 */
export const computeStayDurationDetails = (checkInDate, checkOutDate = null) => {
  const checkIn = new Date(checkInDate);
  const now = new Date();
  const end = checkOutDate ? new Date(checkOutDate) : now;

  // Nights scheduled or elapsed
  const scheduledDiff = end.getTime() - checkIn.getTime();
  const scheduledNights = Math.max(1, Math.round(scheduledDiff / (1000 * 60 * 60 * 24)));

  // Elapsed days since check-in
  const elapsedDiff = Math.max(0, now.getTime() - checkIn.getTime());
  const elapsedDays = Math.floor(elapsedDiff / (1000 * 60 * 60 * 24));

  return {
    scheduledNights,
    elapsedDays,
    formattedDuration: `${scheduledNights} ${scheduledNights === 1 ? 'Night' : 'Nights'}`,
    displaySummary: `${checkIn.toISOString().split('T')[0]} → ${end.toISOString().split('T')[0]} (${scheduledNights} ${scheduledNights === 1 ? 'Night' : 'Nights'})`
  };
};

/**
 * Process Guest Check-In:
 * 1. Updates booking status to 'Checked-In'
 * 2. Updates room status to 'Occupied'
 * 3. Updates guest stayStatus to 'Checked-In'
 * 4. Logs to Check-In History
 * 5. Updates Analytics
 */
export const processGuestCheckIn = (bookingId, checkInData = {}) => {
  const bookings = getStoredBookings();
  let bookingIndex = -1;
  if (bookingId && String(bookingId) !== 'undefined') {
    bookingIndex = bookings.findIndex((b) => String(b.id) === String(bookingId));
  }

  // If no existing booking record found, fallback gracefully to new walk-in check-in
  if (bookingIndex === -1) {
    if (checkInData.roomNumber || checkInData.guestName) {
      return processNewWalkInCheckIn({
        ...checkInData,
        roomNumber: checkInData.roomNumber || '101',
        guestName: checkInData.guestName || 'Walk-In Guest'
      });
    }
    throw new Error(`Booking record "${bookingId}" not found.`);
  }

  const booking = bookings[bookingIndex];
  if (booking.status === 'Checked-In') {
    throw new Error(`Guest "${booking.guestName}" is already checked in to Room ${booking.roomNumber}.`);
  }

  const checkInTimestamp = new Date().toISOString();

  // 1. Update Booking Status
  booking.status = 'Checked-In';
  booking.actualCheckInTime = checkInTimestamp;
  booking.keyCardId = checkInData.keyCardId || `RFID-${booking.roomNumber}-A`;
  bookings[bookingIndex] = booking;
  saveStoredBookings(bookings);

  // 2. Update Room Availability to 'Occupied'
  try {
    const rooms = getStoredRooms();
    const room = rooms.find((r) => String(r.roomNumber) === String(booking.roomNumber));
    if (room) {
      room.status = 'Occupied';
      saveStoredRooms(rooms);
    }
  } catch (err) {
    console.warn('Room status update error on check-in:', err);
  }

  // 3. Update Guest status in Guest Directory
  try {
    const guests = getStoredGuests();
    const guest = guests.find(
      (g) => (booking.guestId && String(g.id) === String(booking.guestId)) ||
             g.email.toLowerCase() === booking.guestEmail.toLowerCase()
    );
    if (guest) {
      guest.stayStatus = 'Checked-In';
      guest.roomAssigned = `Suite ${booking.roomNumber} (${booking.suiteType})`;
      saveStoredGuests(guests);
    }
  } catch (err) {
    console.warn('Guest directory update error on check-in:', err);
  }

  // 4. Record Check-In History Entry
  const history = getStoredCheckInHistory();
  const stayDetails = computeStayDurationDetails(booking.checkIn, booking.checkOut);

  const historyRecord = {
    id: `CHK-IN-${Date.now().toString().slice(-4)}`,
    bookingId: booking.id,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    avatar: booking.avatar,
    roomNumber: booking.roomNumber,
    suiteType: booking.suiteType,
    vipStatus: booking.vipStatus || 'Standard Guest',
    checkInTime: checkInTimestamp,
    expectedCheckOut: booking.checkOut,
    stayDuration: stayDetails.formattedDuration,
    scheduledNights: stayDetails.scheduledNights,
    keyCardId: checkInData.keyCardId || `RFID-${booking.roomNumber}-A`,
    luggageCount: Number(checkInData.luggageCount) || 2,
    depositAmount: Number(checkInData.depositAmount) || 500,
    depositMethod: checkInData.depositMethod || 'Credit Card Pre-Authorization',
    receptionAgent: checkInData.receptionAgent || 'Front Desk Duty Manager',
    notes: checkInData.notes || 'Guest arrived safely. Key card issued and resort orientation provided.'
  };

  history.unshift(historyRecord);
  saveStoredCheckInHistory(history);

  // 5. Update Analytics
  try {
    const analytics = getStoredAnalytics();
    if (analytics.availableRooms > 0) {
      analytics.availableRooms -= 1;
      analytics.occupiedRooms += 1;
    }
    if (analytics.todayCheckIns > 0) {
      analytics.todayCheckIns -= 1;
    }
    saveStoredAnalytics(analytics);
  } catch (err) {
    console.warn('Analytics update error on check-in:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return { booking, historyRecord };
};

/**
 * Process New / Walk-In Guest Check-In directly from Check-In page:
 * 1. Creates a new booking record with status 'Checked-In'
 * 2. Updates room status to 'Occupied'
 * 3. Updates guest stayStatus to 'Checked-In'
 * 4. Logs to Check-In History with stay duration
 * 5. Updates Analytics
 */
export const processNewWalkInCheckIn = ({
  guestId = '',
  guestName,
  guestEmail = '',
  guestPhone = '',
  avatar = '',
  roomNumber,
  suiteType = '',
  pricePerNight = 250,
  checkInDate,
  checkOutDate,
  keyCardId,
  luggageCount = 2,
  depositAmount = 500,
  depositMethod = 'Credit Card Pre-Authorization',
  receptionAgent = 'Alexander Sterling (Front Desk Mgr)',
  notes = 'New Walk-In Check-In'
}) => {
  if (!guestName || !guestName.trim()) {
    throw new Error('Guest Name is required for check-in.');
  }
  if (!roomNumber) {
    throw new Error('Room Number is required for check-in.');
  }

  const bookings = getStoredBookings();
  const rooms = getStoredRooms();
  const targetRoom = rooms.find((r) => String(r.roomNumber) === String(roomNumber));

  if (targetRoom && targetRoom.status === 'Occupied') {
    throw new Error(`Room ${roomNumber} is currently occupied.`);
  }

  const checkIn = checkInDate || new Date().toISOString().split('T')[0];
  const checkOut = checkOutDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const nights = calculateNights(checkIn, checkOut);
  const rate = targetRoom ? (Number(targetRoom.pricePerNight) || pricePerNight) : pricePerNight;
  const subtotal = rate * nights;
  const tax = Math.round(subtotal * 0.12);
  const totalAmount = subtotal + tax + Math.round(subtotal * 0.05);

  const newBookingId = `BK-${Date.now().toString().slice(-4)}`;
  const checkInTimestamp = new Date().toISOString();
  const resolvedKeyCard = keyCardId || `RFID-${roomNumber}-A`;
  const resolvedSuiteType = targetRoom
    ? `${targetRoom.roomType || targetRoom.type || 'Suite'} (Room ${roomNumber})`
    : (suiteType || `Suite ${roomNumber}`);

  const newBooking = {
    id: newBookingId,
    guestId: guestId || `GST-${Date.now().toString().slice(-4)}`,
    guestName: guestName.trim(),
    guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@guest.hbms.com`,
    guestPhone: guestPhone || '+1 (555) 000-0000',
    avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestName)}`,
    roomNumber: String(roomNumber),
    suiteType: resolvedSuiteType,
    checkIn,
    checkOut,
    nights,
    stayDuration: `${nights} ${nights === 1 ? 'Night' : 'Nights'}`,
    guestsCount: targetRoom?.capacity || 2,
    status: 'Checked-In',
    actualCheckInTime: checkInTimestamp,
    keyCardId: resolvedKeyCard,
    amount: totalAmount,
    paymentStatus: 'Paid',
    createdAt: checkInTimestamp
  };

  // 1. Save new booking
  bookings.unshift(newBooking);
  saveStoredBookings(bookings);

  // 2. Set Room Availability to 'Occupied'
  if (targetRoom) {
    targetRoom.status = 'Occupied';
    saveStoredRooms(rooms);
  }

  // 3. Update or create Guest in directory
  try {
    const guests = getStoredGuests();
    let guest = guests.find(
      (g) => (guestId && String(g.id) === String(guestId)) ||
             (guestEmail && g.email?.toLowerCase() === guestEmail.toLowerCase()) ||
             g.name?.toLowerCase() === guestName.toLowerCase()
    );
    if (guest) {
      guest.stayStatus = 'Checked-In';
      guest.roomAssigned = `Suite ${roomNumber} (${resolvedSuiteType})`;
    } else {
      guest = {
        id: newBooking.guestId,
        name: guestName.trim(),
        email: newBooking.guestEmail,
        phone: newBooking.guestPhone,
        address: 'Direct Walk-In Patron',
        idProofNumber: `ID-${Date.now().toString().slice(-6)}`,
        nationality: 'Domestic',
        vipStatus: 'Standard Guest',
        stayStatus: 'Checked-In',
        roomAssigned: `Suite ${roomNumber} (${resolvedSuiteType})`,
        avatar: newBooking.avatar,
        registeredAt: checkInTimestamp
      };
      guests.unshift(guest);
    }
    saveStoredGuests(guests);
  } catch (err) {
    console.warn('Guest directory update error on walk-in check-in:', err);
  }

  // 4. Log to Check-In History
  const history = getStoredCheckInHistory();
  const historyRecord = {
    id: `CHK-IN-${Date.now().toString().slice(-4)}`,
    bookingId: newBooking.id,
    guestName: newBooking.guestName,
    guestEmail: newBooking.guestEmail,
    guestPhone: newBooking.guestPhone,
    avatar: newBooking.avatar,
    roomNumber: newBooking.roomNumber,
    suiteType: newBooking.suiteType,
    vipStatus: 'Standard Guest',
    checkInTime: checkInTimestamp,
    expectedCheckOut: newBooking.checkOut,
    stayDuration: newBooking.stayDuration,
    scheduledNights: newBooking.nights,
    keyCardId: resolvedKeyCard,
    luggageCount: Number(luggageCount) || 2,
    depositAmount: Number(depositAmount) || 500,
    depositMethod,
    receptionAgent,
    notes
  };

  history.unshift(historyRecord);
  saveStoredCheckInHistory(history);

  // 5. Update Analytics
  try {
    const analytics = getStoredAnalytics();
    analytics.occupiedRooms = (analytics.occupiedRooms || 0) + 1;
    analytics.availableRooms = Math.max(0, (analytics.availableRooms || 34) - 1);
    analytics.todayCheckIns = (analytics.todayCheckIns || 0) + 1;
    saveStoredAnalytics(analytics);
  } catch (e) {
    console.warn('Analytics update error:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return { booking: newBooking, historyRecord };
};

/**
 * Process Guest Check-Out:
 * 1. Updates booking status to 'Checked-Out'
 * 2. Updates room status to 'Available' (releasing the room)
 * 3. Updates guest stayStatus to 'Checked-Out'
 * 4. Logs to Check-Out History with actual stay duration & billing settlement
 * 5. Updates Analytics
 */
export const processGuestCheckOut = (bookingId, checkOutData = {}) => {
  const bookings = getStoredBookings();
  const bookingIndex = bookings.findIndex((b) => String(b.id) === String(bookingId));
  if (bookingIndex === -1) {
    throw new Error(`Booking record "${bookingId}" not found.`);
  }

  const booking = bookings[bookingIndex];
  if (booking.status === 'Checked-Out') {
    throw new Error(`Guest "${booking.guestName}" has already checked out.`);
  }

  const checkOutTimestamp = new Date().toISOString();
  const stayDetails = computeStayDurationDetails(booking.checkIn, checkOutTimestamp);

  // 1. Update Booking Status
  booking.status = 'Checked-Out';
  booking.actualCheckOutTime = checkOutTimestamp;
  booking.paymentStatus = 'Paid in Full';
  bookings[bookingIndex] = booking;
  saveStoredBookings(bookings);

  // 2. Update Room Availability to 'Available'
  try {
    const rooms = getStoredRooms();
    const room = rooms.find((r) => String(r.roomNumber) === String(booking.roomNumber));
    if (room) {
      room.status = 'Available';
      saveStoredRooms(rooms);
    }
  } catch (err) {
    console.warn('Room release error on check-out:', err);
  }

  // 3. Update Guest in Guest Directory
  try {
    const guests = getStoredGuests();
    const guest = guests.find(
      (g) => (booking.guestId && String(g.id) === String(booking.guestId)) ||
             g.email.toLowerCase() === booking.guestEmail.toLowerCase()
    );
    if (guest) {
      guest.stayStatus = 'Checked-Out';
      guest.roomAssigned = 'Unassigned';
      saveStoredGuests(guests);
    }
  } catch (err) {
    console.warn('Guest directory update on check-out:', err);
  }

  // 4. Record Check-Out History Entry
  const history = getStoredCheckOutHistory();
  const incidentals = Number(checkOutData.incidentalsAmount) || 0;
  const roomAmount = Number(booking.amount) || 1200;
  const finalTotal = roomAmount + incidentals;

  const historyRecord = {
    id: `CHK-OUT-${Date.now().toString().slice(-4)}`,
    bookingId: booking.id,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    avatar: booking.avatar,
    roomNumber: booking.roomNumber,
    suiteType: booking.suiteType,
    checkInDate: booking.checkIn,
    checkOutTime: checkOutTimestamp,
    stayDuration: stayDetails.formattedDuration,
    nightsStayed: stayDetails.scheduledNights,
    keyCardReturned: checkOutData.keyCardReturned !== false,
    keyCardId: booking.keyCardId || `RFID-${booking.roomNumber}-A`,
    roomInspectionStatus: checkOutData.roomInspectionStatus || 'Passed (Excellent Condition)',
    incidentalsAmount: incidentals,
    roomTotalAmount: roomAmount,
    finalSettledAmount: finalTotal,
    paymentStatus: 'Paid in Full',
    receptionAgent: checkOutData.receptionAgent || 'Front Desk Duty Manager',
    feedbackRating: Number(checkOutData.feedbackRating) || 5,
    feedbackNotes: checkOutData.feedbackNotes ? checkOutData.feedbackNotes.trim() : 'Guest expressed complete satisfaction with stay and resort amenities.'
  };

  history.unshift(historyRecord);
  saveStoredCheckOutHistory(history);

  // 5. Update Analytics
  try {
    const analytics = getStoredAnalytics();
    analytics.availableRooms += 1;
    if (analytics.occupiedRooms > 0) {
      analytics.occupiedRooms -= 1;
    }
    analytics.todayCheckOuts = (analytics.todayCheckOuts || 12) + 1;
    if (incidentals > 0) {
      analytics.revenue.grossRevenue = (analytics.revenue.grossRevenue || 248500) + incidentals;
    }
    saveStoredAnalytics(analytics);
  } catch (err) {
    console.warn('Analytics update error on check-out:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hbms_data_updated'));
  }

  return { booking, historyRecord };
};
