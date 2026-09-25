import React from 'react';
import {
  Users,
  Compass,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const ActiveGuestsAndTrendsReport = ({ activeCount, totalPatrons, vipBreakdown, trends }) => {
  const vips = vipBreakdown || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Active In-House Guests & VIP Tiers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
                Active Guests & Patron Demographics
              </h3>
              <p className="text-[11px] text-slate-400">
                VIP loyalty distribution of patrons currently in resort stay
              </p>
            </div>
          </div>

          <span className="font-serif-luxury text-base font-bold text-white">
            {activeCount || 42} In Stay
          </span>
        </div>

        {/* VIP Tier Progress Distribution */}
        <div className="space-y-3">
          {vips.map((v, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{v.tier}</span>
                <span className="text-slate-400">
                  {v.count} patrons ({v.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${v.percentage}%` }}
                  className={`h-full ${v.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Total Registered Resort Patrons</span>
          <span className="font-serif-luxury font-bold text-white text-sm">
            {totalPatrons || 214} Patrons
          </span>
        </div>
      </div>

      {/* 2. Booking Trends & Behavioral Indicators */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
                Booking Trends & Lead Indicators
              </h3>
              <p className="text-[11px] text-slate-400">
                Behavioral reservation velocity, stay duration, and cancellation pacing
              </p>
            </div>
          </div>

          <span className="text-xs text-blue-400 font-semibold">
            Pacing Analysis
          </span>
        </div>

        {/* 4 Trend Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Average Stay Length</span>
            <span className="font-serif-luxury text-xl font-bold text-white block">
              3.8 Nights
            </span>
            <span className="text-[11px] text-emerald-400">
              +0.4 nights vs last quarter
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Average Booking Window</span>
            <span className="font-serif-luxury text-xl font-bold text-white block">
              14.2 Days
            </span>
            <span className="text-[11px] text-amber-400">
              Advance booking lead time
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Peak Check-In Day</span>
            <span className="font-serif-luxury text-xl font-bold text-white block">
              Friday & Sat
            </span>
            <span className="text-[11px] text-blue-400">
              64% of luxury weekend stays
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Cancellation Rate</span>
            <span className="font-serif-luxury text-xl font-bold text-rose-400 block">
              4.2%
            </span>
            <span className="text-[11px] text-slate-400">
              Significantly lower than industry (12%)
            </span>
          </div>

        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Overall Resort Guest Retention Index</span>
          <span className="font-bold text-amber-400">
            94.8% High Satisfaction
          </span>
        </div>

      </div>

    </div>
  );
};

export default ActiveGuestsAndTrendsReport;
