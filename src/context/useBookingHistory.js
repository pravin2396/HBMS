import { useContext } from 'react';
import { BookingHistoryContext } from './BookingHistoryContextCore';

export const useBookingHistory = () => {
  const context = useContext(BookingHistoryContext);
  if (!context) {
    throw new Error('useBookingHistory must be used within a BookingHistoryProvider');
  }
  return context;
};
