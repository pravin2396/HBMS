import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, CalendarPlus, User, Mail, Phone, Calendar, Users, Hotel } from 'lucide-react';

const SUITE_OPTIONS = [
  { name: 'Presidential Penthouse (Suite 701)', price: 850 },
  { name: 'Royal Oceanfront Villa (Suite 404)', price: 700 },
  { name: 'Executive Diplomat Suite (Suite 302)', price: 620 },
  { name: 'Deluxe Heritage King (Suite 115)', price: 450 },
  { name: 'Grand Horizon Suite (Suite 505)', price: 550 },
  { name: 'Lagoon Garden Bungalow (Suite 208)', price: 480 }
];

const NewReservationModal = ({ isOpen, onClose, onSubmitReservation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      suiteType: SUITE_OPTIONS[0].name,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      guestsCount: 2,
      paymentStatus: 'Paid'
    }
  });

  const selectedSuiteName = watch('suiteType');
  const selectedSuite = SUITE_OPTIONS.find((s) => s.name === selectedSuiteName) || SUITE_OPTIONS[0];
  const calculatedTotal = selectedSuite.price * 3;

  if (!isOpen) return null;

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const isCheckingInToday = data.checkIn === new Date().toISOString().split('T')[0];
      await onSubmitReservation({
        ...data,
        amount: calculatedTotal,
        stayDuration: '3 Nights',
        status: isCheckingInToday ? 'Today Check-In' : 'Confirmed'
      });
      reset();
    } catch {
      // Handled via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <CalendarPlus className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-white">
              Create New Luxury Reservation
            </h3>
            <p className="text-xs text-slate-400">
              Assign a suite and generate instant booking confirmation
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
          
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Guest Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Lady Genevieve Vance"
                {...register('guestName', {
                  required: 'Guest name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' }
                })}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.guestName
                    ? 'border-red-500/80 focus:ring-red-500/30'
                    : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                }`}
              />
            </div>
            {errors.guestName && (
              <p className="mt-1 text-xs text-red-400">{errors.guestName.message}</p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Guest Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="genevieve@paradise.com"
                  {...register('guestEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Valid email required'
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 transition-all ${
                    errors.guestEmail
                      ? 'border-red-500/80 focus:ring-red-500/30'
                      : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                  }`}
                />
              </div>
              {errors.guestEmail && (
                <p className="mt-1 text-xs text-red-400">{errors.guestEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register('guestPhone', { required: 'Phone is required' })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Suite Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Suite or Villa
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Hotel className="w-4 h-4" />
              </div>
              <select
                {...register('suiteType')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all"
              >
                {SUITE_OPTIONS.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} — ${opt.price}/night
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Guests Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Check-In Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <input
                  type="date"
                  {...register('checkIn', { required: true })}
                  className="w-full pl-8 pr-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Check-Out Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <input
                  type="date"
                  {...register('checkOut', { required: true })}
                  className="w-full pl-8 pr-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Total Guests
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <select
                  {...register('guestsCount')}
                  className="w-full pl-8 pr-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5 Guests</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <span>Estimated Rate (3 Nights Stay):</span>
              <div className="text-[11px] text-slate-500">Taxes, concierge fee & VIP breakfast included</div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-amber-400 font-mono">
                ${calculatedTotal.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400">Guaranteed Instant Booking</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:brightness-105 active:scale-[0.99] transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default NewReservationModal;
