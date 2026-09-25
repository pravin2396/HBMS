import { getStoredRooms } from './roomStorage';
import { getStoredBookings } from './bookingStorage';
import { getStoredGuests } from './guestStorage';
import { getStoredPayments } from './paymentStorage';
import { getStoredAnalytics } from './analyticsStorage';

export const REPORT_MONTHS = [
  { month: 'Oct', revenue: 198000, bookings: 320, occupancy: 72 },
  { month: 'Nov', revenue: 215000, bookings: 355, occupancy: 75 },
  { month: 'Dec', revenue: 278000, bookings: 440, occupancy: 91 },
  { month: 'Jan', revenue: 232000, bookings: 380, occupancy: 78 },
  { month: 'Feb', revenue: 210000, bookings: 345, occupancy: 74 },
  { month: 'Mar', revenue: 242000, bookings: 395, occupancy: 82 },
  { month: 'Apr', revenue: 225000, bookings: 360, occupancy: 76 },
  { month: 'May', revenue: 254000, bookings: 410, occupancy: 84 },
  { month: 'Jun', revenue: 268000, bookings: 430, occupancy: 88 },
  { month: 'Jul', revenue: 285000, bookings: 460, occupancy: 94 },
  { month: 'Aug', revenue: 274000, bookings: 445, occupancy: 90 },
  { month: 'Sep', revenue: 248500, bookings: 438, occupancy: 86 }
];

export const DEPARTMENT_REVENUE = [
  { name: 'Suite & Room Bookings', amount: 168980, percentage: 68, color: 'bg-amber-500', barColor: '#f59e0b' },
  { name: 'Fine Dining & Room Service', amount: 44730, percentage: 18, color: 'bg-emerald-500', barColor: '#10b981' },
  { name: 'Luxury Spa & Wellness', amount: 22365, percentage: 9, color: 'bg-purple-500', barColor: '#a855f7' },
  { name: 'Private Events & Banquets', amount: 12425, percentage: 5, color: 'bg-blue-500', barColor: '#3b82f6' }
];

/**
 * Generate full consolidated hotel report metrics
 */
export const getConsolidatedReportData = () => {
  const rooms = getStoredRooms();
  const bookings = getStoredBookings();
  const guests = getStoredGuests();
  const payments = getStoredPayments();
  const analytics = getStoredAnalytics();

  // 1. Room Occupancy
  const totalRooms = rooms.length > 0 ? rooms.length : 120;
  const occupiedRooms = rooms.filter(
    (r) => r && String(r.status).toLowerCase() === 'occupied'
  ).length || 86;
  const availableRooms = Math.max(0, totalRooms - occupiedRooms);
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  // 2. Total Revenue & Financial Metrics
  const baseRevenue = 248500;
  const paidPayments = payments
    .filter((p) => p.status === 'Paid' || p.status === 'Partially Paid')
    .reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0);
  const totalRevenue = Math.max(baseRevenue, baseRevenue + paidPayments - 15000);
  const monthlyTarget = 280000;
  const revenueProgress = Math.min(100, Math.round((totalRevenue / monthlyTarget) * 100));
  const adr = Math.round(totalRevenue / (occupiedRooms * 30 || 1)) || 320; // Average Daily Rate
  const revPar = Math.round((totalRevenue / (totalRooms * 30 || 1))) || 229; // Revenue Per Available Room

  // 3. Most Booked Room Type ranking
  const suiteCounts = {};
  const suiteRevenue = {};

  bookings.forEach((b) => {
    const rawType = b.suiteType || 'Deluxe Room';
    // Clean type name
    let typeName = rawType;
    if (rawType.includes('Presidential')) typeName = 'Presidential Penthouse';
    else if (rawType.includes('Royal')) typeName = 'Royal Oceanfront Villa';
    else if (rawType.includes('Diplomat') || rawType.includes('Executive')) typeName = 'Executive Diplomat Suite';
    else if (rawType.includes('Horizon')) typeName = 'Grand Horizon Family Suite';
    else if (rawType.includes('Zen')) typeName = 'Zen Garden Deluxe Suite';
    else if (rawType.includes('Courtyard') || rawType.includes('Deluxe')) typeName = 'Deluxe Room';

    suiteCounts[typeName] = (suiteCounts[typeName] || 0) + 1;
    suiteRevenue[typeName] = (suiteRevenue[typeName] || 0) + (Number(b.amount) || 1200);
  });

  // Ensure default distribution if few bookings
  const defaultSuiteData = [
    { type: 'Royal Oceanfront Villa', count: 142, revenue: 106500, share: 32 },
    { type: 'Presidential Penthouse', count: 98, revenue: 63700, share: 22 },
    { type: 'Executive Diplomat Suite', count: 86, revenue: 43000, share: 20 },
    { type: 'Grand Horizon Family Suite', count: 64, revenue: 35200, share: 15 },
    { type: 'Deluxe Room', count: 48, revenue: 16800, share: 11 }
  ];

  const mostBookedRoomTypes = Object.keys(suiteCounts).length > 2
    ? Object.keys(suiteCounts)
        .map((type) => {
          const count = suiteCounts[type];
          const rev = suiteRevenue[type];
          return {
            type,
            count,
            revenue: rev,
            share: Math.round((count / bookings.length) * 100) || 15
          };
        })
        .sort((a, b) => b.count - a.count)
    : defaultSuiteData;

  const topBookedRoom = mostBookedRoomTypes[0] || defaultSuiteData[0];

  // 4. Active Guests Analysis
  const activeCheckedInGuests = bookings.filter((b) => b.status === 'Checked-In');
  const activeGuestsCount = (activeCheckedInGuests.length * 2) || 42; // Guests in stay
  const totalPatrons = guests.length || 214;

  const vipBreakdown = [
    { tier: 'Diamond Elite', count: 28, percentage: 35, color: 'bg-amber-400' },
    { tier: 'VIP Platinum', count: 24, percentage: 30, color: 'bg-purple-400' },
    { tier: 'Gold VIP', count: 18, percentage: 22, color: 'bg-yellow-500' },
    { tier: 'Standard Luxury', count: 10, percentage: 13, color: 'bg-slate-400' }
  ];

  // 5. Booking Trends
  const totalBookingsCount = 438 + (bookings.length - 6);
  const completedBookings = bookings.filter(
    (b) => b.status === 'Completed' || b.status === 'Checked-Out'
  ).length;
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;
  const avgStayNights = 3.8;
  const bookingLeadDays = 14;
  const cancellationRate = '4.2%';

  // 6. Monthly Trends with current month dynamic integration
  const monthlyTrends = REPORT_MONTHS.map((m) => {
    if (m.month === 'Sep') {
      return {
        ...m,
        revenue: totalRevenue,
        bookings: totalBookingsCount,
        occupancy: occupancyRate
      };
    }
    return m;
  });

  return {
    totalRevenue,
    monthlyTarget,
    revenueProgress,
    adr,
    revPar,
    totalRooms,
    occupiedRooms,
    availableRooms,
    occupancyRate,
    mostBookedRoomTypes,
    topBookedRoom,
    activeGuestsCount,
    totalPatrons,
    vipBreakdown,
    totalBookingsCount,
    completedBookings,
    cancelledBookings,
    avgStayNights,
    bookingLeadDays,
    cancellationRate,
    monthlyTrends,
    departmentRevenue: DEPARTMENT_REVENUE
  };
};
