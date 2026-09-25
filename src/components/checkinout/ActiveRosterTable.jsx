import React from 'react';
import {
  LogIn,
  LogOut,
  BedDouble,
  User,
  Clock,
  KeyRound,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import StayDurationBadge from './StayDurationBadge';

const ActiveRosterTable = ({
  pendingArrivals = [],
  activeInHouseGuests = [],
  onOpenCheckIn,
  onOpenCheckOut,
  onSeedScheduledArrivals,
  viewMode = 'all' // 'all' | 'checkin' | 'checkout'
}) => {
  const showArrivals = viewMode === 'all' || viewMode === 'checkin';
  const showInHouse = viewMode === 'all' || viewMode === 'checkout';

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: EXPECTED ARRIVALS (GUEST CHECK-IN) */}
      {showArrivals && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <LogIn className="w-4 h-4" />
              </span>
              <h3 className="font-serif-luxury text-lg font-bold text-white tracking-tight">
                Guest Check-In (Pending Arrivals)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {pendingArrivals.length} Ready
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {onSeedScheduledArrivals && (
                <button
                  type="button"
                  onClick={onSeedScheduledArrivals}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Generate sample scheduled reservations for testing"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Load Sample Arrivals</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenCheckIn(null)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Process Check-In</span>
              </button>
            </div>
          </div>

        {pendingArrivals.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">
              No matching arrivals found or all scheduled reservations have been checked in.
            </p>
            {onSeedScheduledArrivals && (
              <button
                type="button"
                onClick={onSeedScheduledArrivals}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Load Sample Scheduled Reservations</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Booking ID</th>
                    <th className="py-3.5 px-4 sm:px-6">Guest Details</th>
                    <th className="py-3.5 px-4 sm:px-6">Suite</th>
                    <th className="py-3.5 px-4 sm:px-6">Stay Schedule</th>
                    <th className="py-3.5 px-4 sm:px-6">Duration</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {pendingArrivals.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-amber-400 whitespace-nowrap">
                        {booking.id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(booking.guestName)}`}
                            alt={booking.guestName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-white block truncate">{booking.guestName}</span>
                            <span className="text-[11px] text-slate-400 truncate block">{booking.guestEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-medium text-white flex items-center gap-1.5">
                          <BedDouble className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Room {booking.roomNumber}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                          {booking.suiteType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-xs text-slate-300">
                        <div>In: {booking.checkIn}</div>
                        <div className="text-slate-500 text-[11px]">Out: {booking.checkOut}</div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <StayDurationBadge
                          checkInDate={booking.checkIn}
                          checkOutDate={booking.checkOut}
                          nights={booking.nights}
                        />
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => onOpenCheckIn(booking)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Process Check-In</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      )}

      {/* SECTION 2: ACTIVE IN-HOUSE GUESTS (GUEST CHECK-OUT) */}
      {showInHouse && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <LogOut className="w-4 h-4" />
              </span>
              <h3 className="font-serif-luxury text-lg font-bold text-white tracking-tight">
                Guest Check-Out (Active In-House)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeInHouseGuests.length} In-House
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenCheckOut(null)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-105 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Process Check-Out</span>
              </button>
            </div>
          </div>

        {activeInHouseGuests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              No matching in-house guests found.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Booking ID</th>
                    <th className="py-3.5 px-4 sm:px-6">In-House Guest</th>
                    <th className="py-3.5 px-4 sm:px-6">Occupied Suite</th>
                    <th className="py-3.5 px-4 sm:px-6">Key Card</th>
                    <th className="py-3.5 px-4 sm:px-6">Stay Duration</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {activeInHouseGuests.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-amber-400 whitespace-nowrap">
                        {booking.id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(booking.guestName)}`}
                            alt={booking.guestName}
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-white block truncate">{booking.guestName}</span>
                            <span className="text-[11px] text-slate-400 truncate block">{booking.guestPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-medium text-white flex items-center gap-1.5">
                          <BedDouble className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Room {booking.roomNumber}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                          {booking.suiteType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          <KeyRound className="w-3 h-3 text-amber-400" />
                          {booking.keyCardId || `RFID-${booking.roomNumber}-A`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <StayDurationBadge
                          checkInDate={booking.checkIn}
                          checkOutDate={booking.checkOut}
                          nights={booking.nights}
                        />
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => onOpenCheckOut(booking)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-105 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Process Check-Out</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      )}

    </div>
  );
};

export default ActiveRosterTable;
