import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Edit3,
  Trash2,
  Users,
  Clock,
  Wrench
} from 'lucide-react';
import { useRooms } from '../../context/useRooms';

const RoomTableView = ({ rooms }) => {
  const { openEditModal, openDeleteModal } = useRooms();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Available
          </span>
        );
      case 'Occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 stroke-[2.2]" />
            Occupied
          </span>
        );
      case 'Under Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Wrench className="w-3 h-3 stroke-[2.2]" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
            <tr>
              <th className="py-3.5 px-4">Room</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Floor</th>
              <th className="py-3.5 px-4">Capacity</th>
              <th className="py-3.5 px-4">Rate / Night</th>
              <th className="py-3.5 px-4">Amenities</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-slate-800/50 transition-colors">
                {/* Room Photo & Number */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={room.image}
                      alt={`Room ${room.roomNumber}`}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-amber-400 text-sm block">
                        Room {room.roomNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">ID: {room.id}</span>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3 px-4 font-semibold text-slate-100">
                  {room.roomType}
                </td>

                {/* Floor */}
                <td className="py-3 px-4 text-slate-300">
                  Floor {room.floor}
                </td>

                {/* Capacity */}
                <td className="py-3 px-4 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </td>

                {/* Rate */}
                <td className="py-3 px-4">
                  <span className="font-bold text-amber-400 text-sm">${room.pricePerNight}</span>
                </td>

                {/* Amenities */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(room.amenities) && room.amenities.slice(0, 2).map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {a}
                      </span>
                    ))}
                    {room.amenities?.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">
                        +{room.amenities.length - 2}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  {getStatusBadge(room.status)}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/rooms/${room.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(room)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Edit Room"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(room)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTableView;
