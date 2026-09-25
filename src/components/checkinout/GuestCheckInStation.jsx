import React, { useState, useEffect, useMemo } from 'react';
import {
  LogIn,
  KeyRound,
  ShieldCheck,
  BedDouble,
  User,
  Calendar,
  Briefcase,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import StayDurationBadge from './StayDurationBadge';
import { getStoredGuests } from '../../utils/guestStorage';
import { calculateNights } from '../../utils/bookingStorage';
import { getStoredRooms } from '../../utils/roomStorage';

const GuestCheckInStation = ({
  pendingArrivals = [],
  availableRooms = [],
  rooms = [],
  onConfirmCheckIn,
  onNewWalkInCheckIn,
  onSeedScheduledArrivals,
  isLoading
}) => {
  // Mode: 'scheduled' or 'walkin'
  const [checkInMode, setCheckInMode] = useState(
    pendingArrivals.length > 0 ? 'scheduled' : 'walkin'
  );

  // -------------------------------------------------------------
  // MODE 1: SCHEDULED CHECK-IN STATE
  // -------------------------------------------------------------
  const [selectedBookingId, setSelectedBookingId] = useState(
    pendingArrivals[0]?.id || ''
  );

  const selectedBooking =
    pendingArrivals.find((b) => String(b.id) === String(selectedBookingId)) ||
    pendingArrivals[0] ||
    null;

  const [scheduledKeyCard, setScheduledKeyCard] = useState('');
  const [scheduledLuggage, setScheduledLuggage] = useState(2);
  const [scheduledDeposit, setScheduledDeposit] = useState(500);
  const [scheduledDepositMethod, setScheduledDepositMethod] = useState('Credit Card Pre-Authorization');
  const [scheduledIdVerified, setScheduledIdVerified] = useState(true);
  const [scheduledAgent, setScheduledAgent] = useState('Alexander Sterling (Front Desk Mgr)');
  const [scheduledNotes, setScheduledNotes] = useState('Welcome drink served. ID verified.');

  useEffect(() => {
    if (!selectedBookingId && pendingArrivals.length > 0) {
      setSelectedBookingId(pendingArrivals[0].id);
    }
  }, [pendingArrivals, selectedBookingId]);

  useEffect(() => {
    if (selectedBooking) {
      setScheduledKeyCard(`RFID-${selectedBooking.roomNumber}-A`);
    }
  }, [selectedBooking?.id, selectedBooking?.roomNumber]);

  // -------------------------------------------------------------
  // MODE 2: NEW / WALK-IN CHECK-IN STATE
  // -------------------------------------------------------------
  const registeredGuests = useMemo(() => {
    try {
      return getStoredGuests() || [];
    } catch {
      return [];
    }
  }, []);

  const allAvailableRooms = useMemo(() => {
    if (Array.isArray(availableRooms) && availableRooms.length > 0) {
      return availableRooms;
    }
    const all = Array.isArray(rooms) && rooms.length > 0 ? rooms : getStoredRooms();
    return all.filter((r) => r && String(r.status).toLowerCase() === 'available');
  }, [availableRooms, rooms]);

  const [selectedGuestOption, setSelectedGuestOption] = useState(
    registeredGuests[0]?.id ? String(registeredGuests[0].id) : 'custom'
  );
  const [walkInGuestName, setWalkInGuestName] = useState(registeredGuests[0]?.name || '');
  const [walkInGuestEmail, setWalkInGuestEmail] = useState(registeredGuests[0]?.email || '');
  const [walkInGuestPhone, setWalkInGuestPhone] = useState(registeredGuests[0]?.phone || '');

  const [walkInRoomNumber, setWalkInRoomNumber] = useState(
    allAvailableRooms[0]?.roomNumber || '101'
  );

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  const [walkInCheckInDate, setWalkInCheckInDate] = useState(todayStr);
  const [walkInCheckOutDate, setWalkInCheckOutDate] = useState(tomorrowStr);
  const [walkInKeyCard, setWalkInKeyCard] = useState(`RFID-${allAvailableRooms[0]?.roomNumber || '101'}-A`);
  const [walkInDeposit, setWalkInDeposit] = useState(500);
  const [walkInIdVerified, setWalkInIdVerified] = useState(true);

  // Update walkIn fields when guest selection changes
  const handleGuestSelectChange = (e) => {
    const val = e.target.value;
    setSelectedGuestOption(val);
    if (val === 'custom') {
      setWalkInGuestName('');
      setWalkInGuestEmail('');
      setWalkInGuestPhone('');
    } else {
      const g = registeredGuests.find((guest) => String(guest.id) === String(val));
      if (g) {
        setWalkInGuestName(g.name);
        setWalkInGuestEmail(g.email);
        setWalkInGuestPhone(g.phone);
      }
    }
  };

  // Sync key card when walk-in room changes
  const handleRoomSelectChange = (e) => {
    const rNum = e.target.value;
    setWalkInRoomNumber(rNum);
    setWalkInKeyCard(`RFID-${rNum}-A`);
  };

  // Selected Walk-In Room Object
  const selectedWalkInRoom = useMemo(() => {
    return allAvailableRooms.find((r) => String(r.roomNumber) === String(walkInRoomNumber)) || allAvailableRooms[0] || null;
  }, [allAvailableRooms, walkInRoomNumber]);

  // Walk-In Stay Duration
  const walkInNights = useMemo(() => {
    return calculateNights(walkInCheckInDate, walkInCheckOutDate);
  }, [walkInCheckInDate, walkInCheckOutDate]);

  // -------------------------------------------------------------
  // SUBMISSION HANDLERS
  // -------------------------------------------------------------
  const handleScheduledSubmit = (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!scheduledIdVerified) {
      alert('Please verify the guest identity before proceeding with check-in.');
      return;
    }

    onConfirmCheckIn(selectedBooking.id, {
      keyCardId: scheduledKeyCard,
      luggageCount: Number(scheduledLuggage),
      depositAmount: Number(scheduledDeposit),
      depositMethod: scheduledDepositMethod,
      receptionAgent: scheduledAgent,
      notes: scheduledNotes
    });
  };

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    if (!walkInGuestName.trim()) {
      alert('Please enter or select a guest name.');
      return;
    }
    if (!walkInRoomNumber) {
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
        guestName: walkInGuestName,
        guestEmail: walkInGuestEmail,
        guestPhone: walkInGuestPhone,
        roomNumber: walkInRoomNumber,
        suiteType: selectedWalkInRoom ? selectedWalkInRoom.roomType || selectedWalkInRoom.type : 'Deluxe Suite',
        pricePerNight: selectedWalkInRoom ? selectedWalkInRoom.pricePerNight : 250,
        checkInDate: walkInCheckInDate,
        checkOutDate: walkInCheckOutDate,
        keyCardId: walkInKeyCard,
        depositAmount: Number(walkInDeposit),
        notes: 'Walk-In Check-In via Check-In Station'
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
      {/* Header Banner & Mode Selector */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <LogIn className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif-luxury text-xl font-bold text-white tracking-tight">
                Guest Check-In Station
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {pendingArrivals.length} Scheduled Arrivals
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {allAvailableRooms.length} Suites Available
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Process scheduled reservations or perform instant walk-in check-in to occupy available suites
            </p>
          </div>
        </div>

        {/* Check-In Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setCheckInMode('scheduled')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              checkInMode === 'scheduled'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Scheduled Reservation</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20">
              {pendingArrivals.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCheckInMode('walkin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              checkInMode === 'walkin'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ New / Walk-In Check-In</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW A: SCHEDULED ARRIVAL CHECK-IN (EMPTY STATE)              */}
      {/* ------------------------------------------------------------- */}
      {checkInMode === 'scheduled' && pendingArrivals.length === 0 && (
        <div className="p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white">
              All Scheduled Arrivals Have Been Checked In
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1">
              There are currently no pending scheduled reservations awaiting arrival. You can generate sample confirmed reservations to test scheduled check-in, or switch to new walk-in check-in.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {onSeedScheduledArrivals && (
              <button
                type="button"
                onClick={onSeedScheduledArrivals}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ Load Sample Scheduled Reservations</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setCheckInMode('walkin')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Switch to New / Walk-In Check-In</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW A: SCHEDULED ARRIVAL CHECK-IN FORM (ACTIVE LIST)         */}
      {/* ------------------------------------------------------------- */}
      {checkInMode === 'scheduled' && pendingArrivals.length > 0 && (
        <form onSubmit={handleScheduledSubmit} className="p-5 sm:p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Select Scheduled Guest / Reservation ({pendingArrivals.length} ready) *</span>
              </label>
              {onSeedScheduledArrivals && (
                <button
                  type="button"
                  onClick={onSeedScheduledArrivals}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                >
                  + Add More Sample Arrivals
                </button>
              )}
            </div>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-inner"
            >
              {pendingArrivals.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white py-1">
                  {b.id} — {b.guestName} (Room {b.roomNumber} • {b.suiteType || 'Suite'} • {b.stayDuration || `${b.nights || 1} Nights`})
                </option>
              ))}
            </select>
          </div>

          {selectedBooking && (
            <>
              {/* Live Status Transition Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                {/* Stay Duration Display */}
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
                    {selectedBooking.checkIn} ➔ {selectedBooking.checkOut}
                  </span>
                </div>

                {/* Room Availability Indicator */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <BedDouble className="w-3 h-3 text-emerald-400" />
                    <span>Room Availability Update</span>
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Available
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      Occupied
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 block font-medium">
                    Room {selectedBooking.roomNumber} ({selectedBooking.suiteType})
                  </span>
                </div>

                {/* Booking Status Indicator */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    <span>Booking Status Update</span>
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedBooking.status || 'Confirmed'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Checked-In
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    {selectedBooking.id}
                  </span>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assign Key Card RFID *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduledKeyCard}
                    onChange={(e) => setScheduledKeyCard(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>Luggage Count</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={scheduledLuggage}
                    onChange={(e) => setScheduledLuggage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Front Desk Agent</span>
                  </label>
                  <input
                    type="text"
                    value={scheduledAgent}
                    onChange={(e) => setScheduledAgent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Checkboxes & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={scheduledIdVerified}
                    onChange={(e) => setScheduledIdVerified(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Guest Government ID Verified & Registered</span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading || !scheduledIdVerified}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap ml-auto"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>{isLoading ? 'Processing Check-In...' : 'Confirm Guest Check-In'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW B: NEW / WALK-IN GUEST CHECK-IN FORM                     */}
      {/* ------------------------------------------------------------- */}
      {checkInMode === 'walkin' && (
        <form onSubmit={handleWalkInSubmit} className="p-5 sm:p-6 space-y-6">
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Walk-In Check-In Mode:</strong> Select an existing registered guest or enter new walk-in patron details, pick an available suite, and occupy the room immediately.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold text-[11px] whitespace-nowrap shrink-0">
              Instant Check-In
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Guest Selection */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>1. Guest Information *</span>
              </label>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Select Registered Patron or Type New
                </label>
                <select
                  value={selectedGuestOption}
                  onChange={handleGuestSelectChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="custom">+ Type New Walk-In Patron</option>
                  {registeredGuests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.email} • {g.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord James Hamilton"
                  value={walkInGuestName}
                  onChange={(e) => setWalkInGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="guest@luxury.com"
                    value={walkInGuestEmail}
                    onChange={(e) => setWalkInGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={walkInGuestPhone}
                    onChange={(e) => setWalkInGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Suite & Dates Selection */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5" />
                <span>2. Available Suite & Schedule *</span>
              </label>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Select Available Suite ({allAvailableRooms.length} Ready) *
                </label>
                <select
                  value={walkInRoomNumber}
                  onChange={handleRoomSelectChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {allAvailableRooms.map((r) => (
                    <option key={r.roomNumber} value={r.roomNumber}>
                      Room #{r.roomNumber} — {r.roomType || r.type || 'Suite'} (Floor {r.floor} • ${r.pricePerNight || 250}/night)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    required
                    value={walkInCheckInDate}
                    onChange={(e) => setWalkInCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    required
                    value={walkInCheckOutDate}
                    onChange={(e) => setWalkInCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Computed Stay Duration Badge */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Calculated Stay Duration:</span>
                <StayDurationBadge
                  checkInDate={walkInCheckInDate}
                  checkOutDate={walkInCheckOutDate}
                  nights={walkInNights}
                />
              </div>
            </div>
          </div>

          {/* Real-time Status Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Stay Schedule
              </span>
              <span className="text-xs font-bold text-white block">
                {walkInNights} {walkInNights === 1 ? 'Night' : 'Nights'}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {walkInCheckInDate} ➔ {walkInCheckOutDate}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Room Availability Update
              </span>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Available
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  Occupied
                </span>
              </div>
              <span className="text-[11px] text-slate-300 block font-medium">
                Room #{walkInRoomNumber}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Booking Status Update
              </span>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  New Walk-In
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Checked-In
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                Auto-assigned ID
              </span>
            </div>
          </div>

          {/* Keycard, Deposit, and Submit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>RFID Key Card Number *</span>
              </label>
              <input
                type="text"
                required
                value={walkInKeyCard}
                onChange={(e) => setWalkInKeyCard(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Security Deposit Amount ($)</span>
              </label>
              <input
                type="number"
                min="0"
                value={walkInDeposit}
                onChange={(e) => setWalkInDeposit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-5">
                <input
                  type="checkbox"
                  checked={walkInIdVerified}
                  onChange={(e) => setWalkInIdVerified(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                />
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Government ID Verified</span>
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <button
              type="submit"
              disabled={isLoading || !walkInIdVerified || !walkInGuestName.trim()}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>{isLoading ? 'Processing Check-In...' : 'Complete New Check-In'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GuestCheckInStation;
