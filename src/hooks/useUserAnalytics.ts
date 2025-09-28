import { useState, useEffect, useCallback } from 'react';
import { AnalyticsClient } from '@/lib/analytics-client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserAnalytics {
  userId: string;
  totalFeedback: number;
  averageRating: number;
  recentActivity: {
    newFeedback: number;
    processedFeedback: number;
  };
  feedbackByCategory: Record<string, number>;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface UseUserAnalyticsReturn {
  userAnalytics: UserAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserAnalytics(): UseUserAnalyticsReturn {
  const { currentUser } = useAuth();
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAnalytics = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const analyticsClient = new AnalyticsClient();
      const data = await analyticsClient.getUserAnalytics();
      setUserAnalytics(data);
    } catch (err) {
      console.error('Error fetching user analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user analytics');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserAnalytics();
  }, [fetchUserAnalytics]);

  return {
    userAnalytics,
    loading,
    error,
    refetch: fetchUserAnalytics,
  };
}
