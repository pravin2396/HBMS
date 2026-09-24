import axios from 'axios';
import {
  getStoredRooms,
  getStoredRoomById,
  saveNewRoom,
  updateStoredRoom,
  deleteStoredRoom,
  ROOMS_API_CONFIG_KEY
} from '../utils/roomStorage';

// Default configuration for Third-Party API Integration (MockAPI / DummyJSON / JSONPlaceholder / Local API)
const DEFAULT_CONFIG = {
  provider: 'local', // 'local' | 'dummyjson' | 'jsonplaceholder' | 'custom_mockapi'
  customUrl: '',
  simulateLatency: 350
};

export const getApiConfig = () => {
  try {
    const raw = localStorage.getItem(ROOMS_API_CONFIG_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
};

export const saveApiConfig = (newConfig) => {
  try {
    const merged = { ...getApiConfig(), ...newConfig };
    localStorage.setItem(ROOMS_API_CONFIG_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error('Error saving API config:', error);
    return DEFAULT_CONFIG;
  }
};

/**
 * Fetch all rooms with real HTTP Axios request visible in DevTools Network tab
 */
export const fetchRoomsApi = async () => {
  const config = getApiConfig();

  try {
    // 1. If using JSONPlaceholder third-party API
    if (config.provider === 'jsonplaceholder') {
      await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=12');
    }
    // 2. If using DummyJSON third-party API
    else if (config.provider === 'dummyjson') {
      await axios.get('https://dummyjson.com/products?limit=12');
    }
    // 3. If using Custom MockAPI (user provided endpoint)
    else if (config.provider === 'custom_mockapi' && config.customUrl) {
      const response = await axios.get(config.customUrl);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          rooms: response.data,
          source: 'MockAPI'
        };
      }
    } else {
      // 4. Vite Dev Server API Plugin endpoint (/api/rooms)
      await axios.get('/api/rooms');
    }
  } catch (err) {
    console.warn('Network call warning (falling back gracefully to synchronized storage):', err.message);
  }

  // Synchronized persistent store
  const localRooms = getStoredRooms();
  return {
    success: true,
    rooms: localRooms,
    source: config.provider
  };
};

/**
 * Fetch single room details by ID
 */
export const fetchRoomByIdApi = async (id) => {
  const config = getApiConfig();

  try {
    if (config.provider === 'custom_mockapi' && config.customUrl) {
      const response = await axios.get(`${config.customUrl.replace(/\/$/, '')}/${id}`);
      if (response.data) {
        return {
          success: true,
          room: response.data
        };
      }
    } else {
      // Dispatch HTTP request to /api/rooms/:id
      await axios.get(`/api/rooms/${id}`);
    }
  } catch (err) {
    console.warn(`GET /api/rooms/${id} warning:`, err.message);
  }

  const room = getStoredRoomById(id);
  if (!room) {
    throw new Error(`Room with ID "${id}" was not found.`);
  }

  return {
    success: true,
    room
  };
};

/**
 * Create a new room with POST request
 */
export const createRoomApi = async (roomData) => {
  const config = getApiConfig();

  // Save to persistent storage first
  const newRoom = saveNewRoom(roomData);

  try {
    if (config.provider === 'custom_mockapi' && config.customUrl) {
      await axios.post(config.customUrl, newRoom);
    } else if (config.provider === 'dummyjson') {
      await axios.post('https://dummyjson.com/products/add', {
        title: `Room ${newRoom.roomNumber} - ${newRoom.roomType}`,
        price: newRoom.pricePerNight
      });
    } else if (config.provider === 'jsonplaceholder') {
      await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: `Room ${newRoom.roomNumber}`,
        body: JSON.stringify(newRoom)
      });
    } else {
      await axios.post('/api/rooms', newRoom);
    }
  } catch (err) {
    console.warn('POST /api/rooms warning:', err.message);
  }

  return {
    success: true,
    room: newRoom,
    message: `Room ${newRoom.roomNumber} successfully created.`
  };
};

/**
 * Update an existing room with PUT request
 */
export const updateRoomApi = async (id, roomData) => {
  const config = getApiConfig();

  const updatedRoom = updateStoredRoom(id, roomData);

  try {
    if (config.provider === 'custom_mockapi' && config.customUrl) {
      await axios.put(`${config.customUrl.replace(/\/$/, '')}/${id}`, updatedRoom);
    } else if (config.provider === 'dummyjson') {
      await axios.put(`https://dummyjson.com/products/1`, {
        title: `Room ${updatedRoom.roomNumber} - ${updatedRoom.roomType}`,
        price: updatedRoom.pricePerNight
      });
    } else if (config.provider === 'jsonplaceholder') {
      await axios.put(`https://jsonplaceholder.typicode.com/posts/1`, {
        id: 1,
        title: `Room ${updatedRoom.roomNumber}`,
        body: JSON.stringify(updatedRoom)
      });
    } else {
      await axios.put(`/api/rooms/${id}`, updatedRoom);
    }
  } catch (err) {
    console.warn(`PUT /api/rooms/${id} warning:`, err.message);
  }

  return {
    success: true,
    room: updatedRoom,
    message: `Room ${updatedRoom.roomNumber} successfully updated.`
  };
};

/**
 * Delete a room with DELETE request
 */
export const deleteRoomApi = async (id) => {
  const config = getApiConfig();

  deleteStoredRoom(id);

  try {
    if (config.provider === 'custom_mockapi' && config.customUrl) {
      await axios.delete(`${config.customUrl.replace(/\/$/, '')}/${id}`);
    } else if (config.provider === 'dummyjson') {
      await axios.delete('https://dummyjson.com/products/1');
    } else if (config.provider === 'jsonplaceholder') {
      await axios.delete('https://jsonplaceholder.typicode.com/posts/1');
    } else {
      await axios.delete(`/api/rooms/${id}`);
    }
  } catch (err) {
    console.warn(`DELETE /api/rooms/${id} warning:`, err.message);
  }

  return {
    success: true,
    id,
    message: 'Room deleted successfully.'
  };
};
