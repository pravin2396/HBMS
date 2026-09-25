import React, { useState, useMemo } from 'react';
import {
  X,
  LogOut,
  KeyRound,
  ShieldCheck,
  BedDouble,
  Calendar,
  Receipt,
  Star,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import StayDurationBadge from './StayDurationBadge';

const CheckOutModal = ({
  isOpen,
  onClose,
  booking,
  inHouseGuests = [],
  onConfirmCheckOut,
  isLoading
}) => {
  const [selectedBookingId, setSelectedBookingId] = useState(booking?.id || '');

  // Determine active in-house booking to check out
  const activeBooking = booking ||
    inHouseGuests.find((b) => String(b.id) === String(selectedBookingId)) ||
    inHouseGuests[0] ||
    null;

  React.useEffect(() => {
    if (booking?.id) {
      setSelectedBookingId(booking.id);
    } else if (inHouseGuests && inHouseGuests.length > 0 && !selectedBookingId) {
      setSelectedBookingId(inHouseGuests[0].id);
    }
  }, [booking, inHouseGuests, selectedBookingId]);

  const [incidentalsAmount, setIncidentalsAmount] = useState(0);
  const [incidentalsDescription, setIncidentalsDescription] = useState('Mini-bar & Spa charges');
  const [keyCardReturned, setKeyCardReturned] = useState(true);
  const [roomInspectionStatus, setRoomInspectionStatus] = useState('Passed (Flawless Condition)');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('Guest expressed high appreciation for resort staff and luxury amenities.');
  const [receptionAgent, setReceptionAgent] = useState('Alexander Sterling (Front Desk Mgr)');

  // Compute Stay Duration
  const stayDetails = useMemo(() => {
    if (!activeBooking) return { scheduledNights: 3, formattedDuration: '3 Nights' };
    const checkIn = new Date(activeBooking.checkIn);
    const now = new Date();
    const diff = Math.max(1, Math.round((now.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      scheduledNights: activeBooking.nights || diff,
      actualNights: diff,
      formattedDuration: `${activeBooking.nights || diff} ${activeBooking.nights === 1 ? 'Night' : 'Nights'}`
    };
  }, [activeBooking]);

  if (!isOpen) return null;

  const roomCharges = Number(activeBooking?.amount) || 1450;
  const finalSettledAmount = roomCharges + Number(incidentalsAmount || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeBooking) return;
    onConfirmCheckOut(activeBooking.id, {
      incidentalsAmount: Number(incidentalsAmount) || 0,
      incidentalsDescription,
      keyCardReturned,
      roomInspectionStatus,
      feedbackRating,
      feedbackNotes,
      receptionAgent
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <LogOut className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Process Guest Check-Out
                </h3>
                {activeBooking && (
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {activeBooking.id}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Settle final invoice, inspect suite, return room key, and release inventory
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        {!activeBooking ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-white">No In-House Guests</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no guests currently occupying suites. You can process arrivals in the Check-In tab.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            
            {/* In-House Selector if opened without pre-selected booking */}
            {!booking && inHouseGuests.length > 1 && (
              <div>
                <label className="block text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5" />
                  Select Occupied Suite to Check-Out *
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {inHouseGuests.map((g) => (
                    <option key={g.id} value={g.id}>
                      Room {g.roomNumber} ({g.suiteType}) — {g.guestName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Guest & Suite Overview */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeBooking.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeBooking.guestName)}`}
                  alt={activeBooking.guestName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/40 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-sm">{activeBooking.guestName}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeBooking.vipStatus || 'Standard Guest'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{activeBooking.guestEmail}</p>
                  <p className="text-slate-500 text-[10px]">{activeBooking.guestPhone}</p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Suite Vacating</span>
                <strong className="text-white text-sm flex items-center gap-1 sm:justify-end">
                  <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                  Room {activeBooking.roomNumber}
                </strong>
                <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">{activeBooking.suiteType}</span>
              </div>
            </div>

          {/* FEATURE: DISPLAY STAY DURATION */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Completed Stay Duration
              </span>
              <StayDurationBadge
                checkInDate={activeBooking.checkIn}
                checkOutDate={activeBooking.checkOut}
                nights={stayDetails.scheduledNights}
                isCompleted={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Check-In Date</span>
                <strong className="text-slate-200">{activeBooking.checkIn}</strong>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Departure Date</span>
                <strong className="text-slate-200">{new Date().toISOString().split('T')[0]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Total Nights</span>
                <strong className="text-amber-400">{stayDetails.scheduledNights} Nights Completed</strong>
              </div>
            </div>
          </div>

          {/* Suite Inspection & Key Return */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Housekeeping Suite Inspection
              </label>
              <select
                value={roomInspectionStatus}
                onChange={(e) => setRoomInspectionStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Passed (Flawless Condition)">Passed (Flawless Condition)</option>
                <option value="Passed (Standard Clean Required)">Passed (Standard Clean Required)</option>
                <option value="Deep Clean Scheduled">Deep Clean Scheduled</option>
                <option value="Maintenance Attention Noted">Maintenance Attention Noted</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-amber-400" />
                Key Card Return Status
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl">
                <input
                  type="checkbox"
                  id="keyReturn"
                  checked={keyCardReturned}
                  onChange={(e) => setKeyCardReturned(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="keyReturn" className="text-slate-200 cursor-pointer select-none">
                  {keyCardReturned ? 'Key Card Returned & Deactivated' : 'Key Card Lost / Unreturned'}
                </label>
              </div>
            </div>
          </div>

          {/* Incidentals & Final Bill Settlement */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                Final Invoice Settlement
              </span>
              <span className="text-[11px] text-slate-400">Payment on File</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
                  Incidentals / Extras ($)
                </label>
                <input
                  type="number"
                  min={0}
                  value={incidentalsAmount}
                  onChange={(e) => setIncidentalsAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
                  Incidentals Category
                </label>
                <input
                  type="text"
                  value={incidentalsDescription}
                  onChange={(e) => setIncidentalsDescription(e.target.value)}
                  placeholder="Minibar, room service, etc."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Total Balance Breakdown */}
            <div className="space-y-1 pt-1 text-slate-400">
              <div className="flex justify-between">
                <span>Room Base Charges:</span>
                <span className="text-slate-200">${roomCharges.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Additional Incidentals:</span>
                <span className="text-slate-200">${Number(incidentalsAmount || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold text-white">
                <span className="text-amber-400 font-serif-luxury">Final Settled Bill:</span>
                <span className="font-serif-luxury text-base text-amber-400">
                  ${finalSettledAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Guest Feedback & Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Guest Experience Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= feedbackRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="Guest comments, feedback, or special mentions..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Room Release Notice */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Completing check-out will mark <strong>Room {activeBooking.roomNumber}</strong> as <strong>Available</strong> for immediate housekeeping and new incoming reservations.
            </span>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-105 active:scale-[0.99] text-white font-bold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'Checking Out...' : 'Complete Check-Out & Release Room'}</span>
            </button>
          </div>

        </form>
        )}

      </div>
    </div>
  );
};

export default CheckOutModal;
