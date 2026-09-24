import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  CalendarCheck,
  Calendar,
  User,
  Users,
  BedDouble,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { useGuests } from '../../context/useGuests';
import { useRooms } from '../../context/useRooms';
import { useBookings } from '../../context/useBookings';

const NewBookingModal = ({ isOpen, onClose }) => {
  const { guests } = useGuests();
  const { rooms } = useRooms();
  const { createBooking, checkAvailability, calculatePricing, getNights } = useBookings();

  // Multi-step form: 'form' | 'summary'
  const [currentStep, setCurrentStep] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestMode, setGuestMode] = useState('existing'); // 'existing' | 'walkin'

  // Default dates: Today and 3 nights later
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultCheckOutStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      guestId: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      vipStatus: 'Standard Guest',
      nationality: 'United States',
      roomNumber: '',
      suiteType: '',
      pricePerNight: 450,
      checkIn: todayStr,
      checkOut: defaultCheckOutStr,
      guestsCount: 2,
      bookingStatus: 'Confirmed',
      paymentMethod: 'Credit Card (Stripe)',
      specialRequests: ''
    }
  });

  // Watch form fields for live calculation
  const watchedGuestId = watch('guestId');
  const watchedRoomNumber = watch('roomNumber');
  const watchedCheckIn = watch('checkIn');
  const watchedCheckOut = watch('checkOut');
  const watchedPricePerNight = watch('pricePerNight');
  const watchedGuestName = watch('guestName');
  const watchedGuestEmail = watch('guestEmail');
  const watchedGuestPhone = watch('guestPhone');
  const watchedVipStatus = watch('vipStatus');
  const watchedSuiteType = watch('suiteType');
  const watchedGuestsCount = watch('guestsCount');
  const watchedBookingStatus = watch('bookingStatus');
  const watchedPaymentMethod = watch('paymentMethod');
  const watchedSpecialRequests = watch('specialRequests');

  // When guests list loads or modal opens, default to first guest if available
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('form');
      setGuestMode('existing');
      if (guests && guests.length > 0) {
        const firstGuest = guests[0];
        setValue('guestId', firstGuest.id);
        setValue('guestName', firstGuest.fullName);
        setValue('guestEmail', firstGuest.email);
        setValue('guestPhone', firstGuest.mobileNumber || '');
        setValue('vipStatus', firstGuest.vipStatus || 'Standard Guest');
        setValue('nationality', firstGuest.nationality || 'United States');
      }

      if (rooms && rooms.length > 0) {
        const defaultRoom = rooms.find((r) => r.status === 'Available') || rooms[0];
        setValue('roomNumber', String(defaultRoom.roomNumber));
        setValue('suiteType', defaultRoom.suiteType || defaultRoom.type || 'Deluxe Room');
        setValue('pricePerNight', defaultRoom.price || defaultRoom.pricePerNight || 450);
      }
    }
  }, [isOpen, guests, rooms, setValue]);

  // When selected existing guest changes, populate guest fields
  const handleGuestSelect = (e) => {
    const selectedId = e.target.value;
    setValue('guestId', selectedId);
    const foundGuest = guests?.find((g) => String(g.id) === String(selectedId));
    if (foundGuest) {
      setValue('guestName', foundGuest.fullName);
      setValue('guestEmail', foundGuest.email);
      setValue('guestPhone', foundGuest.mobileNumber || '');
      setValue('vipStatus', foundGuest.vipStatus || 'Standard Guest');
      setValue('nationality', foundGuest.nationality || 'United States');
    }
  };

  // When room selection changes, populate room rate and suite type
  const handleRoomSelect = (e) => {
    const selectedNumber = e.target.value;
    setValue('roomNumber', selectedNumber);
    const foundRoom = rooms?.find((r) => String(r.roomNumber) === String(selectedNumber));
    if (foundRoom) {
      setValue('suiteType', foundRoom.suiteType || foundRoom.type || 'Deluxe Suite');
      setValue('pricePerNight', foundRoom.price || foundRoom.pricePerNight || 450);
    }
  };

  // 1. Auto-Calculate Number of Nights
  const calculatedNights = useMemo(() => {
    return getNights(watchedCheckIn, watchedCheckOut);
  }, [watchedCheckIn, watchedCheckOut, getNights]);

  // 2. Auto-Calculate Total Amount and Financial Breakdown
  const pricing = useMemo(() => {
    return calculatePricing(watchedPricePerNight || 450, calculatedNights);
  }, [watchedPricePerNight, calculatedNights, calculatePricing]);

  // 3. Prevent Double Booking: Real-Time Overlap Detection Guard
  const doubleBookingCheck = useMemo(() => {
    if (!watchedRoomNumber || !watchedCheckIn || !watchedCheckOut) {
      return { isDoubleBooked: false, conflictingBooking: null };
    }
    return checkAvailability(watchedRoomNumber, watchedCheckIn, watchedCheckOut);
  }, [watchedRoomNumber, watchedCheckIn, watchedCheckOut, checkAvailability]);

  // Minimum check-out date is always check-in + 1 day
  const minCheckOutDate = useMemo(() => {
    if (!watchedCheckIn) return todayStr;
    const d = new Date(watchedCheckIn);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, [watchedCheckIn, todayStr]);

  if (!isOpen) return null;

  // Handle Review Summary Step Transition
  const handleProceedToSummary = () => {
    if (!watchedGuestName?.trim()) {
      alert('Please provide or select a guest name.');
      return;
    }
    if (!watchedGuestEmail?.trim()) {
      alert('Please provide a guest email.');
      return;
    }
    if (!watchedRoomNumber) {
      alert('Please select a suite.');
      return;
    }
    if (doubleBookingCheck.isDoubleBooked) {
      alert('Cannot proceed: The selected room is already booked for these dates.');
      return;
    }
    setCurrentStep('summary');
  };

  // Final Confirmation Submit
  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    try {
      const selectedGuest = guests?.find((g) => String(g.id) === String(watchedGuestId));
      const bookingPayload = {
        guestId: watchedGuestId || null,
        guestName: watchedGuestName.trim(),
        guestEmail: watchedGuestEmail.trim().toLowerCase(),
        guestPhone: watchedGuestPhone || '',
        avatar: selectedGuest?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(watchedGuestName)}`,
        vipStatus: watchedVipStatus,
        nationality: selectedGuest?.nationality || 'United States',
        roomNumber: watchedRoomNumber,
        suiteType: watchedSuiteType,
        pricePerNight: watchedPricePerNight,
        checkIn: watchedCheckIn,
        checkOut: watchedCheckOut,
        nights: calculatedNights,
        amount: pricing.totalAmount,
        guestsCount: watchedGuestsCount,
        status: watchedBookingStatus,
        paymentMethod: watchedPaymentMethod,
        specialRequests: watchedSpecialRequests
      };

      const result = await createBooking(bookingPayload);
      if (result.success) {
        reset();
        onClose();
      }
    } catch {
      // Toast handles error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
              <CalendarCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentStep === 'form' ? 'Create New Room Booking' : 'Booking Summary & Review'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentStep === 'form' ? 'Step 1 of 2' : 'Step 2 of 2'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentStep === 'form'
                  ? 'Assign guest, room, schedule dates with automatic double-booking prevention'
                  : 'Review all reservation details and transparent financial breakdown before final confirmation'}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {currentStep === 'form' ? (
            <div className="space-y-5">
              
              {/* FEATURE 1: SELECT GUEST */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    1. Select Guest
                  </label>

                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setGuestMode('existing')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        guestMode === 'existing'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Registered Guest
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGuestMode('walkin');
                        setValue('guestId', '');
                        setValue('guestName', '');
                        setValue('guestEmail', '');
                        setValue('guestPhone', '');
                        setValue('vipStatus', 'Standard Guest');
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        guestMode === 'walkin'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      + Walk-In / New Guest
                    </button>
                  </div>
                </div>

                {guestMode === 'existing' ? (
                  <div>
                    <select
                      value={watchedGuestId}
                      onChange={handleGuestSelect}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                    >
                      {guests && guests.length > 0 ? (
                        guests.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.fullName} — {g.email} ({g.vipStatus || 'Standard'}) - {g.nationality || 'Guest'}
                          </option>
                        ))
                      ) : (
                        <option value="">No guests registered in directory</option>
                      )}
                    </select>

                    {/* Guest Preview Pill */}
                    {watchedGuestName && (
                      <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              guests?.find((g) => String(g.id) === String(watchedGuestId))?.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(watchedGuestName)}`
                            }
                            alt={watchedGuestName}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/30"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{watchedGuestName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                                {watchedVipStatus}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">{watchedGuestEmail}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{watchedGuestPhone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <input
                        type="text"
                        {...register('guestName', { required: 'Guest name is required' })}
                        placeholder="Full Name *"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        {...register('guestEmail', { required: 'Email is required' })}
                        placeholder="Email Address *"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        {...register('guestPhone')}
                        placeholder="Mobile Number"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <select
                        {...register('vipStatus')}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Standard Guest">Standard Guest</option>
                        <option value="VIP Platinum">VIP Platinum</option>
                        <option value="VIP Gold">VIP Gold</option>
                        <option value="Diamond Elite">Diamond Elite</option>
                        <option value="Silver Preferred">Silver Preferred</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* FEATURE 2 & 7: SELECT ROOM & PREVENT DOUBLE BOOKING */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5" />
                    2. Select Room / Suite
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Rate: <strong className="text-white">${watchedPricePerNight}/night</strong>
                  </span>
                </div>

                <select
                  value={watchedRoomNumber}
                  onChange={handleRoomSelect}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  {rooms && rooms.length > 0 ? (
                    rooms.map((r) => {
                      const conflict = checkAvailability(r.roomNumber, watchedCheckIn, watchedCheckOut);
                      return (
                        <option
                          key={r.id || r.roomNumber}
                          value={r.roomNumber}
                          className={conflict.isDoubleBooked ? 'text-rose-400' : 'text-slate-100'}
                        >
                          Room {r.roomNumber} - {r.suiteType || r.type || 'Deluxe Suite'} (${r.price || r.pricePerNight || 450}/night)
                          {conflict.isDoubleBooked ? ' ⚠️ [Unavailable for dates]' : ''}
                        </option>
                      );
                    })
                  ) : (
                    <option value="101">Room 101 - Deluxe Suite ($450/night)</option>
                  )}
                </select>

                {/* Double Booking Warning Banner */}
                {doubleBookingCheck.isDoubleBooked && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-rose-200">
                        Double Booking Prevented!
                      </strong>
                      <span>
                        Room {watchedRoomNumber} is already reserved by{' '}
                        <strong>{doubleBookingCheck.conflictingBooking?.guestName}</strong> from{' '}
                        {doubleBookingCheck.conflictingBooking?.checkIn} to{' '}
                        {doubleBookingCheck.conflictingBooking?.checkOut}. Please select another room or adjust your stay schedule.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* FEATURES 3, 4, & 5: CHECK-IN, CHECK-OUT, & AUTO-CALCULATED NIGHTS */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  3. Stay Schedule & Auto Nights
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Check-In Date */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      {...register('checkIn', { required: 'Check-in date is required' })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Check-Out Date */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      min={minCheckOutDate}
                      {...register('checkOut', { required: 'Check-out date is required' })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Auto Calculated Nights Indicator */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-500/20 text-amber-400">🌙</span>
                    <span className="text-slate-300">Stay Duration (Auto Calculated):</span>
                  </div>
                  <span className="font-bold text-amber-400 text-sm px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {calculatedNights} {calculatedNights === 1 ? 'Night' : 'Nights'}
                  </span>
                </div>
              </div>

              {/* FEATURE 6: LIVE TOTAL AMOUNT & PRICING PREVIEW */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    Live Price Breakdown
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ${watchedPricePerNight} × {calculatedNights} {calculatedNights === 1 ? 'night' : 'nights'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <div className="flex justify-between">
                    <span>Base Room Charges:</span>
                    <span className="text-slate-200">${pricing.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luxury Resort & State Tax (12%):</span>
                    <span className="text-slate-200">${pricing.luxuryTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resort Concierge & Amenities (5%):</span>
                    <span className="text-slate-200">${pricing.serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold text-white">
                    <span className="text-amber-400 font-serif-luxury">Calculated Total Amount:</span>
                    <span className="font-serif-luxury text-lg text-amber-400">
                      ${pricing.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Options: Guests Count & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Number of Guests
                  </label>
                  <select
                    {...register('guestsCount')}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value={1}>1 Patron</option>
                    <option value={2}>2 Patrons (Couples Suite)</option>
                    <option value={3}>3 Patrons</option>
                    <option value={4}>4 Patrons (Family Villa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Initial Booking Status
                  </label>
                  <select
                    {...register('bookingStatus')}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed (Advance)</option>
                    <option value="Checked-In">Checked-In (Immediate Check-In)</option>
                    <option value="Today Check-In">Today Check-In</option>
                  </select>
                </div>
              </div>

            </div>
          ) : (
            /* FEATURE 8: BOOKING SUMMARY REVIEW */
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Please verify all reservation specifications below. Once confirmed, room inventory and guest schedules will update immediately.
                </span>
              </div>

              {/* Guest Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Guest Information
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {watchedVipStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Full Name:</span>
                    <strong className="text-white">{watchedGuestName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email:</span>
                    <span className="text-slate-300">{watchedGuestEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Mobile:</span>
                    <span className="text-slate-300">{watchedGuestPhone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Patrons:</span>
                    <span className="text-slate-300">{watchedGuestsCount} Guests</span>
                  </div>
                </div>
              </div>

              {/* Room & Stay Schedule Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-800/80 pb-2">
                  Assigned Suite & Schedule
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Suite Assigned:</span>
                    <strong className="text-white flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                      Room {watchedRoomNumber}
                    </strong>
                    <span className="text-[11px] text-slate-400">{watchedSuiteType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Duration:</span>
                    <strong className="text-amber-400">
                      {calculatedNights} {calculatedNights === 1 ? 'Night' : 'Nights'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Check-In:</span>
                    <span className="text-slate-300">{watchedCheckIn} (15:00)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Check-Out:</span>
                    <span className="text-slate-300">{watchedCheckOut} (11:00)</span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Card */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block border-b border-slate-800/80 pb-2">
                  Financial Breakdown & Charges
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Suite Rate (${watchedPricePerNight} × {calculatedNights} nights):</span>
                    <span>${pricing.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luxury & Tourism Tax (12%):</span>
                    <span>${pricing.luxuryTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resort Amenities & Service (5%):</span>
                    <span>${pricing.serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold text-white">
                    <span className="text-amber-400 font-serif-luxury">Total Amount Due:</span>
                    <span className="text-lg font-serif-luxury text-amber-400">
                      ${pricing.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400">Initial Booking Status:</span>
                <span className="px-2.5 py-1 rounded-md font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {watchedBookingStatus}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/70">
          {currentStep === 'form' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleProceedToSummary}
                disabled={doubleBookingCheck.isDoubleBooked}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Review Booking Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('form')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Edit</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirming...' : 'Confirm Reservation'}</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default NewBookingModal;
