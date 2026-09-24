import React from 'react';
import {
  X,
  Calendar,
  BedDouble,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  Printer,
  Sparkles,
  LogIn,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const BookingSummaryModal = ({
  isOpen,
  onClose,
  booking,
  onCheckIn,
  onCheckOut
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Today Check-In':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Checked-Out':
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Booking Summary & Details
                </h3>
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {booking.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Created on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Active stay'}
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          
          {/* Guest Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Guest Information
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {booking.vipStatus || 'Standard Guest'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={booking.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(booking.guestName)}`}
                alt={booking.guestName}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-500/30"
              />
              <div className="space-y-0.5">
                <h4 className="font-semibold text-white text-sm">{booking.guestName}</h4>
                <p className="text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  {booking.guestEmail}
                </p>
                <p className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  {booking.guestPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Suite & Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Suite Details</span>
              <strong className="text-white text-sm flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                Room {booking.roomNumber}
              </strong>
              <span className="text-slate-400 block text-[11px] truncate">{booking.suiteType}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Stay Duration</span>
              <strong className="text-amber-400 text-sm">
                🌙 {booking.stayDuration || `${booking.nights || 3} Nights`}
              </strong>
              <span className="text-slate-400 block text-[11px]">
                {booking.guestsCount || 2} Registered Guests
              </span>
            </div>
          </div>

          {/* Dates Schedule Card */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Check-In Date</span>
              <strong className="text-slate-200">{booking.checkIn}</strong>
              <span className="text-[10px] text-slate-400 block">From 15:00</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Check-Out Date</span>
              <strong className="text-slate-200">{booking.checkOut}</strong>
              <span className="text-[10px] text-slate-400 block">Until 11:00</span>
            </div>
          </div>

          {/* Financial Breakdown & Status */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Payment & Status
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-semibold text-white">{booking.paymentStatus || 'Paid'}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-slate-400">{booking.paymentMethod || 'Credit Card'}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold text-white">
                <span className="text-amber-400 font-serif-luxury">Total Charged Amount:</span>
                <span className="font-serif-luxury text-base text-amber-400">
                  ${Number(booking.amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print</span>
          </button>

          <div className="flex items-center gap-2">
            {(booking.status === 'Confirmed' || booking.status === 'Today Check-In') && (
              <button
                type="button"
                onClick={() => {
                  onCheckIn(booking.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Check In Now</span>
              </button>
            )}

            {booking.status === 'Checked-In' && (
              <button
                type="button"
                onClick={() => {
                  onCheckOut(booking.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Check Out</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingSummaryModal;
