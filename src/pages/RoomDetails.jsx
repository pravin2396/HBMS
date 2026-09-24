import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BedDouble,
  Layers,
  Users,
  Sparkles,
  Wifi,
  Tv,
  Eye,
  Bath,
  Coffee,
  Wine,
  ShieldCheck,
  Edit3,
  Trash2,
  Clock,
  Wrench,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { useRooms } from '../context/useRooms';
import { fetchRoomByIdApi } from '../api/roomsApi';
import RoomModal from '../components/rooms/RoomModal';
import RoomDeleteModal from '../components/rooms/RoomDeleteModal';

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, openEditModal, openDeleteModal, toggleRoomStatus } = useRooms();

  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch room data
  const loadRoom = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First check if room is already present in RoomContext
      const existing = rooms.find((r) => String(r.id) === String(id) || String(r.roomNumber) === String(id));
      if (existing) {
        setRoom(existing);
      } else {
        const res = await fetchRoomByIdApi(id);
        if (res && res.room) {
          setRoom(res.room);
        } else {
          setError('Room not found in hotel inventory.');
        }
      }
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError(err.message || 'Failed to load room details.');
    } finally {
      setIsLoading(false);
    }
  }, [id, rooms]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  // Amenity icon mapping
  const getAmenityIcon = (amenity) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet')) return <Wifi className="w-4 h-4 text-amber-400" />;
    if (a.includes('tv') || a.includes('cinema')) return <Tv className="w-4 h-4 text-amber-400" />;
    if (a.includes('ocean') || a.includes('view') || a.includes('balcony')) return <Eye className="w-4 h-4 text-amber-400" />;
    if (a.includes('jacuzzi') || a.includes('tub') || a.includes('shower') || a.includes('spa')) return <Bath className="w-4 h-4 text-amber-400" />;
    if (a.includes('coffee') || a.includes('espresso')) return <Coffee className="w-4 h-4 text-amber-400" />;
    if (a.includes('bar') || a.includes('wine')) return <Wine className="w-4 h-4 text-amber-400" />;
    if (a.includes('bed')) return <BedDouble className="w-4 h-4 text-amber-400" />;
    return <Sparkles className="w-4 h-4 text-amber-400" />;
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for Booking
          </span>
        );
      case 'Occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Currently Occupied
          </span>
        );
      case 'Under Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Wrench className="w-3.5 h-3.5" />
            Under Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading room specifications...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Room Not Found</h2>
            <p className="text-xs text-slate-400 mt-1">{error || `Room with ID "${id}" could not be located.`}</p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/rooms"
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
            >
              Back to Room List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Bar: Breadcrumbs & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link to="/rooms" className="hover:text-amber-400 transition-colors">
            Rooms & Suites
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-semibold">Room {room.roomNumber}</span>
        </div>

        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rooms</span>
        </Link>
      </div>

      {/* Main Grid: Left Column Photo & Quick Info | Right Column Specs & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Hero Image & Gallery (spans 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-80 sm:h-96 w-full group">
            <img
              src={room.image}
              alt={`Room ${room.roomNumber}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

            {/* Top Overlay Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-amber-400 flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>Paradise Suite {room.roomNumber}</span>
              </div>
              <div>{getStatusBadge(room.status)}</div>
            </div>

            {/* Bottom Overlay Title */}
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
                Floor {room.floor} • West Wing
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                {room.roomType}
              </h2>
            </div>
          </div>

          {/* Quick Info Strip Under Photo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Floor</span>
              <span className="text-base font-bold text-slate-100 flex items-center justify-center gap-1 mt-0.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Floor {room.floor}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Capacity</span>
              <span className="text-base font-bold text-slate-100 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Nightly Rate</span>
              <span className="text-base font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                ${room.pricePerNight}
              </span>
            </div>
          </div>

          {/* Room Description */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Accommodation Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {room.description ||
                'This exclusive accommodation at Paradise Hotel & Resort blends contemporary architecture with bespoke comfort. Features signature Italian linens, high-definition entertainment, curated art pieces, and an en-suite spa bathroom.'}
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified sanitized and pre-inspected by Paradise Executive Housekeeping</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Breakdown, Amenities, and Actions (spans 5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Rate Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Nightly Tariff
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-amber-400 font-serif-luxury">
                    ${room.pricePerNight}
                  </span>
                  <span className="text-xs text-slate-400">/ night</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                Tax & Resort Fee Included
              </span>
            </div>

            {/* Estimated Stays */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Weekend Stay (2 Nights):</span>
                <span className="font-semibold text-slate-100">${room.pricePerNight * 2}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Weekly Rate (7 Nights):</span>
                <span className="font-semibold text-slate-100">${room.pricePerNight * 7}</span>
              </div>
            </div>

            {/* Quick Status Change */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Quick Status Switch:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => toggleRoomStatus(room.id, 'Available')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    room.status === 'Available'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 border border-slate-800 text-emerald-400 hover:border-emerald-500/40'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => toggleRoomStatus(room.id, 'Occupied')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    room.status === 'Occupied'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 border border-slate-800 text-amber-400 hover:border-amber-500/40'
                  }`}
                >
                  Occupied
                </button>
                <button
                  type="button"
                  onClick={() => toggleRoomStatus(room.id, 'Under Maintenance')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    room.status === 'Under Maintenance'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-950 border border-slate-800 text-rose-400 hover:border-rose-500/40'
                  }`}
                >
                  Maintenance
                </button>
              </div>
            </div>
          </div>

          {/* Full Amenities List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Included Amenities & Perks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Array.isArray(room.amenities) && room.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200"
                >
                  <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    {getAmenityIcon(amenity)}
                  </div>
                  <span className="font-medium truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Management Buttons */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inventory Actions
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openEditModal(room)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 shadow-md transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 stroke-[2.2]" />
                <span>Edit Room</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  openDeleteModal(room);
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4 stroke-[2.2]" />
                <span>Delete</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <RoomModal />
      <RoomDeleteModal />

    </div>
  );
};

export default RoomDetails;
