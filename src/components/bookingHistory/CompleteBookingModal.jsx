import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Building,
  KeyRound,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useBookingHistory } from '../../context/useBookingHistory';

const CompleteBookingModal = () => {
  const {
    bookingToComplete,
    isCompleteModalOpen,
    closeCompleteModal,
    handleMarkCompleted,
    isLoading
  } = useBookingHistory();

  const [agent, setAgent] = useState('Alexander Sterling (Duty Manager)');
  const [keyCardReturned, setKeyCardReturned] = useState(true);
  const [roomInspection, setRoomInspection] = useState('Passed (Clean & Pristine)');
  const [notes, setNotes] = useState('Guest stay successfully completed. Folio finalized.');

  if (!isCompleteModalOpen || !bookingToComplete) return null;

  const b = bookingToComplete;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMarkCompleted(b.id, {
      agent,
      keyCardReturned,
      roomInspection,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-white tracking-wide">
                Complete Guest Stay
              </h3>
              <p className="font-mono text-[11px] text-amber-400">
                {b.id} • Suite {b.roomNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCompleteModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Guest Name:</span>
              <span className="font-medium text-white">{b.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Suite:</span>
              <span className="text-slate-200">Suite {b.roomNumber} ({b.suiteType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Tariff:</span>
              <span className="font-serif-luxury font-bold text-amber-400">${Number(b.amount || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Keycard Returned Checkbox */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="keycard"
              checked={keyCardReturned}
              onChange={(e) => setKeyCardReturned(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
            <label htmlFor="keycard" className="text-xs text-slate-200 cursor-pointer flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>RFID Key Card retrieved and cleared from door lock system</span>
            </label>
          </div>

          {/* Room Inspection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Room Inspection Status
            </label>
            <select
              value={roomInspection}
              onChange={(e) => setRoomInspection(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Passed (Clean & Pristine)">Passed (Clean & Pristine)</option>
              <option value="Passed (Turn-down Service Required)">Passed (Turn-down Service Required)</option>
              <option value="Requires Deep Sanitation">Requires Deep Sanitation</option>
            </select>
          </div>

          {/* Front Desk Agent */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Duty Officer / Receptionist
            </label>
            <input
              type="text"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Completion Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Departure & Completion Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add stay completion comments or feedback..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeCompleteModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Mark as Completed'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CompleteBookingModal;
