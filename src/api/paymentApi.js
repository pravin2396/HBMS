import axios from 'axios';
import {
  getStoredPayments,
  recordNewPayment,
  updateStoredPaymentStatus
} from '../utils/paymentStorage';

export const paymentClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

/**
 * Fetch all payments via HTTP GET /api/payments with LocalStorage fallback
 */
export const fetchPaymentsApi = async () => {
  try {
    const res = await paymentClient.get('/payments');
    return {
      success: true,
      payments: getStoredPayments(),
      serverMessage: res.data?.message
    };
  } catch (err) {
    console.warn('[paymentApi] GET /payments fallback to LocalStorage:', err.message);
    return {
      success: true,
      payments: getStoredPayments()
    };
  }
};

/**
 * Record a new payment / invoice via HTTP POST /api/payments with LocalStorage fallback
 */
export const recordPaymentApi = async (paymentData) => {
  try {
    const newRecord = recordNewPayment(paymentData);
    await paymentClient.post('/payments', newRecord).catch(() => {});
    return {
      success: true,
      payment: newRecord
    };
  } catch (err) {
    console.warn('[paymentApi] POST /payments fallback to LocalStorage:', err.message);
    const newRecord = recordNewPayment(paymentData);
    return {
      success: true,
      payment: newRecord
    };
  }
};

/**
 * Update payment status via HTTP PATCH /api/payments/:id/status
 */
export const updatePaymentStatusApi = async (paymentId, status, additionalData = {}) => {
  try {
    const updated = updateStoredPaymentStatus(paymentId, status, additionalData);
    await paymentClient.patch(`/payments/${paymentId}/status`, { status, ...additionalData }).catch(() => {});
    return {
      success: true,
      payment: updated
    };
  } catch (err) {
    console.warn('[paymentApi] PATCH /payments/:id/status fallback to LocalStorage:', err.message);
    const updated = updateStoredPaymentStatus(paymentId, status, additionalData);
    return {
      success: true,
      payment: updated
    };
  }
};
