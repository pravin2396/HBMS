import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  Edit3,
  Trash2,
  Eye,
  Clock,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useRooms } from '../../context/useRooms';

const RoomCard = ({ room }) => {
  const { openEditModal, openDeleteModal } = useRooms();
  const [imgSrc, setImgSrc] = useState(room.image);

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </span>
        );
      case 'Occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 stroke-[2.2]" />
            Occupied
          </span>
        );
      case 'Under Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Wrench className="w-3 h-3 stroke-[2.2]" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600">
            {status}
          </span>
        );
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col group">
      
      {/* Room Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={imgSrc || fallbackImage}
          alt={`Room ${room.roomNumber} - ${room.roomType}`}
          onError={() => setImgSrc(fallbackImage)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60 text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Room {room.roomNumber}</span>
          </div>
          <div>
            {getStatusBadge(room.status)}
          </div>
        </div>

        {/* Floor & Capacity overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Floor {room.floor}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>
      </div>

      {/* Room Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Room Type */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                {room.roomType}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {room.description || 'Exclusive luxury accommodation with premier resort amenities.'}
              </p>
            </div>
          </div>

          {/* Amenities Chips */}
          {Array.isArray(room.amenities) && room.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {room.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-amber-400">${room.pricePerNight}</span>
              <span className="text-xs text-slate-400">/ night</span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5">
            {/* View Details Page */}
            <Link
              to={`/rooms/${room.id}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all duration-200 shadow-sm cursor-pointer"
              title="View Room Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => openEditModal(room)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-200 shadow-sm cursor-pointer"
              title="Edit Room"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => openDeleteModal(room)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-200 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-all duration-200 shadow-sm cursor-pointer"
              title="Delete Room"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RoomCard;
