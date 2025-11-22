import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentActivities from '@/components/dashboard/RecentActivities';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back! Here's your activity overview.</p>
          </div>
          <a
            href="/static-landing/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-red hover:text-brand-red-dark transition-colors border border-brand-red rounded-lg hover:bg-brand-red/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More About RouteIQ
          </a>
        </div>

        {/* Stats */}
        <StatsOverview />

        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </DashboardLayout>
  );
}
