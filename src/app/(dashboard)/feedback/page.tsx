'use client';

import { useEffect, useState } from 'react';
import { getFeedback } from '@/lib/firestore';
import { Feedback } from '@/types';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getFeedback();
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
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

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage user feedback
          </p>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage user feedback
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {feedback.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No feedback yet</p>
            ) : (
              feedback.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
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
                      {item.aiAnalysis?.priority && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            item.aiAnalysis.priority
                          )}`}
                        >
                          {item.aiAnalysis.priority} priority
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.processed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.processed ? 'Processed' : 'Pending'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{item.content}</p>
                  
                  {item.category && (
                    <span className="inline-block text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2">
                      {item.category}
                    </span>
                  )}
                  
                  {item.aiAnalysis && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis</h4>
                      <p className="text-sm text-gray-700 mb-2">{item.aiAnalysis.summary}</p>
                      {item.aiAnalysis.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.aiAnalysis.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-block text-xs text-gray-600 bg-white px-2 py-1 rounded border"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
