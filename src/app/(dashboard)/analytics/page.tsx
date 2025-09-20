'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/firestore';
import { Analytics } from '@/types';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed insights and analytics for your platform
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading analytics</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed insights and analytics for your platform
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Feedback
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    {analytics.totalFeedback}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Rating
                  </dt>
                  <dd className="text-lg font-medium text-yellow-600">
                    {analytics.averageRating}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Processed
                  </dt>
                  <dd className="text-lg font-medium text-purple-600">
                    {analytics.recentActivity.processedFeedback}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sentiment Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Sentiment Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Positive</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(analytics.sentimentDistribution.positive / analytics.totalFeedback) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {analytics.sentimentDistribution.positive}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Neutral</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-gray-600 h-2 rounded-full"
                      style={{
                        width: `${(analytics.sentimentDistribution.neutral / analytics.totalFeedback) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {analytics.sentimentDistribution.neutral}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Negative</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{
                        width: `${(analytics.sentimentDistribution.negative / analytics.totalFeedback) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {analytics.sentimentDistribution.negative}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity (7 days)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">New Feedback</span>
                <span className="text-lg font-semibold text-green-600">
                  {analytics.recentActivity.newFeedback}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Processed Feedback</span>
                <span className="text-lg font-semibold text-purple-600">
                  {analytics.recentActivity.processedFeedback}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback by Category */}
      {Object.keys(analytics.feedbackByCategory).length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Feedback by Category
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(analytics.feedbackByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



