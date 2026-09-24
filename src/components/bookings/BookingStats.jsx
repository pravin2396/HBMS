import React from 'react';
import {
  CalendarDays,
  UserCheck,
  Clock,
  Ban,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const BookingStats = ({ stats }) => {
  const {
    total = 0,
    checkedIn = 0,
    confirmed = 0,
    todayArrivals = 0,
    cancelled = 0,
    totalRevenue = 0
  } = stats || {};

  const statCards = [
    {
      title: 'Total Bookings',
      value: total,
      subtext: 'Cumulative reservations',
      icon: CalendarDays,
      accent: 'from-amber-500 to-amber-600',
      badge: '+12% this month'
    },
    {
      title: 'Active In-House',
      value: checkedIn,
      subtext: 'Guests currently staying',
      icon: UserCheck,
      accent: 'from-emerald-500 to-teal-600',
      badge: 'Live Stay'
    },
    {
      title: "Today's Arrivals",
      value: todayArrivals,
      subtext: 'Scheduled check-ins today',
      icon: Clock,
      accent: 'from-blue-500 to-cyan-600',
      badge: 'Arriving'
    },
    {
      title: 'Confirmed Upcoming',
      value: confirmed,
      subtext: 'Advance guaranteed bookings',
      icon: TrendingUp,
      accent: 'from-indigo-500 to-purple-600',
      badge: 'Guaranteed'
    },
    {
      title: 'Booking Revenue',
      value: `$${Number(totalRevenue).toLocaleString()}`,
      subtext: 'Gross booking receipts',
      icon: DollarSign,
      accent: 'from-yellow-500 to-amber-500',
      badge: 'Revenue'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {statCards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-4 hover:border-slate-700 transition-all duration-300 group shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/10`}
              >
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {card.badge}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                {card.title}
              </p>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white tracking-tight">
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingStats;
