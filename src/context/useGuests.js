import { useContext } from 'react';
import { GuestContext } from './GuestContextCore';

export const useGuests = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuests must be used within a GuestProvider');
  }
  return context;
};
