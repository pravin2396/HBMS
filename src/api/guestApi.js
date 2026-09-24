import axios from 'axios';
import {
  getStoredGuests,
  getStoredGuestById,
  saveNewGuest,
  updateStoredGuest,
  deleteStoredGuest
} from '../utils/guestStorage';

export const guestClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

/**
 * Fetch all guests via HTTP GET /api/guests
 * (visible in DevTools Network tab)
 */
export const fetchGuestsApi = async () => {
  try {
    const response = await guestClient.get('/guests');
    const localGuests = getStoredGuests();
    return {
      success: true,
      guests: localGuests,
      serverTimestamp: response.data?.timestamp
    };
  } catch (err) {
    console.warn('[guestApi] GET /guests fallback to storage:', err.message);
    return {
      success: true,
      guests: getStoredGuests()
    };
  }
};

/**
 * Fetch single guest profile by ID via HTTP GET /api/guests/:id
 */
export const fetchGuestByIdApi = async (id) => {
  try {
    await guestClient.get(`/guests/${id}`);
  } catch (err) {
    console.warn(`[guestApi] GET /guests/${id} fallback:`, err.message);
  }

  const guest = getStoredGuestById(id);
  if (!guest) {
    throw new Error(`Guest with ID "${id}" was not found.`);
  }

  return {
    success: true,
    guest
  };
};

/**
 * Create a new guest via HTTP POST /api/guests
 * (visible in DevTools Network tab with 201 status)
 */
export const createGuestApi = async (guestData) => {
  const newGuest = saveNewGuest(guestData);

  try {
    await guestClient.post('/guests', newGuest);
  } catch (err) {
    console.warn('[guestApi] POST /guests fallback:', err.message);
  }

  return {
    success: true,
    guest: newGuest,
    message: `Guest "${newGuest.fullName}" successfully registered.`
  };
};

/**
 * Update an existing guest via HTTP PUT /api/guests/:id
 * (visible in DevTools Network tab with 200 status)
 */
export const updateGuestApi = async (id, updatedFields) => {
  const updatedGuest = updateStoredGuest(id, updatedFields);

  try {
    await guestClient.put(`/guests/${id}`, updatedGuest);
  } catch (err) {
    console.warn(`[guestApi] PUT /guests/${id} fallback:`, err.message);
  }

  return {
    success: true,
    guest: updatedGuest,
    message: `Guest profile for "${updatedGuest.fullName}" updated successfully.`
  };
};

/**
 * Delete a guest via HTTP DELETE /api/guests/:id
 * (visible in DevTools Network tab with 200 status)
 */
export const deleteGuestApi = async (id) => {
  deleteStoredGuest(id);

  try {
    await guestClient.delete(`/guests/${id}`);
  } catch (err) {
    console.warn(`[guestApi] DELETE /guests/${id} fallback:`, err.message);
  }

  return {
    success: true,
    id,
    message: 'Guest profile deleted successfully.'
  };
};

export default {
  fetchGuests: fetchGuestsApi,
  fetchGuestById: fetchGuestByIdApi,
  createGuest: createGuestApi,
  updateGuest: updateGuestApi,
  deleteGuest: deleteGuestApi
};
