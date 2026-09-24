import React from 'react';

export const GuestTableSkeleton = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-pulse">
      <div className="h-12 bg-slate-950/80 border-b border-slate-800" />
      <div className="divide-y divide-slate-800">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-800 rounded" />
                <div className="h-3 w-24 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-4 w-28 bg-slate-800 rounded hidden md:block" />
            <div className="h-4 w-24 bg-slate-800 rounded hidden lg:block" />
            <div className="h-5 w-20 bg-slate-800 rounded-full" />
            <div className="h-8 w-16 bg-slate-800 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestTableSkeleton;
