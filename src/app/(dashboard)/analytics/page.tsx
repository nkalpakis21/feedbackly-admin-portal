'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/firestore';
import { Analytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed insights and analytics for your platform
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
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
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights and analytics for your platform
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card style={{ borderLeftColor: '#3b82f6', borderLeftWidth: '4px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Feedback
                  </p>
                  <p className="text-2xl font-bold text-chart-1">
                    {analytics.totalFeedback}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderLeftColor: '#f59e0b', borderLeftWidth: '4px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-chart-4">
                    {analytics.averageRating}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +0.3 from last month
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderLeftColor: '#10b981', borderLeftWidth: '4px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Processed Feedback
                  </p>
                  <p className="text-2xl font-bold text-chart-2">
                    {analytics.recentActivity.processedFeedback}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sentiment Distribution */}
        <Card style={{ borderLeftColor: '#ef4444', borderLeftWidth: '4px' }}>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Positive</span>
                <div className="flex items-center">
                  <div className="w-32 bg-muted rounded-full h-2 mr-3">
                    <div
                      className="bg-chart-1 h-2 rounded-full"
                      style={{
                        width: `${(analytics.sentimentDistribution.positive / analytics.totalFeedback) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {analytics.sentimentDistribution.positive}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Neutral</span>
                <div className="flex items-center">
                  <div className="w-32 bg-muted rounded-full h-2 mr-3">
                    <div
                      className="bg-chart-4 h-2 rounded-full"
                      style={{
                        width: `${(analytics.sentimentDistribution.neutral / analytics.totalFeedback) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {analytics.sentimentDistribution.neutral}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Negative</span>
                <div className="flex items-center">
                  <div className="w-32 bg-muted rounded-full h-2 mr-3">
                    <div
                      className="bg-chart-3 h-2 rounded-full"
                      style={{
                        width: `${(analytics.sentimentDistribution.negative / analytics.totalFeedback) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {analytics.sentimentDistribution.negative}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card style={{ borderLeftColor: '#06b6d4', borderLeftWidth: '4px' }}>
          <CardHeader>
            <CardTitle>Recent Activity (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Feedback</span>
                <span className="text-lg font-semibold text-chart-1">
                  {analytics.recentActivity.newFeedback}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processed Feedback</span>
                <span className="text-lg font-semibold text-chart-2">
                  {analytics.recentActivity.processedFeedback}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback by Category */}
      {Object.keys(analytics.feedbackByCategory).length > 0 && (
        <Card style={{ borderLeftColor: '#8b5cf6', borderLeftWidth: '4px' }}>
          <CardHeader>
            <CardTitle>Feedback by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(analytics.feedbackByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium capitalize">
                    {category}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



