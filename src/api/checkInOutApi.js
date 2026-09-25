import axios from 'axios';
import {
  getStoredCheckInHistory,
  getStoredCheckOutHistory,
  processGuestCheckIn,
  processNewWalkInCheckIn,
  processGuestCheckOut
} from '../utils/checkInOutStorage';

export const checkInOutClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

/**
 * Fetch Check-In History via HTTP GET /api/checkin-history
 */
export const fetchCheckInHistoryApi = async () => {
  try {
    const res = await checkInOutClient.get('/checkin-history');
    return {
      success: true,
      history: getStoredCheckInHistory(),
      serverMessage: res.data?.message
    };
  } catch (err) {
    console.warn('[checkInOutApi] GET /checkin-history fallback to LocalStorage:', err.message);
    return {
      success: true,
      history: getStoredCheckInHistory()
    };
  }
};

/**
 * Fetch Check-Out History via HTTP GET /api/checkout-history
 */
export const fetchCheckOutHistoryApi = async () => {
  try {
    const res = await checkInOutClient.get('/checkout-history');
    return {
      success: true,
      history: getStoredCheckOutHistory(),
      serverMessage: res.data?.message
    };
  } catch (err) {
    console.warn('[checkInOutApi] GET /checkout-history fallback to LocalStorage:', err.message);
    return {
      success: true,
      history: getStoredCheckOutHistory()
    };
  }
};

/**
 * Process Guest Check-In via HTTP POST /api/checkin
 */
export const checkInGuestApi = async (bookingId, checkInData = {}) => {
  try {
    await checkInOutClient.post('/checkin', { bookingId, ...checkInData });
    const result = processGuestCheckIn(bookingId, checkInData);
    return {
      success: true,
      ...result
    };
  } catch (err) {
    console.warn('[checkInOutApi] POST /checkin fallback to LocalStorage:', err.message);
    const result = processGuestCheckIn(bookingId, checkInData);
    return {
      success: true,
      ...result
    };
  }
};

/**
 * Process Guest Check-Out via HTTP POST /api/checkout
 */
export const checkOutGuestApi = async (bookingId, checkOutData = {}) => {
  try {
    await checkInOutClient.post('/checkout', { bookingId, ...checkOutData });
    const result = processGuestCheckOut(bookingId, checkOutData);
    return {
      success: true,
      ...result
    };
  } catch (err) {
    console.warn('[checkInOutApi] POST /checkout fallback to LocalStorage:', err.message);
    const result = processGuestCheckOut(bookingId, checkOutData);
    return {
      success: true,
      ...result
    };
  }
};

/**
 * Process New Walk-In Check-In via HTTP POST /api/checkin-walkin
 */
export const checkInNewWalkInGuestApi = async (walkInData) => {
  try {
    await checkInOutClient.post('/checkin-walkin', walkInData);
    const result = processNewWalkInCheckIn(walkInData);
    return {
      success: true,
      ...result
    };
  } catch (err) {
    console.warn('[checkInOutApi] POST /checkin-walkin fallback to LocalStorage:', err.message);
    const result = processNewWalkInCheckIn(walkInData);
    return {
      success: true,
      ...result
    };
  }
};

export default {
  fetchCheckInHistory: fetchCheckInHistoryApi,
  fetchCheckOutHistory: fetchCheckOutHistoryApi,
  checkInGuest: checkInGuestApi,
  checkInNewWalkInGuest: checkInNewWalkInGuestApi,
  checkOutGuest: checkOutGuestApi
};
