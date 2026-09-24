import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Globe,
  Sparkles
} from 'lucide-react';
import { useGuests } from '../../context/useGuests';

const GuestTable = ({ guests }) => {
  const { openEditModal, openDeleteModal } = useGuests();

  const getVipBadge = (tier) => {
    if (tier?.includes('Platinum') || tier?.includes('Diamond')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Sparkles className="w-3 h-3 stroke-[2.5]" />
          {tier}
        </span>
      );
    }
    if (tier?.includes('Gold')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
          {tier}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
        {tier || 'Standard'}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
            <tr>
              <th className="py-3.5 px-4">Guest</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Address</th>
              <th className="py-3.5 px-4">ID Proof Number</th>
              <th className="py-3.5 px-4">Nationality</th>
              <th className="py-3.5 px-4">Status / VIP</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {guests.map((guest) => (
              <tr key={guest.id} className="hover:bg-slate-800/50 transition-colors">
                
                {/* Guest Photo & Name */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={guest.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guest.fullName)}`}
                      alt={guest.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/30 shrink-0"
                    />
                    <div>
                      <Link
                        to={`/guests/${guest.id}`}
                        className="font-bold text-slate-100 hover:text-amber-400 transition-colors block text-sm"
                      >
                        {guest.fullName}
                      </Link>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        {guest.roomAssigned || 'No room assigned'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Contact: Email & Mobile */}
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{guest.mobileNumber}</span>
                    </div>
                  </div>
                </td>

                {/* Address */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-xs">{guest.address}</span>
                  </div>
                </td>

                {/* ID Proof Number */}
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {guest.idProofNumber}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {guest.idProofType || 'Passport'}
                    </span>
                  </div>
                </td>

                {/* Nationality */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{guest.nationality}</span>
                  </div>
                </td>

                {/* Status / VIP Tier */}
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    {getVipBadge(guest.vipStatus)}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {guest.totalStays} {guest.totalStays === 1 ? 'Stay' : 'Stays'}
                    </span>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    
                    {/* View Profile */}
                    <Link
                      to={`/guests/${guest.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                      title="View Guest Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {/* Edit Guest */}
                    <button
                      type="button"
                      onClick={() => openEditModal(guest)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Edit Guest Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Guest */}
                    <button
                      type="button"
                      onClick={() => openDeleteModal(guest)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Delete Guest"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default GuestTable;
