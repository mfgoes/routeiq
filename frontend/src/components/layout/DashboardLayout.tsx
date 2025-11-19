'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else if (!user) {
      fetchUser();
    }
  }, [token, user, router, fetchUser]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Activities', href: '/activities', icon: '🏃' },
    { name: 'Routes', href: '/routes', icon: '🗺️' },
    { name: 'Workouts', href: '/workouts', icon: '💪', badge: 'Soon' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-brand-red">RouteIQ</span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === item.href
                        ? 'text-brand-red border-b-2 border-brand-red'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {user.firstName || user.email}
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  {user.subscriptionTier}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="flex overflow-x-auto px-4 space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-shrink-0 py-3 px-2 text-sm font-medium ${
                pathname === item.href
                  ? 'text-brand-red border-b-2 border-brand-red'
                  : 'text-gray-500'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
