import React from 'react';

export const RoomCardSkeleton = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg animate-pulse flex flex-col">
      <div className="h-52 bg-slate-800 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-800 rounded w-24" />
            <div className="h-5 bg-slate-800 rounded-full w-20" />
          </div>
          <div className="h-6 bg-slate-800 rounded w-40" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-5 bg-slate-800 rounded-md w-16" />
          <div className="h-5 bg-slate-800 rounded-md w-16" />
          <div className="h-5 bg-slate-800 rounded-md w-16" />
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="h-6 bg-slate-800 rounded w-28" />
          <div className="h-8 bg-slate-800 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

export const RoomSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default RoomSkeletonGrid;
