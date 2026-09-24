import { useContext } from 'react';
import { BookingContext } from './BookingContextCore';

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export default useBookings;
