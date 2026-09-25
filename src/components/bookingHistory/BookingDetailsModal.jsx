import React from 'react';
import {
  X,
  Calendar,
  Building,
  User,
  CreditCard,
  Clock,
  CheckCircle2,
  Ban,
  Sparkles,
  Printer,
  ShieldCheck,
  Hotel
} from 'lucide-react';
import { useBookingHistory } from '../../context/useBookingHistory';

const BookingDetailsModal = () => {
  const {
    selectedBookingDetails,
    isDetailsModalOpen,
    closeBookingDetails,
    openCompleteModal,
    openCancelModal
  } = useBookingHistory();

  if (!isDetailsModalOpen || !selectedBookingDetails) return null;

  const b = selectedBookingDetails;
  const statusLower = (b.status || '').toLowerCase();
  const isCompleted = statusLower === 'completed' || statusLower === 'checked-out';
  const isCheckedIn = statusLower === 'checked-in';
  const isCancelled = statusLower === 'cancelled';
  const isConfirmed = statusLower === 'confirmed' || statusLower === 'today check-in' || statusLower === 'pending';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {b.id}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Reservation Dossier & Historical Record
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={closeBookingDetails}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-950 text-slate-100 print:bg-white print:text-black">
          
          {/* Top Branding & Status Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
                <Hotel className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-serif-luxury text-xl font-bold tracking-wider text-amber-400 block leading-tight">
                  Paradise Resort
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase block">
                  Booking Audit Dossier • Reference {b.id}
                </span>
              </div>
            </div>

            {/* Status Stamp */}
            <div>
              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" />
                  STAY COMPLETED
                </span>
              )}
              {isCheckedIn && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  ACTIVE IN-HOUSE
                </span>
              )}
              {isCancelled && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 uppercase tracking-widest">
                  <Ban className="w-4 h-4" />
                  CANCELLED RESERVATION
                </span>
              )}
              {isConfirmed && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  CONFIRMED RESERVATION
                </span>
              )}
            </div>
          </div>

          {/* Guest Information Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Guest Patron Profile
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    b.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${b.guestName || 'G'}`
                  }
                  alt={b.guestName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/40 shrink-0"
                />
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-white">
                    {b.guestName}
                  </h3>
                  <span className="text-xs text-amber-400/90 font-medium">
                    {b.vipStatus || 'Standard Luxury Guest'}
                  </span>
                  <div className="text-xs text-slate-400 space-x-3 mt-0.5">
                    <span>{b.guestEmail}</span>
                    <span>•</span>
                    <span>{b.guestPhone}</span>
                  </div>
                </div>
              </div>

              {b.guestId && (
                <div className="text-right text-xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Directory ID</span>
                  <span className="font-mono text-slate-300 font-semibold">{b.guestId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stay & Room Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Room Info */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                Suite Accommodation
              </h4>
              <div>
                <span className="font-semibold text-white text-sm block">
                  Suite {b.roomNumber} • {b.suiteType}
                </span>
                <span className="text-xs text-slate-400">
                  Resort Inventory Capacity: {b.guestsCount || 2} Registered Patrons
                </span>
              </div>
            </div>

            {/* Stay Timeline */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Stay Schedule & Duration
              </h4>
              <div>
                <span className="text-xs text-slate-200 block">
                  Check-In: <strong className="text-white">{b.checkIn}</strong> → Check-Out: <strong className="text-white">{b.checkOut}</strong>
                </span>
                <span className="text-xs text-amber-400 font-semibold block mt-0.5">
                  Total Length of Stay: {b.stayDuration || `${b.nights || 1} Nights`}
                </span>
              </div>
            </div>

          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              Financial Settlement & Tariff
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Total Amount</span>
                <span className="font-serif-luxury text-base font-bold text-white">
                  ${Number(b.amount || 0).toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Payment Status</span>
                <span className="font-semibold text-emerald-400">
                  {b.paymentStatus || 'Paid in Full'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Booked On</span>
                <span className="text-slate-300 font-mono">
                  {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Direct Reservation'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Duty Manager</span>
                <span className="text-slate-300 truncate block">
                  {b.receptionAgent || 'Front Desk Duty Mgr'}
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Audit Section (Completed, Cancelled, or Active) */}
          {isCompleted && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Completed Stay Audit Information
              </h4>
              <div className="text-xs text-slate-300 space-y-1">
                {b.actualCheckOutTime && (
                  <p>
                    Departure Timestamp: <span className="font-mono text-white">{new Date(b.actualCheckOutTime).toLocaleString()}</span>
                  </p>
                )}
                <p>
                  Room Status: <span className="text-emerald-400 font-semibold">Inspected & Vacated (Available)</span>
                </p>
                {b.completionNotes && (
                  <p className="italic text-slate-400 pt-1 border-t border-emerald-500/20">
                    "{b.completionNotes}"
                  </p>
                )}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Ban className="w-4 h-4" />
                Cancellation Record
              </h4>
              <div className="text-xs text-slate-300 space-y-1">
                {b.cancelledAt && (
                  <p>
                    Cancelled At: <span className="font-mono text-white">{new Date(b.cancelledAt).toLocaleString()}</span>
                  </p>
                )}
                <p>
                  Reason: <span className="text-rose-300 font-medium">{b.cancellationReason || 'Guest requested cancellation'}</span>
                </p>
                <p className="text-slate-400">
                  Suite {b.roomNumber} was automatically released back into inventory upon cancellation.
                </p>
              </div>
            </div>
          )}

          {b.specialRequests && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-300">Special Guest Requests:</span>
              <p className="text-slate-200 italic">{b.specialRequests}</p>
            </div>
          )}

          {/* Action Buttons in Modal */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 print:hidden">
            <div className="flex items-center gap-2">
              {isCheckedIn && (
                <button
                  type="button"
                  onClick={() => {
                    closeBookingDetails();
                    openCompleteModal(b);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-emerald-500/10 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Stay as Completed</span>
                </button>
              )}

              {!isCancelled && !isCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    closeBookingDetails();
                    openCancelModal(b);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/40 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs cursor-pointer transition-all"
                >
                  <Ban className="w-4 h-4" />
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={closeBookingDetails}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors ml-auto"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingDetailsModal;
