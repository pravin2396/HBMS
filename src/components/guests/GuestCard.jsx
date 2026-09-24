import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Globe
} from 'lucide-react';
import { useGuests } from '../../context/useGuests';

const GuestCard = ({ guest }) => {
  const { openEditModal, openDeleteModal } = useGuests();

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-4 group">
      
      {/* Top Section: Avatar, Name, VIP status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={guest.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guest.fullName)}`}
            alt={guest.fullName}
            className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40 shrink-0"
          />
          <div>
            <Link
              to={`/guests/${guest.id}`}
              className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors block"
            >
              {guest.fullName}
            </Link>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Globe className="w-3 h-3 text-cyan-400" />
              {guest.nationality}
            </span>
          </div>
        </div>

        {/* VIP badge */}
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
          {guest.vipStatus || 'Standard'}
        </span>
      </div>

      {/* Contact & Info Details */}
      <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{guest.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{guest.mobileNumber}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{guest.address}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-slate-500" />
            {guest.idProofType || 'ID'}:
          </span>
          <span className="font-mono font-bold text-slate-200">{guest.idProofNumber}</span>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          {guest.totalStays} {guest.totalStays === 1 ? 'Stay' : 'Stays'} completed
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/guests/${guest.id}`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => openEditModal(guest)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
            title="Edit Guest"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => openDeleteModal(guest)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 transition-colors cursor-pointer"
            title="Delete Guest"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default GuestCard;
