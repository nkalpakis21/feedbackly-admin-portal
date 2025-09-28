'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function DashboardStats() {
  const { analytics, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive">Error loading analytics: {error}</p>
              <button 
                onClick={refetch} 
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground">No analytics data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample chart data
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
  ];

  // Safe value extraction with fallbacks
  const safeAverageRating = analytics.averageRating ?? 0;
  const safeTotalFeedback = analytics.totalFeedback ?? 0;
  const safeProcessedFeedback = analytics.recentActivity?.processedFeedback ?? 0;

  const stats = [
    {
      name: 'Total Feedback',
      value: safeTotalFeedback,
      change: '+20.1% from last month',
      icon: '💬',
      color: 'text-chart-1',
      chartColor: 'hsl(var(--chart-1))',
      borderColor: '#3b82f6', // Blue
    },
    {
      name: 'Average Rating',
      value: safeAverageRating.toFixed(1),
      change: '+0.3 from last month',
      icon: '⭐',
      color: 'text-chart-4',
      chartColor: 'hsl(var(--chart-4))',
      borderColor: '#f59e0b', // Amber
    },
    {
      name: 'Processed Feedback',
      value: safeProcessedFeedback,
      change: '+12.5% from last month',
      icon: '✅',
      color: 'text-chart-2',
      chartColor: 'hsl(var(--chart-2))',
      borderColor: '#10b981', // Emerald
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.name} style={{ borderLeftColor: stat.borderColor, borderLeftWidth: '4px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stat.change}
            </p>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={stat.chartColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
