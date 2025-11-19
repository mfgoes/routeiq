import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentActivities from '@/components/dashboard/RecentActivities';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's your activity overview.</p>
        </div>

        {/* Stats */}
        <StatsOverview />

        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </DashboardLayout>
  );
}
