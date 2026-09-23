import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, Sparkles } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { name: 'Suite & Room Bookings', amount: 168980, percentage: 68, color: 'bg-amber-500' },
  { name: 'Fine Dining & Room Service', amount: 44730, percentage: 18, color: 'bg-emerald-500' },
  { name: 'Luxury Spa & Wellness', amount: 22365, percentage: 9, color: 'bg-purple-500' },
  { name: 'Private Events & Banquets', amount: 12425, percentage: 5, color: 'bg-blue-500' }
];

const DEFAULT_MONTHLY_TRENDS = [
  { month: 'Oct', revenue: 198000, bookings: 320 },
  { month: 'Nov', revenue: 215000, bookings: 355 },
  { month: 'Dec', revenue: 278000, bookings: 440 },
  { month: 'Jan', revenue: 232000, bookings: 380 },
  { month: 'Feb', revenue: 210000, bookings: 345 },
  { month: 'Mar', revenue: 242000, bookings: 395 },
  { month: 'Apr', revenue: 225000, bookings: 360 },
  { month: 'May', revenue: 254000, bookings: 410 },
  { month: 'Jun', revenue: 268000, bookings: 430 },
  { month: 'Jul', revenue: 285000, bookings: 460 },
  { month: 'Aug', revenue: 274000, bookings: 445 },
  { month: 'Sep', revenue: 248500, bookings: 438 }
];

const RevenueSummary = ({ revenueData }) => {
  const [activePeriod, setActivePeriod] = useState('This Month');
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const revenue = {
    grossRevenue: revenueData?.grossRevenue || 248500,
    monthlyTarget: revenueData?.monthlyTarget || 280000,
    adr: revenueData?.adr || 320,
    revPar: revenueData?.revPar || 229,
    growthRate: revenueData?.growthRate || '+14.6%',
    categories: (Array.isArray(revenueData?.categories) && revenueData.categories.length > 0)
      ? revenueData.categories
      : DEFAULT_CATEGORIES,
    monthlyTrends: (Array.isArray(revenueData?.monthlyTrends) && revenueData.monthlyTrends.length > 0)
      ? revenueData.monthlyTrends
      : DEFAULT_MONTHLY_TRENDS
  };

  // Adjust dummy values slightly based on selected period
  const getMultiplier = (period) => {
    switch (period) {
      case 'Last Month': return 0.92;
      case 'This Quarter': return 2.85;
      case 'This Year': return 11.4;
      default: return 1.0;
    }
  };

  const multiplier = getMultiplier(activePeriod);
  const displayedRevenue = Math.round(revenue.grossRevenue * multiplier);
  const targetRevenue = Math.round(revenue.monthlyTarget * multiplier);
  const progressPercent = Math.min(100, Math.round((displayedRevenue / targetRevenue) * 100));

  const maxMonthlyRevenue = Math.max(...(revenue.monthlyTrends?.map((m) => m.revenue) || [300000]));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Header & Period Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white tracking-tight">
              Revenue Summary & Financial Performance
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time hospitality revenue tracking, ADR pacing, and departmental income breakdown
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          {['This Month', 'Last Month', 'This Quarter', 'This Year'].map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activePeriod === period
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Financial Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Gross Revenue */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Gross Revenue</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-semibold text-[11px]">
              <TrendingUp className="w-3 h-3" /> {revenue.growthRate}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            ${displayedRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {progressPercent}% of target pacing (${targetRevenue.toLocaleString()})
          </div>
        </div>

        {/* Average Daily Rate (ADR) */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Daily Rate (ADR)</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            ${revenue.adr}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Per occupied suite / night
          </div>
        </div>

        {/* RevPAR */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>RevPAR</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            ${revenue.revPar}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Revenue per available room
          </div>
        </div>

        {/* Net Profit Margin (Simulated) */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Operating Profit Margin</span>
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-serif-luxury">
            38.4%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Net EBIT margin performance
          </div>
        </div>

      </div>

      {/* Monthly Revenue Trend Visual Chart */}
      <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            12-Month Revenue & Booking Pacing
          </div>
          <div className="text-xs text-slate-400">
            {hoveredMonth ? (
              <span className="text-amber-400 font-medium">
                {hoveredMonth.month}: ${hoveredMonth.revenue.toLocaleString()} ({hoveredMonth.bookings} bookings)
              </span>
            ) : (
              <span>Hover bars for detailed month revenue</span>
            )}
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6">
          {revenue.monthlyTrends?.map((item, i) => {
            const heightPercentage = Math.round((item.revenue / maxMonthlyRevenue) * 100);
            const isLatestMonth = i === revenue.monthlyTrends.length - 1;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredMonth(item)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <div className="w-full max-w-[28px] h-full flex items-end">
                  <div
                    style={{ height: `${heightPercentage}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isLatestMonth
                        ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 shadow-lg shadow-amber-500/20 group-hover:brightness-110'
                        : 'bg-slate-800 group-hover:bg-amber-500/50'
                    }`}
                  ></div>
                </div>
                <span
                  className={`mt-2 text-[10px] font-medium transition-colors ${
                    isLatestMonth ? 'text-amber-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Departmental Revenue Contribution
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revenue.categories?.map((cat) => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{cat.name}</span>
                <span className="text-slate-400">
                  <span className="text-white font-semibold">${Math.round(cat.amount * multiplier).toLocaleString()}</span>{' '}
                  ({cat.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                  style={{ width: `${cat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RevenueSummary;
