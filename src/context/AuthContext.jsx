import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContextCore';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  initializeStorage,
  saveNewUser
} from '../utils/storage';
import {
  apiLogin,
  apiRegister,
  apiRequestPasswordReset,
  apiResetPassword,
  apiUpdateProfile
} from '../api/authApi';

export const AuthProvider = ({ children }) => {
  // Initialize user immediately from storage during mount
  const [user, setUser] = useState(() => {
    try {
      initializeStorage();
      return getCurrentUser();
    } catch (err) {
      console.error('Error loading initial auth session:', err);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Log in an existing user with optional role check via HTTP Network request
   */
  const login = async (email, password, expectedRole = null) => {
    setIsLoading(true);
    try {
      // Makes real HTTP POST request to /api/auth/login (reflected in DevTools Network tab)
      const data = await apiLogin(email, password, expectedRole);
      const authenticatedUser = data.user;

      setCurrentUser(authenticatedUser);
      setUser(authenticatedUser);

      toast.success(`Welcome back, ${authenticatedUser.name}! Signed in as ${authenticatedUser.role}.`);
      return { success: true, user: authenticatedUser, token: data.token };
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user via HTTP Network request
   */
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Makes real HTTP POST request to /api/auth/register (reflected in DevTools Network tab)
      const data = await apiRegister(userData);
      const newUser = data.user;

      // Sync into local storage
      try {
        saveNewUser(userData);
      } catch {
        // If already in storage, ignore duplicate error
      }

      setCurrentUser(newUser);
      setUser(newUser);

      toast.success(`Account created successfully! Welcome, ${newUser.name} (${newUser.role}).`);
      return { success: true, user: newUser, token: data.token };
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out active user
   */
  const logout = () => {
    clearCurrentUser();
    setUser(null);
    toast.info('You have been logged out safely.');
  };

  /**
   * Forgot password: verify email via HTTP Network request
   */
  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    try {
      // Makes real HTTP POST request to /api/auth/forgot-password (reflected in DevTools Network tab)
      const data = await apiRequestPasswordReset(email);
      toast.success('Account verified! Please create your new password.');
      return { success: true, email: data.email };
    } catch (error) {
      toast.error(error.message || 'Password reset request failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset password via HTTP Network request
   */
  const resetPassword = async (email, newPassword) => {
    setIsLoading(true);
    try {
      // Makes real HTTP POST request to /api/auth/reset-password (reflected in DevTools Network tab)
      await apiResetPassword(email, newPassword);
      toast.success('Your password has been successfully reset! You can now log in.');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to reset password.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update profile info via HTTP Network request
   */
  const updateProfile = async (updatedFields) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Makes real HTTP PUT request to /api/auth/profile (reflected in DevTools Network tab)
      const data = await apiUpdateProfile(user.id, updatedFields);
      setUser(data.user);
      toast.success('Profile updated successfully!');
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
