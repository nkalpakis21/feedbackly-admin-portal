'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/firestore';
import { Analytics } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

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

  if (!analytics) {
    return <div>Error loading analytics</div>;
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

  const stats = [
    {
      name: 'Total Feedback',
      value: analytics.totalFeedback,
      change: '+20.1% from last month',
      icon: '💬',
      color: 'text-chart-1',
      chartColor: 'hsl(var(--chart-1))',
      borderColor: '#3b82f6', // Blue
    },
    {
      name: 'Average Rating',
      value: analytics.averageRating.toFixed(1),
      change: '+0.3 from last month',
      icon: '⭐',
      color: 'text-chart-4',
      chartColor: 'hsl(var(--chart-4))',
      borderColor: '#f59e0b', // Amber
    },
    {
      name: 'Processed Feedback',
      value: analytics.recentActivity.processedFeedback,
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



