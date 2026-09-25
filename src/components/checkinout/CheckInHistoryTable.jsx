import React from 'react';
import {
  LogIn,
  KeyRound,
  BedDouble,
  User,
  Clock,
  Briefcase,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import StayDurationBadge from './StayDurationBadge';

const CheckInHistoryTable = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">
          No Check-In Records Found
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No check-in history records match your search criteria. Process incoming guest check-ins from the Front Desk Roster.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
              <th className="py-4 px-4 sm:px-6">Check-In Record</th>
              <th className="py-4 px-4 sm:px-6">Guest Details</th>
              <th className="py-4 px-4 sm:px-6">Assigned Suite</th>
              <th className="py-4 px-4 sm:px-6">Check-In Timestamp</th>
              <th className="py-4 px-4 sm:px-6">Key Issued</th>
              <th className="py-4 px-4 sm:px-6">Stay Duration</th>
              <th className="py-4 px-4 sm:px-6">Deposit / Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                
                {/* 1. Record ID */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                    {record.id}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                    Ref: {record.bookingId}
                  </span>
                </td>

                {/* 2. Guest Details */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={record.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(record.guestName)}`}
                      alt={record.guestName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-white truncate">{record.guestName}</span>
                        {record.vipStatus && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {record.vipStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{record.guestEmail}</p>
                      <p className="text-[10px] text-slate-500 truncate">{record.guestPhone}</p>
                    </div>
                  </div>
                </td>

                {/* 3. Assigned Suite */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Room {record.roomNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{record.suiteType}</p>
                  </div>
                </td>

                {/* 4. Check-In Timestamp */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <div className="space-y-0.5 text-xs">
                    <div className="text-slate-200 font-medium">
                      {new Date(record.checkInTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(record.checkInTime).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </td>

                {/* 5. Key Issued */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    {record.keyCardId}
                  </span>
                </td>

                {/* 6. Stay Duration */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <StayDurationBadge
                    nights={record.scheduledNights}
                  />
                  <span className="block text-[10px] text-slate-500 mt-1">
                    Dep: {record.expectedCheckOut}
                  </span>
                </td>

                {/* 7. Deposit & Agent */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="space-y-0.5 text-xs">
                    <div className="text-slate-200 font-medium">
                      Deposit: ${Number(record.depositAmount || 0).toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                      Agent: {record.receptionAgent}
                    </span>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckInHistoryTable;
