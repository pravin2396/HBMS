import React from 'react';
import { Award, BedDouble, TrendingUp, Sparkles, DollarSign } from 'lucide-react';

const MostBookedRoomTypeReport = ({ roomTypes }) => {
  const list = roomTypes || [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
              Most Booked Room Types Ranking
            </h3>
            <p className="text-[11px] text-slate-400">
              Patron suite preference ranking, booking volume, and yield analysis
            </p>
          </div>
        </div>

        <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Top Performing Suites
        </span>
      </div>

      {/* Ranking List */}
      <div className="space-y-3">
        {list.map((item, idx) => {
          const rankColors = [
            'from-amber-500 to-yellow-400 text-slate-950 font-bold',
            'from-slate-300 to-slate-400 text-slate-950 font-bold',
            'from-amber-700 to-amber-600 text-white font-bold',
            'from-slate-700 to-slate-800 text-slate-300 font-semibold',
            'from-slate-800 to-slate-900 text-slate-400 font-medium'
          ];

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left: Rank Badge + Suite Title */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${rankColors[idx] || rankColors[4]} flex items-center justify-center text-xs shadow-md shrink-0`}
                >
                  #{idx + 1}
                </div>

                <div>
                  <h4 className="font-serif-luxury text-sm font-bold text-white">
                    {item.type}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span>{item.count} reservations</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{item.share}% booking share</span>
                  </div>
                </div>
              </div>

              {/* Right: Revenue & Market Share Bar */}
              <div className="w-full sm:w-56 space-y-1.5 self-end sm:self-auto text-right">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Revenue Yield</span>
                  <span className="font-serif-luxury font-bold text-white text-sm">
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${Math.min(100, item.share * 2.5)}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MostBookedRoomTypeReport;
