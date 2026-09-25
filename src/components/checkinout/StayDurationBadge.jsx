import React from 'react';
import { Clock, Calendar, Moon } from 'lucide-react';

/**
 * Visual badge for displaying stay duration across roster, tables, and modals
 */
const StayDurationBadge = ({
  checkInDate,
  checkOutDate,
  nights = null,
  isCompleted = false
}) => {
  let calculatedNights = nights;

  if (!calculatedNights && checkInDate && checkOutDate) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    calculatedNights = diff;
  }

  const durationStr = `${calculatedNights || 1} ${calculatedNights === 1 ? 'Night' : 'Nights'}`;

  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
        <Moon className="w-3.5 h-3.5 text-amber-400" />
        <span>Completed: {durationStr}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-xs">
      <Moon className="w-3.5 h-3.5 text-amber-400" />
      <span>{durationStr} Stay</span>
    </span>
  );
};

export default StayDurationBadge;
