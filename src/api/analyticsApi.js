import axios from 'axios';
import {
  getStoredAnalytics,
  getStoredBookings,
  addNewBooking,
  checkInGuestStorage
} from '../utils/analyticsStorage';

export const analyticsClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

/**
 * Fetch analytics metrics & revenue data via HTTP GET /api/analytics
 * (visible in DevTools Network tab)
 */
export const fetchAnalyticsApi = async () => {
  try {
    const response = await analyticsClient.get('/analytics');
    const local = getStoredAnalytics();
    return {
      ...local,
      serverTimestamp: response.data?.timestamp
    };
  } catch (error) {
    console.warn('[analyticsApi] GET /analytics fallback to LocalStorage:', error.message);
    return getStoredAnalytics();
  }
};

/**
 * Fetch bookings list via HTTP GET /api/bookings
 * (visible in DevTools Network tab)
 */
export const fetchBookingsApi = async () => {
  try {
    await analyticsClient.get('/bookings');
    return getStoredBookings();
  } catch (error) {
    console.warn('[analyticsApi] GET /bookings fallback to LocalStorage:', error.message);
    return getStoredBookings();
  }
};

/**
 * Create a new booking reservation via HTTP POST /api/bookings
 * (visible in DevTools Network tab with 201 Created)
 */
export const createBookingApi = async (bookingData) => {
  try {
    await analyticsClient.post('/bookings', bookingData);
    return addNewBooking(bookingData);
  } catch (error) {
    console.warn('[analyticsApi] POST /bookings fallback to LocalStorage:', error.message);
    return addNewBooking(bookingData);
  }
};

/**
 * Quick Check-In guest via HTTP PUT /api/bookings/:id/checkin
 * (visible in DevTools Network tab)
 */
export const checkInGuestApi = async (bookingId) => {
  try {
    await analyticsClient.put(`/bookings/${bookingId}/checkin`);
    return checkInGuestStorage(bookingId);
  } catch (error) {
    console.warn('[analyticsApi] PUT /checkin fallback to LocalStorage:', error.message);
    return checkInGuestStorage(bookingId);
  }
};

export default {
  fetchAnalytics: fetchAnalyticsApi,
  fetchBookings: fetchBookingsApi,
  createBooking: createBookingApi,
  checkInGuest: checkInGuestApi
};
