import React, { useState } from 'react';
import {
  X,
  Ban,
  AlertTriangle,
  Building,
  User,
  Calendar
} from 'lucide-react';
import { useBookingHistory } from '../../context/useBookingHistory';

const CancelBookingHistoryModal = () => {
  const {
    bookingToCancel,
    isCancelModalOpen,
    closeCancelModal,
    handleCancelBooking,
    isLoading
  } = useBookingHistory();

  const [reasonCategory, setReasonCategory] = useState('Change of Travel Plans');
  const [customNotes, setCustomNotes] = useState('');

  if (!isCancelModalOpen || !bookingToCancel) return null;

  const b = bookingToCancel;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = customNotes.trim()
      ? `${reasonCategory}: ${customNotes.trim()}`
      : reasonCategory;
    handleCancelBooking(b.id, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Ban className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-white tracking-wide">
                Cancel Reservation
              </h3>
              <p className="font-mono text-[11px] text-amber-400">
                {b.id} • Suite {b.roomNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCancelModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200">
              <p className="font-semibold">Cancellation Policy Notice</p>
              <p className="text-[11px] text-rose-300/80 mt-0.5">
                Cancelling this booking will set its status to <strong>Cancelled</strong> and immediately release Suite {b.roomNumber} back to Available inventory.
              </p>
            </div>
          </div>

          {/* Booking Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Guest Name:</span>
              <span className="font-medium text-white">{b.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Suite Type:</span>
              <span className="text-slate-200">Suite {b.roomNumber} ({b.suiteType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Dates:</span>
              <span className="text-slate-200">{b.checkIn} → {b.checkOut} ({b.nights || 1} nights)</span>
            </div>
          </div>

          {/* Reason Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Reason for Cancellation *
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Change of Travel Plans">Change of Travel Plans</option>
              <option value="Flight Delay / Travel Disruption">Flight Delay / Travel Disruption</option>
              <option value="Medical / Personal Emergency">Medical / Personal Emergency</option>
              <option value="Corporate Event Postponed">Corporate Event Postponed</option>
              <option value="Transferred to Different Suite">Transferred to Different Suite</option>
              <option value="Guest No-Show / Non-Arrival">Guest No-Show / Non-Arrival</option>
              <option value="Other / Front Desk Discretion">Other / Front Desk Discretion</option>
            </select>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Audit Remarks & Additional Notes
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Guest notified reception via telephone. Refund policy applied."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeCancelModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Keep Reservation
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CancelBookingHistoryModal;
