import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  MapPin,
  CreditCard,
  Globe,
  Sparkles,
  ShieldCheck,
  Edit3,
  Trash2,
  Hotel,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useGuests } from '../context/useGuests';
import { fetchGuestByIdApi } from '../api/guestApi';
import GuestModal from '../components/guests/GuestModal';
import GuestDeleteModal from '../components/guests/GuestDeleteModal';

const GuestProfile = () => {
  const { id } = useParams();
  const { guests, openEditModal, openDeleteModal } = useGuests();

  const [guest, setGuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGuest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const existing = guests.find(
        (g) => String(g.id) === String(id) || String(g.email).toLowerCase() === String(id).toLowerCase()
      );
      if (existing) {
        setGuest(existing);
      } else {
        const res = await fetchGuestByIdApi(id);
        if (res && res.guest) {
          setGuest(res.guest);
        } else {
          setError('Guest record not found in directory.');
        }
      }
    } catch (err) {
      console.error('Error fetching guest profile:', err);
      setError(err.message || 'Failed to load guest profile.');
    } finally {
      setIsLoading(false);
    }
  }, [id, guests]);

  useEffect(() => {
    loadGuest();
  }, [loadGuest]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading guest profile...</p>
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Guest Not Found</h2>
            <p className="text-xs text-slate-400 mt-1">{error || `No record found for ID "${id}".`}</p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/guests"
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
            >
              Back to Guest Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link to="/guests" className="hover:text-amber-400 transition-colors">
            Guest Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-semibold">{guest.fullName}</span>
        </div>

        <Link
          to="/guests"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Guests</span>
        </Link>
      </div>

      {/* Profile Header Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={guest.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guest.fullName)}`}
              alt={guest.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 stroke-[2.5]" />
                  {guest.vipStatus || 'Standard Guest'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Patron
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                {guest.fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  {guest.nationality}
                </span>
                <span className="flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-amber-400" />
                  {guest.roomAssigned || 'No active suite'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Member since {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2025'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() => openEditModal(guest)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 shadow-md transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 stroke-[2.2]" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={() => openDeleteModal(guest)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 stroke-[2.2]" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal Contact & Identification (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Contact Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Email Address
                </span>
                <a
                  href={`mailto:${guest.email}`}
                  className="text-sm font-semibold text-slate-100 hover:text-amber-400 transition-colors block truncate"
                >
                  {guest.email}
                </a>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Mobile Number
                </span>
                <a
                  href={`tel:${guest.mobileNumber}`}
                  className="text-sm font-semibold text-slate-100 hover:text-amber-400 transition-colors block truncate"
                >
                  {guest.mobileNumber}
                </a>
              </div>
            </div>

            {/* Residential Address */}
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Residential Address
              </span>
              <div className="flex items-start gap-2 pt-0.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {guest.address}
                </span>
              </div>
            </div>
          </div>

          {/* Identification Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Identity Verification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  ID Proof Number
                </span>
                <span className="text-base font-bold font-mono text-amber-400 block">
                  {guest.idProofNumber}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Document Type: {guest.idProofType || 'Passport'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Country of Citizenship
                </span>
                <span className="text-base font-bold text-slate-100 block">
                  {guest.nationality}
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Government Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Hospitality History & Preferences (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Stay History Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              <span>Hospitality Overview</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Total Stays
                </span>
                <span className="text-xl font-bold text-slate-100 mt-0.5 block">
                  {guest.totalStays}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Current Status
                </span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">
                  {guest.stayStatus || 'Confirmed'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Assigned Accommodation
              </span>
              <span className="text-sm font-semibold text-slate-200 block">
                {guest.roomAssigned || 'No room currently assigned'}
              </span>
            </div>
          </div>

          {/* Concierge Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Concierge & Guest Preferences</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              {guest.notes || 'No custom dietary or accommodation preferences recorded for this guest.'}
            </p>
          </div>

        </div>

      </div>

      {/* Modals */}
      <GuestModal />
      <GuestDeleteModal />

    </div>
  );
};

export default GuestProfile;
