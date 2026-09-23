import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Hotel } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState('User');

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'User',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setValue('role', newRole);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: role,
        password: data.password
      });
      navigate('/dashboard', { replace: true });
    } catch {
      // Error handled by AuthContext via Toastify
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-lg">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Hotel className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Join Paradise
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Create an account to manage bookings, suites, and VIP guest experiences
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
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
                  placeholder="e.g. Jonathan Hayes"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
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

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="jonathan@hotel.com"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-500/80 focus:ring-red-500/30'
                        : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
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
                    placeholder="+1 (555) 000-0000"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                        message: 'Valid phone number required'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-red-500/80 focus:ring-red-500/30'
                        : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                )}
              </div>

            </div>

            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Registering As (Role)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('User')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    role === 'User'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-semibold ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">User</div>
                    <div className="text-[10px] text-slate-400">Guest / Traveler</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('Hotel Owner')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    role === 'Hotel Owner'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-semibold ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    <Hotel className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Hotel Owner</div>
                    <div className="text-[10px] text-slate-400">Owner / Host</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 chars"
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-500/80 focus:ring-red-500/30'
                        : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (val) => val === getValues('password') || 'Passwords do not match'
                    })}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500/80 focus:ring-red-500/30'
                        : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('terms', {
                    required: 'You must agree to the Terms of Service to proceed'
                  })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span className="text-xs text-slate-400 leading-snug">
                  I agree to the Paradise Hotel{' '}
                  <span className="text-amber-400 hover:underline">Terms of Service</span> and{' '}
                  <span className="text-amber-400 hover:underline">Privacy Policy</span>.
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-400">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:brightness-105 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  Create Paradise Account
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;
