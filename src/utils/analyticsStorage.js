// LocalStorage keys for Module 2: Dashboard Analytics
export const ANALYTICS_STORAGE_KEY = 'hbms_analytics';
export const BOOKINGS_STORAGE_KEY = 'hbms_bookings';

export const INITIAL_ANALYTICS = {
  totalRooms: 120,
  availableRooms: 34,
  occupiedRooms: 86,
  totalGuests: 214,
  todayCheckIns: 18,
  todayCheckOuts: 12,
  totalBookings: 438,
  revenue: {
    grossRevenue: 248500,
    monthlyTarget: 280000,
    adr: 320, // Average Daily Rate ($)
    revPar: 229, // Revenue Per Available Room ($)
    growthRate: '+14.6%',
    categories: [
      { name: 'Suite & Room Bookings', amount: 168980, percentage: 68, color: 'bg-amber-500' },
      { name: 'Fine Dining & Room Service', amount: 44730, percentage: 18, color: 'bg-emerald-500' },
      { name: 'Luxury Spa & Wellness', amount: 22365, percentage: 9, color: 'bg-purple-500' },
      { name: 'Private Events & Banquets', amount: 12425, percentage: 5, color: 'bg-blue-500' }
    ],
    monthlyTrends: [
      { month: 'Oct', revenue: 198000, bookings: 320 },
      { month: 'Nov', revenue: 215000, bookings: 355 },
      { month: 'Dec', revenue: 278000, bookings: 440 },
      { month: 'Jan', revenue: 232000, bookings: 380 },
      { month: 'Feb', revenue: 210000, bookings: 345 },
      { month: 'Mar', revenue: 242000, bookings: 395 },
      { month: 'Apr', revenue: 225000, bookings: 360 },
      { month: 'May', revenue: 254000, bookings: 410 },
      { month: 'Jun', revenue: 268000, bookings: 430 },
      { month: 'Jul', revenue: 285000, bookings: 460 },
      { month: 'Aug', revenue: 274000, bookings: 445 },
      { month: 'Sep', revenue: 248500, bookings: 438 }
    ]
  }
};

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-9021',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.vance@luxury.com',
    guestPhone: '+1 (555) 234-8891',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    suiteType: 'Presidential Penthouse (Suite 701)',
    roomNumber: '701',
    checkIn: '2026-09-23',
    checkOut: '2026-09-28',
    stayDuration: '5 Nights',
    guestsCount: 2,
    status: 'Checked-In',
    amount: 4250,
    paymentStatus: 'Paid',
    createdAt: '2026-09-18T14:20:00.000Z'
  },
  {
    id: 'BK-9022',
    guestName: 'Marcus Sterling',
    guestEmail: 'm.sterling@invest.com',
    guestPhone: '+1 (555) 782-9904',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    suiteType: 'Royal Oceanfront Villa (Suite 404)',
    roomNumber: '404',
    checkIn: '2026-09-23',
    checkOut: '2026-09-26',
    stayDuration: '3 Nights',
    guestsCount: 3,
    status: 'Today Check-In',
    amount: 2800,
    paymentStatus: 'Paid',
    createdAt: '2026-09-19T09:15:00.000Z'
  },
  {
    id: 'BK-9023',
    guestName: 'Dr. Clara Thorne',
    guestEmail: 'clara.thorne@medcenter.org',
    guestPhone: '+1 (555) 671-3321',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    suiteType: 'Executive Diplomat Suite (Suite 302)',
    roomNumber: '302',
    checkIn: '2026-09-24',
    checkOut: '2026-09-29',
    stayDuration: '5 Nights',
    guestsCount: 2,
    status: 'Confirmed',
    amount: 3100,
    paymentStatus: 'Deposit Paid',
    createdAt: '2026-09-20T11:45:00.000Z'
  },
  {
    id: 'BK-9024',
    guestName: 'Liam O’Connor',
    guestEmail: 'liam.oconnor@creative.co',
    guestPhone: '+1 (555) 890-4412',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    suiteType: 'Deluxe Heritage King (Suite 112)',
    roomNumber: '112',
    checkIn: '2026-09-25',
    checkOut: '2026-09-27',
    stayDuration: '2 Nights',
    guestsCount: 1,
    status: 'Confirmed',
    amount: 1650,
    paymentStatus: 'Paid',
    createdAt: '2026-09-21T16:00:00.000Z'
  },
  {
    id: 'BK-9025',
    guestName: 'Elena Rostova',
    guestEmail: 'elena.rostova@globalarts.com',
    guestPhone: '+1 (555) 432-1198',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    suiteType: 'Grand Horizon Suite (Suite 505)',
    roomNumber: '505',
    checkIn: '2026-09-26',
    checkOut: '2026-09-30',
    stayDuration: '4 Nights',
    guestsCount: 2,
    status: 'Pending',
    amount: 2400,
    paymentStatus: 'Pending',
    createdAt: '2026-09-22T08:30:00.000Z'
  },
  {
    id: 'BK-9026',
    guestName: 'Harrison Ford-Smith',
    guestEmail: 'harrison.smith@aviation.com',
    guestPhone: '+1 (555) 912-3344',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    suiteType: 'Lagoon Garden Bungalow (Suite 208)',
    roomNumber: '208',
    checkIn: '2026-09-27',
    checkOut: '2026-10-02',
    stayDuration: '5 Nights',
    guestsCount: 4,
    status: 'Confirmed',
    amount: 3800,
    paymentStatus: 'Paid',
    createdAt: '2026-09-22T12:00:00.000Z'
  }
];

