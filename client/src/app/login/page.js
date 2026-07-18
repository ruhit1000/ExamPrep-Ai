'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn } from '../../lib/auth';

// ── Zod Validation Schema ──────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid academic email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long and contain both numbers and letters.' })
    .regex(/[A-Z]/, { message: 'Password must be at least 8 characters long and contain both numbers and letters.' })
    .regex(/[a-z]/, { message: 'Password must be at least 8 characters long and contain both numbers and letters.' })
    .regex(/[0-9]/, { message: 'Password must be at least 8 characters long and contain both numbers and letters.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ── Form Submit ──────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error.message || 'Login failed. Check your credentials.');
      } else {
        toast.success('Welcome back! 🎉');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Demo Login Fast-Path ─────────────────────────────────────────────────
  const handleDemoLogin = async () => {
    setValue('email', 'student@demo.com');
    setValue('password', 'Password123');
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: 'student@demo.com',
        password: 'Password123',
      });
      if (result?.error) {
        toast.error('Demo login failed. Please try manual login.');
      } else {
        toast.success('Welcome, Demo Student! 🎓');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      toast.error('Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google OAuth ─────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch {
      toast.error('Google sign-in failed.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e1b4b 50%, #0F172A 100%)' }}>

      <div className="w-full max-w-md">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #10B981)' }}>
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-white font-bold text-2xl">
              ExamPrep<span className="text-indigo-400"> AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to continue your study journey</p>
        </div>

        {/* ── Card ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200">

          {/* ── Demo Login Button ───────────────────────────────── */}
          <button
            id="demo-login-btn"
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 mb-6 rounded-xl text-sm font-semibold border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ borderColor: '#10B981', color: '#10B981', background: '#f0fdf4' }}
          >
            <span>🎓</span>
            Login as Demo Student
            <span className="text-xs font-normal text-emerald-600">(student@demo.com / Password123)</span>
          </button>

          {/* ── Divider ─────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">OR SIGN IN WITH EMAIL</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ── Form ────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@university.edu"
                autoComplete="email"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none
                  ${errors.email
                    ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none
                  ${errors.password
                    ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4f46e5)' }}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* ── Google OAuth ─────────────────────────────────────── */}
          <div className="mt-4">
            <button
              id="google-login-btn"
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <svg className="w-4 h-4 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          {/* ── Footer Link ──────────────────────────────────────── */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        {/* ── Back to home ─────────────────────────────────────── */}
        <p className="text-center mt-6">
          <Link href="/" className="text-slate-400 text-sm hover:text-slate-300 transition-colors">
            ← Back to home
          </Link>
        </p>

      </div>
    </div>
  );
}
