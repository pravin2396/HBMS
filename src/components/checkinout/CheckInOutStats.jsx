import React from 'react';
import {
  LogIn,
  LogOut,
  BedDouble,
  DoorOpen,
  UserCheck,
  Sparkles
} from 'lucide-react';

const CheckInOutStats = ({ stats }) => {
  const {
    availableRoomsCount = 34,
    occupiedRoomsCount = 86,
    todayArrivalsCount = 0,
    inHouseCount = 0,
    completedCheckOutsCount = 0,
    totalRoomsCount = 120
  } = stats || {};

  const occupancyPercent = totalRoomsCount > 0
    ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100)
    : 72;

  const statCards = [
    {
      title: 'Ready for Check-In',
      value: todayArrivalsCount,
      subtext: 'Expected arrivals today',
      icon: LogIn,
      accent: 'from-amber-500 to-amber-600',
      badge: 'Arrivals'
    },
    {
      title: 'Active In-House',
      value: inHouseCount,
      subtext: 'Guests in stay / suites occupied',
      icon: UserCheck,
      accent: 'from-blue-500 to-indigo-600',
      badge: 'In Stay'
    },
    {
      title: 'Check-Outs Completed',
      value: completedCheckOutsCount,
      subtext: 'Suites released & bills settled',
      icon: LogOut,
      accent: 'from-purple-500 to-pink-600',
      badge: 'Departures'
    },
    {
      title: 'Available Rooms',
      value: availableRoomsCount,
      subtext: 'Ready for immediate check-in',
      icon: DoorOpen,
      accent: 'from-emerald-500 to-teal-600',
      badge: 'Vacant'
    },
    {
      title: 'Occupied Rooms',
      value: occupiedRoomsCount,
      subtext: `${occupancyPercent}% resort capacity`,
      icon: BedDouble,
      accent: 'from-yellow-500 to-amber-500',
      badge: `${occupancyPercent}%`
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {statCards.map((card, idx) => {
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

export default CheckInOutStats;
