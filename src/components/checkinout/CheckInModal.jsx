import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  LogIn,
  KeyRound,
  ShieldCheck,
  BedDouble,
  User,
  Calendar,
  Briefcase,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import StayDurationBadge from './StayDurationBadge';
import { getStoredGuests } from '../../utils/guestStorage';
import { calculateNights } from '../../utils/bookingStorage';
import { getStoredRooms } from '../../utils/roomStorage';

const CheckInModal = ({
  isOpen,
  onClose,
  booking,
  pendingArrivals = [],
  availableRooms = [],
  rooms = [],
  onConfirmCheckIn,
  onNewWalkInCheckIn,
  onSeedScheduledArrivals,
  isLoading
}) => {
  // Mode selection: 'scheduled' vs 'walkin'
  const [modalMode, setModalMode] = useState('scheduled');

  // Available Rooms fallback
  const safeAvailableRooms = useMemo(() => {
    if (Array.isArray(availableRooms) && availableRooms.length > 0) return availableRooms;
    const all = Array.isArray(rooms) && rooms.length > 0 ? rooms : getStoredRooms();
    return all.filter((r) => r && String(r.status).toLowerCase() === 'available');
  }, [availableRooms, rooms]);

  const registeredGuests = useMemo(() => {
    try {
      return getStoredGuests() || [];
    } catch {
      return [];
    }
  }, []);

  // -------------------------------------------------------------
  // SCHEDULED BOOKING STATE
  // -------------------------------------------------------------
  const [selectedBookingId, setSelectedBookingId] = useState(booking?.id || '');

  const activeBooking = booking?.id
    ? booking
    : pendingArrivals.find((b) => String(b.id) === String(selectedBookingId)) ||
      pendingArrivals[0] ||
      null;

  const [scheduledKeyCard, setScheduledKeyCard] = useState('');
  const [scheduledLuggage, setScheduledLuggage] = useState(2);
  const [scheduledDeposit, setScheduledDeposit] = useState(500);
  const [scheduledDepositMethod, setScheduledDepositMethod] = useState('Credit Card Pre-Authorization');
  const [scheduledIdVerified, setScheduledIdVerified] = useState(true);
  const [scheduledAgent, setScheduledAgent] = useState('Alexander Sterling (Front Desk Mgr)');
  const [scheduledNotes, setScheduledNotes] = useState('Guest verified ID proof. Welcome drink & key card presented.');

  // -------------------------------------------------------------
  // NEW / WALK-IN CHECK-IN STATE
  // -------------------------------------------------------------
  const [selectedGuestOption, setSelectedGuestOption] = useState(
    registeredGuests[0]?.id ? String(registeredGuests[0].id) : 'custom'
  );
  const [walkInName, setWalkInName] = useState(registeredGuests[0]?.name || '');
  const [walkInEmail, setWalkInEmail] = useState(registeredGuests[0]?.email || '');
  const [walkInPhone, setWalkInPhone] = useState(registeredGuests[0]?.phone || '');
  const [walkInRoom, setWalkInRoom] = useState(
    booking?.roomNumber ? String(booking.roomNumber) : (safeAvailableRooms[0]?.roomNumber || '101')
  );

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  const [walkInCheckInDate, setWalkInCheckInDate] = useState(todayStr);
  const [walkInCheckOutDate, setWalkInCheckOutDate] = useState(tomorrowStr);
  const [walkInKeyCard, setWalkInKeyCard] = useState(
    `RFID-${booking?.roomNumber ? booking.roomNumber : (safeAvailableRooms[0]?.roomNumber || '101')}-A`
  );
  const [walkInDeposit, setWalkInDeposit] = useState(500);
  const [walkInIdVerified, setWalkInIdVerified] = useState(true);

  // Sync mode and selections when modal opens or props change
  useEffect(() => {
    if (booking?.id) {
      setSelectedBookingId(booking.id);
      setModalMode('scheduled');
    } else if (booking?.roomNumber) {
      // Room tile check-in without existing reservation: Walk-in check-in for this room
      setModalMode('walkin');
      setWalkInRoom(String(booking.roomNumber));
      setWalkInKeyCard(`RFID-${booking.roomNumber}-A`);
    } else if (pendingArrivals.length > 0) {
      if (!selectedBookingId || !pendingArrivals.some((b) => String(b.id) === String(selectedBookingId))) {
        setSelectedBookingId(pendingArrivals[0].id);
      }
    }
  }, [booking, pendingArrivals, selectedBookingId, isOpen]);

  useEffect(() => {
    if (activeBooking) {
      setScheduledKeyCard(`RFID-${activeBooking.roomNumber}-A`);
    }
  }, [activeBooking?.roomNumber]);

  const selectedWalkInRoom = useMemo(() => {
    return safeAvailableRooms.find((r) => String(r.roomNumber) === String(walkInRoom)) || safeAvailableRooms[0] || null;
  }, [safeAvailableRooms, walkInRoom]);

  const walkInNights = useMemo(() => {
    return calculateNights(walkInCheckInDate, walkInCheckOutDate);
  }, [walkInCheckInDate, walkInCheckOutDate]);

  if (!isOpen) return null;

  const handleGuestSelectChange = (e) => {
    const val = e.target.value;
    setSelectedGuestOption(val);
    if (val === 'custom') {
      setWalkInName('');
      setWalkInEmail('');
      setWalkInPhone('');
    } else {
      const g = registeredGuests.find((guest) => String(guest.id) === String(val));
      if (g) {
        setWalkInName(g.name);
        setWalkInEmail(g.email);
        setWalkInPhone(g.phone);
      }
    }
  };

  const handleRoomSelectChange = (e) => {
    const rNum = e.target.value;
    setWalkInRoom(rNum);
    setWalkInKeyCard(`RFID-${rNum}-A`);
  };

  const handleScheduledSubmit = (e) => {
    e.preventDefault();
    if (!activeBooking || !activeBooking.id) {
      return handleWalkInSubmit(e);
    }
    if (!scheduledIdVerified) {
      alert('Please verify the guest identity before proceeding with check-in.');
      return;
    }
    onConfirmCheckIn(activeBooking.id, {
      keyCardId: scheduledKeyCard,
      luggageCount: Number(scheduledLuggage),
      depositAmount: Number(scheduledDeposit),
      depositMethod: scheduledDepositMethod,
      receptionAgent: scheduledAgent,
      notes: scheduledNotes,
      roomNumber: activeBooking.roomNumber,
      guestName: activeBooking.guestName
    });
  };

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      alert('Please enter or select a guest name.');
      return;
    }
    if (!walkInRoom) {
      alert('Please select an available suite for check-in.');
      return;
    }
    if (!walkInIdVerified) {
      alert('Please verify the guest identity before proceeding with check-in.');
      return;
    }

    if (onNewWalkInCheckIn) {
      onNewWalkInCheckIn({
        guestId: selectedGuestOption !== 'custom' ? selectedGuestOption : '',
        guestName: walkInName,
        guestEmail: walkInEmail,
        guestPhone: walkInPhone,
        roomNumber: walkInRoom,
        suiteType: selectedWalkInRoom ? selectedWalkInRoom.roomType || selectedWalkInRoom.type : 'Deluxe Suite',
        pricePerNight: selectedWalkInRoom ? selectedWalkInRoom.pricePerNight : 250,
        checkInDate: walkInCheckInDate,
        checkOutDate: walkInCheckOutDate,
        keyCardId: walkInKeyCard,
        depositAmount: Number(walkInDeposit),
        notes: 'Walk-In Check-In via Modal'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <LogIn className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Process Guest Check-In
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Verify arrival details, assign RFID key cards, and transition suite to Occupied
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

        {/* Modal Mode Selector Pills */}
        <div className="px-6 pt-4 pb-2 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalMode('scheduled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              modalMode === 'scheduled'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Scheduled Arrival {pendingArrivals.length > 0 ? `(${pendingArrivals.length})` : '(0)'}
          </button>

          <button
            type="button"
            onClick={() => setModalMode('walkin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              modalMode === 'walkin'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ New / Walk-In Check-In</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          
          {/* ======================================================== */}
          {/* OPTION A: SCHEDULED ARRIVAL CHECK-IN (EMPTY STATE)       */}
          {/* ======================================================== */}
          {modalMode === 'scheduled' && !activeBooking && pendingArrivals.length === 0 && (
            <div className="p-8 text-center space-y-4 rounded-2xl bg-slate-950/70 border border-slate-800 my-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-white">
                  No Pending Scheduled Arrivals
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  All scheduled guest reservations have either been checked in or no upcoming bookings are queued.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {onSeedScheduledArrivals && (
                  <button
                    type="button"
                    onClick={() => {
                      onSeedScheduledArrivals();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+ Load Sample Reservations</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalMode('walkin')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>New / Walk-In Check-In</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* OPTION A: SCHEDULED ARRIVAL CHECK-IN (ACTIVE FORM)       */}
          {/* ======================================================== */}
          {modalMode === 'scheduled' && activeBooking && (
            <form onSubmit={handleScheduledSubmit} className="space-y-4">
              
              {!booking && pendingArrivals.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>Select Scheduled Arrival ({pendingArrivals.length} ready) *</span>
                    </label>
                    {onSeedScheduledArrivals && (
                      <button
                        type="button"
                        onClick={onSeedScheduledArrivals}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-normal cursor-pointer"
                      >
                        + Add More Sample Arrivals
                      </button>
                    )}
                  </div>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                  >
                    {pendingArrivals.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} — {b.guestName} (Room {b.roomNumber} • {b.suiteType || 'Suite'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Guest & Suite Card */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeBooking.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeBooking.guestName)}`}
                      alt={activeBooking.guestName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/30 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-white text-sm">{activeBooking.guestName}</div>
                      <div className="text-[11px] text-slate-400">{activeBooking.guestEmail} • {activeBooking.guestPhone}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                    Room {activeBooking.roomNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Stay Schedule</span>
                    <span className="text-slate-300 font-medium">{activeBooking.checkIn} ➔ {activeBooking.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Stay Duration</span>
                    <StayDurationBadge
                      checkInDate={activeBooking.checkIn}
                      checkOutDate={activeBooking.checkOut}
                      nights={activeBooking.nights}
                    />
                  </div>
                </div>

                {/* Status Transitions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Room Status</span>
                    <span className="text-rose-400 font-bold">Available ➔ Occupied</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Booking Status</span>
                    <span className="text-emerald-400 font-bold">{activeBooking.status || 'Confirmed'} ➔ Checked-In</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assign RFID Key Card *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduledKeyCard}
                    onChange={(e) => setScheduledKeyCard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Security Deposit ($)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={scheduledDeposit}
                    onChange={(e) => setScheduledDeposit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={scheduledIdVerified}
                    onChange={(e) => setScheduledIdVerified(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Government ID Document Verified & On File</span>
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !scheduledIdVerified}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>{isLoading ? 'Processing Check-In...' : 'Confirm Check-In'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* OPTION B: NEW / WALK-IN CHECK-IN                         */}
          {/* ======================================================== */}
          {modalMode === 'walkin' && (
            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Patron Details *</span>
                </label>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Select Existing Guest or Enter New
                  </label>
                  <select
                    value={selectedGuestOption}
                    onChange={handleGuestSelectChange}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="custom">+ Type New Walk-In Patron</option>
                    {registeredGuests.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Guest Full Name"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="guest@domain.com"
                      value={walkInEmail}
                      onChange={(e) => setWalkInEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Suite & Dates */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>Suite & Stay Schedule *</span>
                </label>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Select Available Suite ({safeAvailableRooms.length} Ready) *
                  </label>
                  <select
                    value={walkInRoom}
                    onChange={handleRoomSelectChange}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {safeAvailableRooms.map((r) => (
                      <option key={r.roomNumber} value={r.roomNumber}>
                        Room #{r.roomNumber} — {r.roomType || r.type || 'Suite'} (${r.pricePerNight || 250}/night)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Check-In</label>
                    <input
                      type="date"
                      required
                      value={walkInCheckInDate}
                      onChange={(e) => setWalkInCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Check-Out</label>
                    <input
                      type="date"
                      required
                      value={walkInCheckOutDate}
                      onChange={(e) => setWalkInCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Calculated Duration:</span>
                  <StayDurationBadge
                    checkInDate={walkInCheckInDate}
                    checkOutDate={walkInCheckOutDate}
                    nights={walkInNights}
                  />
                </div>
              </div>

              {/* RFID Key Card & Deposit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>RFID Key Card *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInKeyCard}
                    onChange={(e) => setWalkInKeyCard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Deposit ($)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={walkInDeposit}
                    onChange={(e) => setWalkInDeposit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={walkInIdVerified}
                    onChange={(e) => setWalkInIdVerified(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Government ID Document Verified & On File</span>
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !walkInIdVerified || !walkInName.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>{isLoading ? 'Processing...' : 'Complete Walk-In Check-In'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default CheckInModal;
