import React from 'react';
import { BedDouble, DoorOpen, Percent, ShieldCheck, CheckCircle2 } from 'lucide-react';

const RoomOccupancyReport = ({ totalRooms = 120, occupiedRooms = 86, availableRooms = 34, occupancyRate = 72 }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
              Room Occupancy Analysis
            </h3>
            <p className="text-[11px] text-slate-400">
              Live ratio of active suite bookings vs. vacant inventory
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Optimal Capacity
        </span>
      </div>

      {/* Primary Circular & Meter Progress */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-slate-950 border border-slate-800">
        
        {/* Occupancy Rate Big Gauge */}
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* SVG Ring Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${occupancyRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif-luxury text-xl font-bold text-white leading-none">
                {occupancyRate}%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 mt-0.5">
                Occupied
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-serif-luxury text-base font-bold text-white">
              Resort Capacity Benchmark
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
              Exceeding luxury hospitality industry benchmark target of 70% average annual occupancy.
            </p>
          </div>
        </div>

        {/* Counts Split */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-around sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-4 sm:pt-0 sm:pl-6">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Occupied</span>
            <span className="font-serif-luxury text-xl font-bold text-amber-400">{occupiedRooms}</span>
            <span className="text-[10px] text-slate-400 block">Suites in stay</span>
          </div>

          <div className="h-8 w-px bg-slate-800"></div>

          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Available</span>
            <span className="font-serif-luxury text-xl font-bold text-emerald-400">{availableRooms}</span>
            <span className="text-[10px] text-slate-400 block">Ready to book</span>
          </div>

          <div className="h-8 w-px bg-slate-800"></div>

          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Total</span>
            <span className="font-serif-luxury text-xl font-bold text-white">{totalRooms}</span>
            <span className="text-[10px] text-slate-400 block">Inventory</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RoomOccupancyReport;