/**
 * Initialize analytics and bookings in LocalStorage if not present
 */
export const initializeAnalyticsStorage = () => {
  try {
    const existingAnalytics = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!existingAnalytics) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(INITIAL_ANALYTICS));
    }

    const existingBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!existingBookings) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
    }
  } catch (error) {
    console.error('Failed to initialize analytics storage:', error);
  }
};

/**
 * Get analytics metrics
 */
export const getStoredAnalytics = () => {
  try {
    initializeAnalyticsStorage();
    const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : INITIAL_ANALYTICS;
    
    // Ensure revenue categories and monthly trends are populated
    if (!parsed.revenue) {
      parsed.revenue = INITIAL_ANALYTICS.revenue;
    } else {
      if (!Array.isArray(parsed.revenue.categories) || parsed.revenue.categories.length === 0) {
        parsed.revenue.categories = INITIAL_ANALYTICS.revenue.categories;
      }
      if (!Array.isArray(parsed.revenue.monthlyTrends) || parsed.revenue.monthlyTrends.length === 0) {
        parsed.revenue.monthlyTrends = INITIAL_ANALYTICS.revenue.monthlyTrends;
      }
    }
    return parsed;
  } catch (error) {
    console.error('Error reading analytics storage:', error);
    return INITIAL_ANALYTICS;
  }
};

/**
 * Save analytics metrics
 */
export const saveStoredAnalytics = (analytics) => {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving analytics storage:', error);
  }
};

/**
 * Get all bookings
 */
export const getStoredBookings = () => {
  try {
    initializeAnalyticsStorage();
    const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_BOOKINGS;
  } catch (error) {
    console.error('Error reading bookings storage:', error);
    return INITIAL_BOOKINGS;
  }
};

/**
 * Save all bookings
 */
export const saveStoredBookings = (bookings) => {
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings storage:', error);
  }
};

/**
 * Add a new booking and automatically update rooms and revenue totals
 */
export const addNewBooking = (bookingData) => {
  const bookings = getStoredBookings();
  const analytics = getStoredAnalytics();

  const newBooking = {
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName: bookingData.guestName.trim(),
    guestEmail: bookingData.guestEmail.trim().toLowerCase(),
    guestPhone: bookingData.guestPhone ? bookingData.guestPhone.trim() : '+1 (555) 000-0000',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(bookingData.guestName)}`,
    suiteType: bookingData.suiteType || 'Deluxe Heritage King (Suite 115)',
    roomNumber: bookingData.roomNumber || String(Math.floor(101 + Math.random() * 600)),
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    stayDuration: bookingData.stayDuration || '3 Nights',
    guestsCount: Number(bookingData.guestsCount) || 2,
    status: bookingData.status || 'Confirmed',
    amount: Number(bookingData.amount) || 1850,
    paymentStatus: bookingData.paymentStatus || 'Paid',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  saveStoredBookings(bookings);

  // Recalculate metrics
  if (analytics.availableRooms > 0) {
    analytics.availableRooms -= 1;
    analytics.occupiedRooms += 1;
  }
  analytics.totalBookings += 1;
  analytics.totalGuests += newBooking.guestsCount;
  analytics.revenue.grossRevenue += newBooking.amount;

  saveStoredAnalytics(analytics);
  return { newBooking, updatedAnalytics: analytics };
};

/**
 * Quick check-in a booking
 */
export const checkInGuestStorage = (bookingId) => {
  const bookings = getStoredBookings();
  const analytics = getStoredAnalytics();

  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index !== -1) {
    bookings[index].status = 'Checked-In';
    saveStoredBookings(bookings);

    if (analytics.todayCheckIns > 0) {
      analytics.todayCheckIns -= 1;
    }
    saveStoredAnalytics(analytics);
    return bookings[index];
  }
  return null;
};
