import DashboardStats from '@/components/DashboardStats';
import RecentFeedback from '@/components/RecentFeedback';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your Feedbackly platform
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentFeedback />
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-lg mr-3">👥</span>
                  <div>
                    <div className="font-medium text-gray-900">View All Users</div>
                    <div className="text-sm text-gray-500">Manage user accounts</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-lg mr-3">💬</span>
                  <div>
                    <div className="font-medium text-gray-900">Review Feedback</div>
                    <div className="text-sm text-gray-500">Process new feedback</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-lg mr-3">📈</span>
                  <div>
                    <div className="font-medium text-gray-900">View Analytics</div>
                    <div className="text-sm text-gray-500">Detailed insights</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
