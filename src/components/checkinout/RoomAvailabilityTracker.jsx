import React, { useState, useMemo } from 'react';
import {
  BedDouble,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  KeyRound,
  Search,
  LogIn,
  LogOut,
  Filter
} from 'lucide-react';
import { getStoredRooms } from '../../utils/roomStorage';

const RoomAvailabilityTracker = ({
  rooms = [],
  activeInHouseGuests = [],
  pendingArrivals = [],
  onOpenCheckIn,
  onOpenCheckOut
}) => {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Safe fallback to getStoredRooms if rooms array is not provided
  const safeRooms = useMemo(() => {
    try {
      if (Array.isArray(rooms) && rooms.length > 0) return rooms;
      const stored = getStoredRooms();
      return Array.isArray(stored) ? stored : [];
    } catch (e) {
      console.warn('Error reading stored rooms for tracker:', e);
      return [];
    }
  }, [rooms]);

  const safeInHouse = useMemo(() => {
    return Array.isArray(activeInHouseGuests) ? activeInHouseGuests : [];
  }, [activeInHouseGuests]);

  // Overall KPI statistics
  const stats = useMemo(() => {
    const total = safeRooms.length || 0;
    const occupied = safeRooms.filter((r) => r && String(r.status).toLowerCase() === 'occupied').length;
    const available = safeRooms.filter((r) => r && String(r.status).toLowerCase() === 'available').length;
    const cleaning = safeRooms.filter((r) => r && (String(r.status).toLowerCase() === 'cleaning' || String(r.status).toLowerCase() === 'under maintenance')).length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return { total, occupied, available, cleaning, occupancyRate };
  }, [safeRooms]);

  // Filtered rooms list for display
  const displayedRooms = useMemo(() => {
    return safeRooms.filter((room) => {
      if (!room) return false;
      const roomNum = String(room.roomNumber || '');
      const roomType = String(room.roomType || room.type || '').toLowerCase();
      const status = String(room.status || '').toLowerCase();
      const floor = String(room.floor || roomNum.charAt(0) || '');

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'available' && status !== 'available') return false;
        if (statusFilter === 'occupied' && status !== 'occupied') return false;
        if (statusFilter === 'cleaning' && status !== 'cleaning' && status !== 'under maintenance') return false;
      }

      // Floor filter
      if (selectedFloor !== 'all' && floor !== String(selectedFloor)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const occupant = safeInHouse.find((g) => g && String(g.roomNumber) === roomNum);
        const occupantName = occupant ? String(occupant.guestName || '').toLowerCase() : '';
        const matchesRoom = roomNum.includes(q) || roomType.includes(q);
        const matchesOccupant = occupantName.includes(q);
        if (!matchesRoom && !matchesOccupant) return false;
      }

      return true;
    });
  }, [safeRooms, statusFilter, selectedFloor, searchQuery, safeInHouse]);

  // Floors available
  const availableFloors = useMemo(() => {
    const floorsSet = new Set();
    safeRooms.forEach((r) => {
      if (r && r.floor) floorsSet.add(Number(r.floor));
    });
    return Array.from(floorsSet).sort((a, b) => a - b);
  }, [safeRooms]);

  return (
    <div className="space-y-6">
      
      {/* Live Room Availability KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Available Rooms */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Available Suites
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-400">{stats.available}</span>
              <span className="text-[10px] text-slate-500">Ready to Occupy</span>
            </div>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <BedDouble className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Occupied Suites
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-rose-400">{stats.occupied}</span>
              <span className="text-[10px] text-slate-500">In-House Guests</span>
            </div>
          </div>
        </div>

        {/* Cleaning / Maintenance */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Housekeeping
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-amber-400">{stats.cleaning}</span>
              <span className="text-[10px] text-slate-500">Turnover</span>
            </div>
          </div>
        </div>

        {/* Live Occupancy Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Occupancy Rate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">{stats.occupancyRate}%</span>
              <span className="text-[10px] text-slate-500">of {stats.total} total</span>
            </div>
          </div>
        </div>

      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Suites ({stats.total})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'available'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Available ({stats.available})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('occupied')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'occupied'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Occupied ({stats.occupied})
            </button>
          </div>

          {/* Search by Suite # or Guest Name */}
          <div className="relative md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suite # or guest..."
              className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* Floor Filter Bar */}
        {availableFloors.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] shrink-0">
              Floor Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedFloor('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                selectedFloor === 'all'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 font-bold'
                  : 'bg-slate-950/60 hover:text-white border border-slate-800/80'
              }`}
            >
              All Floors
            </button>
            {availableFloors.map((floorNum) => (
              <button
                key={floorNum}
                type="button"
                onClick={() => setSelectedFloor(String(floorNum))}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                  String(selectedFloor) === String(floorNum)
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40 font-bold'
                    : 'bg-slate-950/60 hover:text-white border border-slate-800/80'
                }`}
              >
                Floor {floorNum}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Room Status & Availability Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-amber-400" />
              <span>Real-Time Room Inventory Grid</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live suite statuses update automatically upon Check-In (Available ➔ Occupied) and Check-Out (Occupied ➔ Available)
            </p>
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{displayedRooms.length}</strong> of {stats.total} suites
          </span>
        </div>

        {/* Room Tiles */}
        {displayedRooms.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400">No suites match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {displayedRooms.slice(0, 36).map((room) => {
              const roomNum = String(room.roomNumber || '');
              const statusStr = String(room.status || '').toLowerCase();
              const isOccupied = statusStr === 'occupied';
              const isAvailable = statusStr === 'available';
              const occupant = safeInHouse.find((g) => g && String(g.roomNumber) === roomNum);

              return (
                <div
                  key={room.id || roomNum}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isOccupied
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200 hover:border-rose-500/50'
                      : isAvailable
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 hover:border-emerald-500/50'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-200 hover:border-amber-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-sm text-white">
                        #{roomNum}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                          isOccupied
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isAvailable
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isOccupied ? 'Occupied' : isAvailable ? 'Available' : 'Turnover'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-medium truncate">
                      {room.roomType || room.type || 'Luxury Suite'}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Floor {room.floor || roomNum.charAt(0)} • ${room.pricePerNight || 250}/night
                    </div>

                    {isOccupied && occupant ? (
                      <div className="text-[10px] text-rose-300 font-medium truncate mt-2 pt-1.5 border-t border-rose-500/20 flex items-center gap-1">
                        <span className="truncate">👤 {occupant.guestName}</span>
                      </div>
                    ) : isAvailable ? (
                      <div className="text-[10px] text-emerald-400/90 truncate mt-2 pt-1.5 border-t border-emerald-500/20">
                        ✓ Ready for Check-In
                      </div>
                    ) : (
                      <div className="text-[10px] text-amber-400/90 truncate mt-2 pt-1.5 border-t border-amber-500/20">
                        ✦ Housekeeping Service
                      </div>
                    )}
                  </div>

                  {/* Quick Action Button on Room Tile */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    {isAvailable && onOpenCheckIn && (
                      <button
                        type="button"
                        onClick={() => onOpenCheckIn({ roomNumber: roomNum, suiteType: room.roomType || room.type })}
                        className="w-full py-1 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Check-In</span>
                      </button>
                    )}

                    {isOccupied && onOpenCheckOut && occupant && (
                      <button
                        type="button"
                        onClick={() => onOpenCheckOut(occupant)}
                        className="w-full py-1 px-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Check-Out</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {displayedRooms.length > 36 && (
          <p className="text-center text-xs text-slate-500 pt-2">
            Showing first 36 suites. Use floor or status filters above to view specific sections.
          </p>
        )}
      </div>

    </div>
  );
};

export default RoomAvailabilityTracker;
