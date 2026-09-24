import React, { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useRooms } from '../../context/useRooms';

const RoomDeleteModal = () => {
  const { isDeleteModalOpen, closeDeleteModal, selectedRoom, deleteRoom } = useRooms();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isDeleteModalOpen || !selectedRoom) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteRoom(selectedRoom.id);
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={closeDeleteModal}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Delete Room {selectedRoom.roomNumber}</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        {/* Room Info Box */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Room Type:</span>
            <span className="font-semibold text-slate-200">{selectedRoom.roomType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Floor:</span>
            <span className="font-semibold text-slate-200">Floor {selectedRoom.floor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Rate:</span>
            <span className="font-semibold text-amber-400">${selectedRoom.pricePerNight} / night</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Are you sure you want to remove <strong className="text-slate-200">Room {selectedRoom.roomNumber}</strong> from the Paradise Hotel inventory? All associated room configurations will be deleted.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isDeleting ? 'Deleting...' : 'Delete Room'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoomDeleteModal;
