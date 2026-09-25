import React, { useState, useEffect, useMemo } from 'react';
import {
  LogOut,
  KeyRound,
  ShieldCheck,
  BedDouble,
  User,
  Calendar,
  CreditCard,
  Receipt,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import StayDurationBadge from './StayDurationBadge';

const GuestCheckOutStation = ({
  inHouseGuests = [],
  onConfirmCheckOut,
  isLoading
}) => {
  const [selectedBookingId, setSelectedBookingId] = useState(
    inHouseGuests[0]?.id || ''
  );

  const selectedBooking =
    inHouseGuests.find((b) => String(b.id) === String(selectedBookingId)) ||
    inHouseGuests[0] ||
    null;

  const [incidentalsAmount, setIncidentalsAmount] = useState(0);
  const [incidentalsDescription, setIncidentalsDescription] = useState('Mini-bar & Spa charges');
  const [keyCardReturned, setKeyCardReturned] = useState(true);
  const [roomInspectionStatus, setRoomInspectionStatus] = useState('Passed (Flawless Condition)');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('Guest expressed high appreciation for resort staff and luxury amenities.');
  const [receptionAgent, setReceptionAgent] = useState('Alexander Sterling (Front Desk Mgr)');

  // Update selected booking if list changes
  useEffect(() => {
    if (!selectedBookingId && inHouseGuests.length > 0) {
      setSelectedBookingId(inHouseGuests[0].id);
    }
  }, [inHouseGuests, selectedBookingId]);

  // Stay Duration computation
  const stayDetails = useMemo(() => {
    if (!selectedBooking) return { nights: 1, formattedDuration: '1 Night' };
    const checkIn = new Date(selectedBooking.checkIn);
    const now = new Date();
    const diff = Math.max(1, Math.round((now.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const nights = selectedBooking.nights || diff;
    return {
      nights,
      formattedDuration: `${nights} ${nights === 1 ? 'Night' : 'Nights'}`
    };
  }, [selectedBooking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    onConfirmCheckOut(selectedBooking.id, {
      incidentalsAmount: Number(incidentalsAmount),
      incidentalsDescription,
      keyCardReturned,
      roomInspectionStatus,
      feedbackRating: Number(feedbackRating),
      feedbackNotes,
      receptionAgent
    });
  };

  if (inHouseGuests.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-serif-luxury text-xl font-bold text-white">
            No Active In-House Guests
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            There are currently no guests occupying suites. To check in an arrival, visit the Guest Check-In tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <LogOut className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-luxury text-xl font-bold text-white tracking-tight">
                Guest Check-Out Station
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {inHouseGuests.length} In-House Guests
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect suite, collect key cards, calculate incidentals, and release room to Available inventory
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {/* Step 1: Select In-House Guest / Room */}
        <div>
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Select In-House Guest / Occupied Room to Check-Out *</span>
          </label>
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-inner"
          >
            {inHouseGuests.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-white py-1">
                Room {b.roomNumber} — {b.guestName} ({b.suiteType || 'Suite'} • Stay: {b.stayDuration || `${b.nights || 1} Nights`} • {b.id})
              </option>
            ))}
          </select>
        </div>

        {selectedBooking && (
          <>
            {/* Live Status Transition Summary (Requirement 3 & 4 & 7) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              
              {/* Display Stay Duration */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Stay Duration</span>
                </span>
                <StayDurationBadge
                  checkInDate={selectedBooking.checkIn}
                  checkOutDate={selectedBooking.checkOut}
                  nights={selectedBooking.nights}
                />
                <span className="text-[11px] text-slate-400 block pt-0.5">
                  Checked In: {selectedBooking.checkIn} ➔ Departing: Today
                </span>
              </div>

              {/* Room Availability Update Indicator */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <BedDouble className="w-3 h-3 text-indigo-400" />
                  <span>Room Availability</span>
                </span>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Occupied
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Available
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 block font-medium">
                  Room {selectedBooking.roomNumber} returns to inventory
                </span>
              </div>

              {/* Booking Status Update Indicator */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>Booking Status</span>
                </span>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Checked-In
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    Checked-Out
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block font-mono">
                  {selectedBooking.id}
                </span>
              </div>

            </div>

            {/* Check-Out Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Room Inspection Status */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Room Inspection</span>
                </label>
                <select
                  value={roomInspectionStatus}
                  onChange={(e) => setRoomInspectionStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Passed (Flawless Condition)">Passed (Flawless Condition)</option>
                  <option value="Passed (Standard Cleaning)">Passed (Standard Cleaning)</option>
                  <option value="Deep Sanitization Required">Deep Sanitization Required</option>
                  <option value="Minor Damage Assessed">Minor Damage Assessed</option>
                </select>
              </div>

              {/* Incidentals Amount */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-amber-400" />
                  <span>Incidentals / Minibar ($)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={incidentalsAmount}
                  onChange={(e) => setIncidentalsAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Guest Feedback Rating */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guest Satisfaction</span>
                </label>
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5/5 Outstanding</option>
                  <option value="4">⭐⭐⭐⭐ 4/5 Very Good</option>
                  <option value="3">⭐⭐⭐ 3/5 Satisfactory</option>
                  <option value="2">⭐⭐ 2/5 Needs Improvement</option>
                  <option value="1">⭐ 1/5 Unsatisfactory</option>
                </select>
              </div>

              {/* Front Desk Agent */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Front Desk Agent</span>
                </label>
                <input
                  type="text"
                  value={receptionAgent}
                  onChange={(e) => setReceptionAgent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

            </div>

            {/* Keycard Return Checkbox & Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={keyCardReturned}
                  onChange={(e) => setKeyCardReturned(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-900"
                />
                <span className="flex items-center gap-1 font-medium">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Key Card ({selectedBooking.keyCardId || `RFID-${selectedBooking.roomNumber}-A`}) Returned to Front Desk</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap ml-auto"
              >
                <LogOut className="w-4 h-4 stroke-[2.5]" />
                <span>{isLoading ? 'Processing Check-Out...' : 'Confirm Guest Check-Out'}</span>
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default GuestCheckOutStation;
