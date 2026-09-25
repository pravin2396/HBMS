import React from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  UserCheck,
  Clock,
  Ban,
  DollarSign
} from 'lucide-react';
import { useBookingHistory } from '../../context/useBookingHistory';

const BookingHistoryStats = () => {
  const { stats } = useBookingHistory();
  const {
    totalBookings = 0,
    confirmedCount = 0,
    checkedInCount = 0,
    completedCount = 0,
    cancelledCount = 0,
    totalRevenue = 0,
    completedRevenue = 0
  } = stats || {};

  const cards = [
    {
      title: 'Total Historical Bookings',
      value: totalBookings,
      subtext: `$${totalRevenue.toLocaleString()} cumulative booking volume`,
      icon: CalendarCheck,
      accent: 'from-amber-500 to-amber-600',
      badge: 'All Time',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Completed Stays',
      value: completedCount,
      subtext: `$${completedRevenue.toLocaleString()} settled guest revenue`,
      icon: CheckCircle2,
      accent: 'from-emerald-500 to-teal-600',
      badge: 'Completed',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Active In-House Stays',
      value: checkedInCount,
      subtext: 'Guests currently in stay at resort',
      icon: UserCheck,
      accent: 'from-blue-500 to-indigo-600',
      badge: 'In Stay',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Confirmed Reservations',
      value: confirmedCount,
      subtext: 'Scheduled upcoming arrivals',
      icon: Clock,
      accent: 'from-cyan-500 to-teal-500',
      badge: 'Upcoming',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Cancelled Bookings',
      value: cancelledCount,
      subtext: `${totalBookings > 0 ? Math.round((cancelledCount / totalBookings) * 100) : 0}% cancellation rate`,
      icon: Ban,
      accent: 'from-rose-500 to-red-600',
      badge: 'Cancelled',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-4 hover:border-slate-700 transition-all duration-300 shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/10`}
              >
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeColor}`}
              >
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

export default BookingHistoryStats;
