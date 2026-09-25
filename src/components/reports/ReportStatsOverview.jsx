import React from 'react';
import {
  DollarSign,
  CalendarCheck,
  BedDouble,
  Users,
  Award,
  TrendingUp,
  Percent,
  Sparkles
} from 'lucide-react';

const ReportStatsOverview = ({ data }) => {
  const {
    totalRevenue = 248500,
    monthlyTarget = 280000,
    totalBookingsCount = 438,
    totalRooms = 120,
    occupiedRooms = 86,
    availableRooms = 34,
    occupancyRate = 72,
    activeGuestsCount = 42,
    totalPatrons = 214,
    topBookedRoom = { type: 'Royal Oceanfront Villa', share: 32 },
    adr = 320,
    revPar = 229
  } = data || {};

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      subtext: `Target: $${monthlyTarget.toLocaleString()} • ADR: $${adr}`,
      icon: DollarSign,
      accent: 'from-amber-500 to-amber-600',
      badge: '+14.6% YoY',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Monthly Bookings',
      value: totalBookingsCount,
      subtext: '438 confirmed reservations this month',
      icon: CalendarCheck,
      accent: 'from-blue-500 to-indigo-600',
      badge: 'High Demand',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Room Occupancy Rate',
      value: `${occupancyRate}%`,
      subtext: `${occupiedRooms} occupied • ${availableRooms} available suites`,
      icon: BedDouble,
      accent: 'from-emerald-500 to-teal-600',
      badge: 'RevPAR: $' + revPar,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Active In-House Guests',
      value: activeGuestsCount,
      subtext: `${totalPatrons} total patrons in directory`,
      icon: Users,
      accent: 'from-purple-500 to-pink-600',
      badge: 'In Stay',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Most Booked Room Type',
      value: topBookedRoom.type || 'Oceanfront Villa',
      subtext: `${topBookedRoom.share || 32}% of all resort reservations`,
      icon: Award,
      accent: 'from-yellow-500 to-amber-500',
      badge: 'Top Suite',
      badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-4 hover:border-slate-700 transition-all duration-300 shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.accent} flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/10`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.badgeColor}`}
              >
                {c.badge}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                {c.title}
              </p>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {c.value}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {c.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportStatsOverview;
