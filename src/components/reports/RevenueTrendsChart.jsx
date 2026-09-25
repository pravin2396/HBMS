import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  CalendarCheck,
  BarChart3,
  Percent,
  Sparkles
} from 'lucide-react';

const RevenueTrendsChart = ({ monthlyData, activePeriod, onPeriodChange }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [chartMode, setChartMode] = useState('revenue'); // 'revenue' | 'bookings'

  const data = monthlyData || [];
  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0), 300000);
  const maxBookings = Math.max(...data.map((d) => d.bookings || 0), 500);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white tracking-wide">
              Revenue & Monthly Bookings Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            12-month rolling financial metrics and reservation intake volume
          </p>
        </div>

        {/* View Mode & Period Selectors */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          {/* Toggle Revenue / Bookings */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setChartMode('revenue')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                chartMode === 'revenue'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue ($)
            </button>
            <button
              type="button"
              onClick={() => setChartMode('bookings')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                chartMode === 'bookings'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bookings
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['This Month', 'This Quarter', 'This Year'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onPeriodChange(period)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activePeriod === period
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="space-y-2">
        <div className="h-64 sm:h-72 w-full flex items-end gap-2 sm:gap-4 pt-8 px-2 relative">
          
          {/* Horizontal Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-slate-600 w-full"></div>
            <div className="border-b border-dashed border-slate-600 w-full"></div>
            <div className="border-b border-dashed border-slate-600 w-full"></div>
            <div className="border-b border-dashed border-slate-600 w-full"></div>
          </div>

          {data.map((item, idx) => {
            const isHovered = hoveredPoint === idx;
            const heightPercent = chartMode === 'revenue'
              ? Math.round((item.revenue / maxRevenue) * 100)
              : Math.round((item.bookings / maxBookings) * 100);

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-14 z-30 bg-slate-950 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-2xl text-center whitespace-nowrap animate-fade-in pointer-events-none">
                    <span className="font-mono text-[10px] text-amber-400 block font-semibold">
                      {item.month} 2026
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {chartMode === 'revenue'
                        ? `$${item.revenue.toLocaleString()}`
                        : `${item.bookings} Bookings`}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      {item.occupancy}% Occupancy
                    </span>
                  </div>
                )}

                {/* Animated Visual Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 relative ${
                    isHovered
                      ? 'bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 shadow-lg shadow-amber-500/30'
                      : chartMode === 'revenue'
                        ? 'bg-gradient-to-t from-slate-800 to-amber-500/80 group-hover:from-amber-600 group-hover:to-amber-400'
                        : 'bg-gradient-to-t from-slate-800 to-blue-500/80 group-hover:from-blue-600 group-hover:to-blue-400'
                  }`}
                >
                  {/* Subtle Top Cap Light */}
                  <div className="w-full h-1 bg-white/40 rounded-t-xl"></div>
                </div>

                {/* Month Label */}
                <span className={`text-[10px] sm:text-xs mt-2 font-medium ${isHovered ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500"></span>
              <span>{chartMode === 'revenue' ? 'Monthly Revenue ($ USD)' : 'Total Bookings Count'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Capacity Tracking</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Hover any month to inspect detailed audit
          </span>
        </div>
      </div>

    </div>
  );
};

export default RevenueTrendsChart;
