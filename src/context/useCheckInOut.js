import { useContext } from 'react';
import { CheckInOutContext } from './CheckInOutContextCore';

export const useCheckInOut = () => {
  const context = useContext(CheckInOutContext);
  if (!context) {
    throw new Error('useCheckInOut must be used within a CheckInOutProvider');
  }
  return context;
};

export default useCheckInOut;
