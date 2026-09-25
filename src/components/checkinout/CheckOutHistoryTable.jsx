import React from 'react';
import {
  LogOut,
  BedDouble,
  User,
  Clock,
  KeyRound,
  ShieldCheck,
  Star,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import StayDurationBadge from './StayDurationBadge';

const CheckOutHistoryTable = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">
          No Check-Out Records Found
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No check-out history records match your search criteria. Completed guest check-outs will be logged here.
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
              <th className="py-4 px-4 sm:px-6">Check-Out Record</th>
              <th className="py-4 px-4 sm:px-6">Guest Details</th>
              <th className="py-4 px-4 sm:px-6">Vacated Suite</th>
              <th className="py-4 px-4 sm:px-6">Departure Timestamp</th>
              <th className="py-4 px-4 sm:px-6">Stay Duration</th>
              <th className="py-4 px-4 sm:px-6">Key Return</th>
              <th className="py-4 px-4 sm:px-6">Final Settled</th>
              <th className="py-4 px-4 sm:px-6">Review & Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                
                {/* 1. Record ID */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">
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
                      <span className="font-semibold text-white truncate block">{record.guestName}</span>
                      <p className="text-[11px] text-slate-400 truncate">{record.guestEmail}</p>
                    </div>
                  </div>
                </td>

                {/* 3. Vacated Suite */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Room {record.roomNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{record.suiteType}</p>
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                      Suite Available
                    </span>
                  </div>
                </td>

                {/* 4. Departure Timestamp */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <div className="space-y-0.5 text-xs">
                    <div className="text-slate-200 font-medium">
                      {new Date(record.checkOutTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(record.checkOutTime).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </td>

                {/* 5. FEATURE: STAY DURATION DISPLAY */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <StayDurationBadge
                    nights={record.nightsStayed}
                    isCompleted={true}
                  />
                  <span className="block text-[10px] text-slate-500 mt-1">
                    Arrived: {record.checkInDate}
                  </span>
                </td>

                {/* 6. Key Return */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  {record.keyCardReturned ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      Returned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                      Unreturned
                    </span>
                  )}
                </td>

                {/* 7. Final Settled Amount */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <div className="font-serif-luxury text-sm font-bold text-white">
                    ${Number(record.finalSettledAmount).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400 block font-medium">
                    {record.paymentStatus || 'Paid in Full'}
                  </span>
                </td>

                {/* 8. Review & Inspection */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= (record.feedbackRating || 5)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 italic line-clamp-1 max-w-[180px]">
                      "{record.feedbackNotes || 'Excellent stay.'}"
                    </p>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {record.roomInspectionStatus}
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

export default CheckOutHistoryTable;
