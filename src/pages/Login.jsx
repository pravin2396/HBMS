import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Mail, Lock, Eye, EyeOff, LogIn, Hotel, Sparkles, User, CheckCircle2, Shield } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState('User');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password, role);
      navigate(redirectPath, { replace: true });
    } catch {
      // Error is caught and toasted by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'owner') {
      setRole('Hotel Owner');
      setValue('email', 'owner@paradise.com', { shouldValidate: true });
      setValue('password', 'Admin@123', { shouldValidate: true });
    } else {
      setRole('User');
      setValue('email', 'user@paradise.com', { shouldValidate: true });
      setValue('password', 'User@123', { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        
        {/* Header Brand Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Hotel className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome to Paradise
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Access your luxury hotel management & reservation portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          
          {/* Quick Demo Credentials Widget */}
          <div className="mb-5 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Demo Accounts (Click to Auto-Fill)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('owner')}
                className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                  role === 'Hotel Owner'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-slate-900 hover:bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-400" /> Hotel Owner
                </div>
                <div className="text-[11px] text-slate-400 truncate">owner@paradise.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('user')}
                className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                  role === 'User'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-slate-900 hover:bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> User
                </div>
                <div className="text-[11px] text-slate-400 truncate">user@paradise.com</div>
              </button>
            </div>
          </div>

          {/* Role Selector Tabs */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Sign In As
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('User')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'User'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                User
              </button>

              <button
                type="button"
                onClick={() => setRole('Hotel Owner')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'Hotel Owner'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Hotel className="w-3.5 h-3.5" />
                Hotel Owner
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
            {/* Email Field */}
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
                  placeholder={role === 'Hotel Owner' ? 'owner@paradise.com' : 'user@paradise.com'}
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
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
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500/80 focus:ring-red-500/30'
                      : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span className="text-xs text-slate-300">Keep me logged in on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:brightness-105 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Authenticating as {role}...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  Sign In as {role}
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
              >
                Register a new account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
