import axios from 'axios';
import {
  getStoredUsers,
  saveNewUser as localSaveUser,
  updatePassword as localUpdatePassword,
  updateUserProfile as localUpdateProfile,
  findUserByEmail as localFindUser,
  isPasswordValid
} from '../utils/storage';

/**
 * Axios client instance for authentication endpoints.
 * These requests are visible in the browser's DevTools Network tab.
 */
export const authClient = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

/**
 * Execute HTTP POST /api/auth/login
 */
export const apiLogin = async (email, password, role) => {
  try {
    const payload = {
      email,
      password,
      role,
      localUsers: getStoredUsers()
    };

    const response = await authClient.post('/login', payload);
    return response.data;
  } catch (error) {
    // If the server responded with an error (401, 403, 404), extract server message
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    // Fallback for static environments without Vite middleware running
    console.warn('[authApi] Network fallback to local storage:', error.message);
    const existingUser = localFindUser(email);
    if (!existingUser) {
      throw new Error('No account found with this email address.');
    }

    if (!isPasswordValid(existingUser, password)) {
      throw new Error('Incorrect password. Please try again.');
    }

    if (role && existingUser.role && existingUser.role !== role) {
      throw new Error(`This account is registered as "${existingUser.role}". Please select the ${existingUser.role} tab to sign in.`);
    }

    const { password: _p, ...safeUser } = existingUser;
    return {
      success: true,
      token: `fallback_token_${Date.now()}`,
      user: safeUser
    };
  }
};

/**
 * Execute HTTP POST /api/auth/register
 */
export const apiRegister = async (userData) => {
  try {
    const payload = {
      ...userData,
      localUsers: getStoredUsers()
    };

    const response = await authClient.post('/register', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    // Fallback for static environments
    const newUser = localSaveUser(userData);
    const { password: _p, ...safeUser } = newUser;
    return {
      success: true,
      token: `fallback_token_${Date.now()}`,
      user: safeUser
    };
  }
};

/**
 * Execute HTTP POST /api/auth/forgot-password
 */
export const apiRequestPasswordReset = async (email) => {
  try {
    const response = await authClient.post('/forgot-password', {
      email,
      localUsers: getStoredUsers()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    const user = localFindUser(email);
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    return { success: true, email: user.email };
  }
};

/**
 * Execute HTTP POST /api/auth/reset-password
 */
export const apiResetPassword = async (email, newPassword) => {
  try {
    const response = await authClient.post('/reset-password', { email, newPassword });
    localUpdatePassword(email, newPassword);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    localUpdatePassword(email, newPassword);
    return { success: true };
  }
};

/**
 * Execute HTTP PUT /api/auth/profile
 */
export const apiUpdateProfile = async (userId, updatedFields) => {
  try {
    const response = await authClient.put('/profile', { id: userId, ...updatedFields });
    const localUser = localUpdateProfile(userId, updatedFields);
    return { success: true, user: localUser || response.data.user };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    const localUser = localUpdateProfile(userId, updatedFields);
    return { success: true, user: localUser };
  }
};

export default {
  login: apiLogin,
  register: apiRegister,
  requestPasswordReset: apiRequestPasswordReset,
  resetPassword: apiResetPassword,
  updateProfile: apiUpdateProfile
};
