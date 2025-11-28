'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Hero with image and USPs */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-red to-red-800 items-center justify-center p-12">
        <div className="max-w-lg text-white space-y-8">
          <div className="flex justify-center">
            <Image
              src="/images/barbell_preview.jpg"
              alt="RouteIQ Fitness"
              width={300}
              height={300}
              className="drop-shadow-2xl"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Track every rep, set, and PR</h3>
              <p className="text-red-100">Log your workouts with precision and see your progress over time</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Progressive overload made simple</h3>
              <p className="text-red-100">Smart suggestions help you lift more weight and build more muscle</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Build strength, gain confidence</h3>
              <p className="text-red-100">Watch your numbers grow as you become the strongest version of yourself</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-4xl font-bold text-brand-dark">
              RouteIQ
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-red focus:border-brand-red focus:z-10 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-red focus:border-brand-red focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/register" className="font-medium text-brand-red hover:text-red-700">
                Sign up
              </Link>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-500">Demo account:</p>
              <p className="text-gray-600 font-mono text-xs">demo@routeiq.com / password123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
