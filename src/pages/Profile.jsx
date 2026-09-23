import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import { User, Mail, Phone, Shield, Calendar, Save, Building, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || 'Guest & Reservations'
    }
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
        department: data.department
      });
    } catch {
      // Handled in AuthContext
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Active Member';

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs text-slate-500 font-mono">
            ID: {user?.id}
          </span>
        </div>

        {/* Profile Header Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
            alt={user?.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-amber-500/40 shadow-xl shadow-amber-500/10"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                {user?.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                {user?.role || 'User'}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-3">
              {user?.department || (user?.role === 'Hotel Owner' ? 'Hotel Ownership & Properties' : 'Guest & Reservations')}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Member since {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <h2 className="font-serif-luxury text-xl font-bold text-white">
              Edit Account Information
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Changes will update your active session and persist into LocalStorage.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Name cannot be empty',
                      minLength: { value: 2, message: 'Minimum 2 characters' }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-500/80 focus:ring-red-500/30'
                        : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address (Primary Login)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-400 text-sm cursor-not-allowed opacity-75"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Email address is linked to your primary account authentication key.
                </span>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Department / Division */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Department / VIP Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    {...register('department')}
                    placeholder="e.g. VIP Concierge / Guest"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving || !isDirty}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:brightness-105 active:scale-[0.99] transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving ? (
                  <span>Saving Changes...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
