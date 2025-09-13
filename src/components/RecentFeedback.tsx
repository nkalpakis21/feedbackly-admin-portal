'use client';

import { useEffect, useState } from 'react';
import { getRecentFeedback } from '@/lib/firestore';
import { Feedback } from '@/types';

export default function RecentFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getRecentFeedback(5);
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching recent feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Feedback
          </h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recent Feedback
        </h3>
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No feedback yet</p>
          ) : (
            feedback.map((item) => (
              <div key={item.id} className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.rating && (
                      <span className="text-yellow-500">
                        {'⭐'.repeat(item.rating)}
                      </span>
                    )}
                    {item.sentiment && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(
                          item.sentiment
                        )}`}
                      >
                        {item.sentiment}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {item.content}
                </p>
                {item.category && (
                  <span className="inline-block mt-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
