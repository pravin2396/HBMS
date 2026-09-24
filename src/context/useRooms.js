import { useContext } from 'react';
import { RoomContext } from './RoomContextCore';

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  return context;
};
