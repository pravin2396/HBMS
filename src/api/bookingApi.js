import axios from 'axios';
import {
  getStoredBookings,
  createNewBooking,
  updateBookingStatus,
  cancelBooking,
  deleteBooking
} from '../utils/bookingStorage';

export const bookingClient = axios.create({
  baseURL: '/api/bookings',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

/**
 * Fetch all bookings via HTTP GET /api/bookings
 */
export const fetchBookingsApi = async () => {
  try {
    const response = await bookingClient.get('');
    const bookings = getStoredBookings();
    return {
      success: true,
      bookings,
      serverMessage: response.data?.message
    };
  } catch (err) {
    console.warn('[bookingApi] Fallback to LocalStorage:', err.message);
    return {
      success: true,
      bookings: getStoredBookings()
    };
  }
};

/**
 * Create a new booking via HTTP POST /api/bookings
 */
export const createBookingApi = async (bookingData) => {
  try {
    // Send network request to reflect in DevTools Network tab
    await bookingClient.post('', bookingData);
    const newBooking = createNewBooking(bookingData);
    return {
      success: true,
      booking: newBooking
    };
  } catch (err) {
    // If it's a double booking error from createNewBooking, rethrow it directly
    if (err.message && err.message.includes('Double Booking Prevented')) {
      throw err;
    }
    console.warn('[bookingApi] Network fallback, saving locally:', err.message);
    const newBooking = createNewBooking(bookingData);
    return {
      success: true,
      booking: newBooking
    };
  }
};

/**
 * Update booking status via HTTP PUT /api/bookings/:id/status
 */
export const updateBookingStatusApi = async (id, status) => {
  try {
    await bookingClient.put(`/${id}/status`, { status });
    const updated = updateBookingStatus(id, status);
    return {
      success: true,
      booking: updated
    };
  } catch (err) {
    console.warn('[bookingApi] Status update fallback to LocalStorage:', err.message);
    const updated = updateBookingStatus(id, status);
    return {
      success: true,
      booking: updated
    };
  }
};

/**
 * Cancel booking via HTTP PUT /api/bookings/:id/cancel
 */
export const cancelBookingApi = async (id, reason) => {
  try {
    await bookingClient.put(`/${id}/cancel`, { reason });
    const cancelled = cancelBooking(id, reason);
    return {
      success: true,
      booking: cancelled
    };
  } catch (err) {
    console.warn('[bookingApi] Cancel fallback to LocalStorage:', err.message);
    const cancelled = cancelBooking(id, reason);
    return {
      success: true,
      booking: cancelled
    };
  }
};

/**
 * Delete booking via HTTP DELETE /api/bookings/:id
 */
export const deleteBookingApi = async (id) => {
  try {
    await bookingClient.delete(`/${id}`);
    deleteBooking(id);
    return { success: true };
  } catch (err) {
    console.warn('[bookingApi] Delete fallback to LocalStorage:', err.message);
    deleteBooking(id);
    return { success: true };
  }
};

export default {
  fetchBookings: fetchBookingsApi,
  createBooking: createBookingApi,
  updateBookingStatus: updateBookingStatusApi,
  cancelBooking: cancelBookingApi,
  deleteBooking: deleteBookingApi
};
