import React from 'react';
import { toast } from 'react-toastify';
import {
  CalendarPlus,
  UserCheck,
  BedDouble,
  FileDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const QuickActionCards = ({ onOpenNewReservation, onQuickCheckInFirstPending, role }) => {
  const handleHousekeepingAlert = () => {
    toast.info('Housekeeping dispatched: 6 vacant suites scheduled for luxury turn-down service.');
  };

  const handleExportReport = () => {
    toast.success('Financial & Occupancy Summary (Q3 2026) exported successfully to CSV/PDF!');
  };

  const isHotelOwner = role === 'Hotel Owner';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Quick Operational Actions
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Fast-access triggers for hotel operations
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Action 1: New Reservation */}
        <button
          type="button"
          onClick={onOpenNewReservation}
          className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-500/60 shadow-lg text-left group transition-all duration-300 cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
              {isHotelOwner ? 'New Reservation' : 'Book a Luxury Suite'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Create a custom reservation with instant room assignment and rate calculation.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span>Launch Booking Form</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Action 2: Express Check-In */}
        <button
          type="button"
          onClick={onQuickCheckInFirstPending}
          className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg text-left group transition-all duration-300 cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Express Guest Check-In
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Instantly check in arriving VIP guests and grant digital suite keys.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>Process Today Check-In</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Action 3: Room Status & Housekeeping */}
        <button
          type="button"
          onClick={handleHousekeepingAlert}
          className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 border border-blue-500/30 hover:border-blue-500/60 shadow-lg text-left group transition-all duration-300 cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BedDouble className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              Housekeeping & Turn-Down
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Dispatch housekeeping crews to prepare vacant suites for incoming VIP guests.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
            <span>Dispatch Housekeeping</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Action 4: Financial Report Export */}
        <button
          type="button"
          onClick={handleExportReport}
          className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 shadow-lg text-left group transition-all duration-300 cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileDown className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
              Export Analytics Report
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Download comprehensive PDF / CSV audit summary of revenue and occupancy pacing.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
            <span>Download Report</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>
    </div>
  );
};

export default QuickActionCards;
