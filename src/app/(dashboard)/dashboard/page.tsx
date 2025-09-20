'use client';

import { useEffect } from 'react';
import DashboardStats from '@/components/DashboardStats';
import RecentFeedback from '@/components/RecentFeedback';
import { useShiply } from '@/hooks/useShiply';
import { SHIPLY_EVENTS } from '@/lib/shiply-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { trackEvent } = useShiply();

  useEffect(() => {
    // Track dashboard page view
    trackEvent(SHIPLY_EVENTS.DASHBOARD_VIEWED, {
      page: 'dashboard',
      timestamp: new Date().toISOString(),
    });
  }, [trackEvent]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Shiply platform
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentFeedback />
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <span className="text-lg">💬</span>
                <div className="text-left">
                  <div className="font-medium">Review Feedback</div>
                  <div className="text-sm text-muted-foreground">Process new feedback</div>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <span className="text-lg">📈</span>
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-muted-foreground">Detailed insights</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
