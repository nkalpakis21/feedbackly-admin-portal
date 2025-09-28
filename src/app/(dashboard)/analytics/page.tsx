'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/firestore';
import { Analytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
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

  // Safe value extraction with fallbacks
  const safeAverageRating = analytics.averageRating ?? 0;
  const safeTotalFeedback = analytics.totalFeedback ?? 0;
  const safeProcessedFeedback = analytics.recentActivity?.processedFeedback ?? 0;
  const safeSentimentDistribution = analytics.sentimentDistribution ?? { positive: 0, negative: 0, neutral: 0 };
  const safeFeedbackByCategory = analytics.feedbackByCategory ?? {};

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
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
                    {safeTotalFeedback}
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
                    {safeAverageRating.toFixed(1)}
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
                    {safeProcessedFeedback}
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
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Positive</span>
                <span className="text-sm text-muted-foreground">{safeSentimentDistribution.positive}</span>
              </div>
              <Progress value={(safeSentimentDistribution.positive / Math.max(safeTotalFeedback, 1)) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Neutral</span>
                <span className="text-sm text-muted-foreground">{safeSentimentDistribution.neutral}</span>
              </div>
              <Progress value={(safeSentimentDistribution.neutral / Math.max(safeTotalFeedback, 1)) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Negative</span>
                <span className="text-sm text-muted-foreground">{safeSentimentDistribution.negative}</span>
              </div>
              <Progress value={(safeSentimentDistribution.negative / Math.max(safeTotalFeedback, 1)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Feedback by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(safeFeedbackByCategory).length > 0 ? (
                Object.entries(safeFeedbackByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{category}</span>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No category data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold">{analytics.recentActivity?.newUsers ?? 0}</p>
              <p className="text-sm text-muted-foreground">New Users (7 days)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analytics.recentActivity?.newFeedback ?? 0}</p>
              <p className="text-sm text-muted-foreground">New Feedback (7 days)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{safeProcessedFeedback}</p>
              <p className="text-sm text-muted-foreground">Processed Feedback</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}