import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = Request Email, 2 = Enter New Password, 3 = Success
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { requestPasswordReset, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Step 1 Form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail }
  } = useForm({
    defaultValues: { email: '' }
  });

  // Step 2 Form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    getValues: getResetValues,
    formState: { errors: errorsReset }
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onEmailSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset(data.email);
      setVerifiedEmail(res.email);
      setStep(2);
    } catch {
      // Handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await resetPassword(verifiedEmail, data.newPassword);
      setStep(3);
    } catch {
      // Handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">

        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="font-serif-luxury text-2xl font-bold text-white">
                  Reset Your Password
                </h2>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Enter your registered Paradise account email address. We will verify your account to initiate a secure password reset.
                </p>
              </div>

              <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-4" noValidate>
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
                      placeholder="admin@paradise.com"
                      {...registerEmail('email', {
                        required: 'Please enter your account email',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        errorsEmail.email
                          ? 'border-red-500/80 focus:ring-red-500/30'
                          : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                      }`}
                    />
                  </div>
                  {errorsEmail.email && (
                    <p className="mt-1.5 text-xs text-red-400">{errorsEmail.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:brightness-105 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Verifying Account...' : 'Continue to Reset'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="font-serif-luxury text-2xl font-bold text-white">
                  Create New Password
                </h2>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Resetting credentials for <span className="text-amber-400 font-medium">{verifiedEmail}</span>
                </p>
              </div>

              <form onSubmit={handleSubmitReset(onPasswordSubmit)} className="space-y-4" noValidate>
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      {...registerReset('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        errorsReset.newPassword
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
                  {errorsReset.newPassword && (
                    <p className="mt-1.5 text-xs text-red-400">{errorsReset.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      {...registerReset('confirmPassword', {
                        required: 'Please confirm new password',
                        validate: (val) => val === getResetValues('newPassword') || 'Passwords do not match'
                      })}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        errorsReset.confirmPassword
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
                  {errorsReset.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-400">{errorsReset.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:brightness-105 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                Password Reset Complete
              </h2>
              <p className="text-slate-300 text-xs mb-6 leading-relaxed">
                Your password has been successfully updated. You can now use your new credentials to log into Paradise.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:brightness-105 transition-all cursor-pointer"
              >
                Proceed to Sign In
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
