'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/firestore';
import { Analytics } from '@/types';

export default function DashboardStats() {
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading analytics</div>;
  }

  const stats = [
    {
      name: 'Total Feedback',
      value: analytics.totalFeedback,
      icon: '💬',
      color: 'text-green-600',
    },
    {
      name: 'Average Rating',
      value: analytics.averageRating.toFixed(1),
      icon: '⭐',
      color: 'text-yellow-600',
    },
    {
      name: 'Processed Feedback',
      value: analytics.recentActivity.processedFeedback,
      icon: '✅',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className={`text-lg font-medium ${stat.color}`}>
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



