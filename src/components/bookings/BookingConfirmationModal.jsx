import React from 'react';
import {
  X,
  CheckCircle,
  Calendar,
  BedDouble,
  User,
  Printer,
  Sparkles,
  ShieldCheck,
  Download
} from 'lucide-react';

const BookingConfirmationModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-6 text-slate-950 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950/20 text-slate-950 hover:bg-slate-950/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle className="w-8 h-8 stroke-[2.2]" />
          </div>

          <h3 className="font-serif-luxury text-2xl font-bold tracking-tight">
            Reservation Confirmed!
          </h3>
          <p className="text-xs font-semibold text-slate-900/90 mt-0.5">
            Paradise Luxury Hotel & Resort
          </p>

          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-950 text-amber-400 font-mono text-xs font-bold tracking-wider shadow-inner">
            Confirmation Code: {booking.id}
          </div>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Guest & Room Details */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Guest Name</span>
              <strong className="text-white text-sm">{booking.guestName}</strong>
              <span className="text-slate-400 block text-[11px] truncate">{booking.guestEmail}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Assigned Suite</span>
              <strong className="text-amber-400 text-sm flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                Room {booking.roomNumber}
              </strong>
              <span className="text-slate-400 block text-[11px] truncate">{booking.suiteType}</span>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Check-In</span>
              <strong className="text-slate-200">{booking.checkIn}</strong>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Duration</span>
              <strong className="text-amber-400">{booking.stayDuration || `${booking.nights || 3} Nights`}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Check-Out</span>
              <strong className="text-slate-200">{booking.checkOut}</strong>
            </div>
          </div>

          {/* Price & Status Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Booking Status:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {booking.status}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Status:</span>
              <span className="text-slate-200 font-semibold">{booking.paymentStatus || 'Paid'}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm">
              <span className="font-serif-luxury font-bold text-slate-200">Total Amount:</span>
              <span className="font-serif-luxury text-base font-bold text-amber-400">
                ${Number(booking.amount).toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-105 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmationModal;
