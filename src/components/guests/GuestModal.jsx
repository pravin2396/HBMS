import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Globe,
  Loader2,
  Hotel
} from 'lucide-react';
import { useGuests } from '../../context/useGuests';
import {
  NATIONALITY_OPTIONS,
  ID_PROOF_TYPES,
  VIP_TIERS
} from '../../utils/guestStorage';

const GuestModal = () => {
  const {
    isAddModalOpen,
    isEditModalOpen,
    closeAddModal,
    closeEditModal,
    selectedGuest,
    addGuest,
    editGuest
  } = useGuests();

  const isOpen = isAddModalOpen || isEditModalOpen;
  const isEditing = isEditModalOpen && selectedGuest;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      address: '',
      idProofNumber: '',
      idProofType: 'Passport',
      nationality: 'United States',
      vipStatus: 'Standard Guest',
      roomAssigned: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          fullName: selectedGuest.fullName || '',
          email: selectedGuest.email || '',
          mobileNumber: selectedGuest.mobileNumber || '',
          address: selectedGuest.address || '',
          idProofNumber: selectedGuest.idProofNumber || '',
          idProofType: selectedGuest.idProofType || 'Passport',
          nationality: selectedGuest.nationality || 'United States',
          vipStatus: selectedGuest.vipStatus || 'Standard Guest',
          roomAssigned: selectedGuest.roomAssigned || '',
          notes: selectedGuest.notes || ''
        });
      } else {
        reset({
          fullName: '',
          email: '',
          mobileNumber: '',
          address: '',
          idProofNumber: '',
          idProofType: 'Passport',
          nationality: 'United States',
          vipStatus: 'Standard Guest',
          roomAssigned: '',
          notes: ''
        });
      }
    }
  }, [isOpen, isEditing, selectedGuest, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isEditing) {
      closeEditModal();
    } else {
      closeAddModal();
    }
  };

  const onSubmit = async (data) => {
    if (isEditing) {
      await editGuest(selectedGuest.id, data);
    } else {
      await addGuest(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {isEditing ? `Edit Guest: ${selectedGuest?.fullName}` : 'Register New Guest'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update guest contact information, identification, and concierge notes'
                  : 'Enter guest credentials, nationality, address, and ID proof to register in Paradise Directory'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto" noValidate>
          
          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Lady Genevieve Vance"
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' }
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all ${
                    errors.fullName ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.fullName && (
                <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. genevieve@luxury.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Mobile Number & Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Mobile Number <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="+1 (555) 234-8891"
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    minLength: { value: 7, message: 'Please enter a valid phone number' }
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all ${
                    errors.mobileNumber ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                  {errors.mobileNumber.message}
                </span>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Nationality <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <select
                  {...register('nationality', { required: 'Nationality is required' })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none cursor-pointer"
                >
                  {NATIONALITY_OPTIONS.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: ID Proof Number & ID Proof Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ID Proof Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                ID Proof Number <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. PASS-US-982341"
                  {...register('idProofNumber', {
                    required: 'ID proof number is required',
                    minLength: { value: 4, message: 'Minimum 4 characters required' }
                  })}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none transition-all ${
                    errors.idProofNumber ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.idProofNumber && (
                <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                  {errors.idProofNumber.message}
                </span>
              )}
            </div>

            {/* ID Proof Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                ID Proof Type <span className="text-amber-400">*</span>
              </label>
              <select
                {...register('idProofType')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none cursor-pointer"
              >
                {ID_PROOF_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Residential Address <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-500">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea
                rows={2}
                placeholder="Street address, City, State/Province, Postal Code, Country..."
                {...register('address', {
                  required: 'Address is required',
                  minLength: { value: 5, message: 'Please provide a complete address' }
                })}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none transition-all ${
                  errors.address ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                }`}
              />
            </div>
            {errors.address && (
              <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* Row 5: VIP Tier & Assigned Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                VIP Membership Tier
              </label>
              <select
                {...register('vipStatus')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none cursor-pointer"
              >
                {VIP_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Assigned Room / Suite (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Hotel className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Suite 701, Villa 404"
                  {...register('roomAssigned')}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Concierge Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Concierge & Preferences Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Guest dietary requirements, room preferences, arrival amenities..."
              {...register('notes')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Register Guest'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default GuestModal;
