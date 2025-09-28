import { useState, useEffect, useCallback } from 'react';
import { AnalyticsClient } from '@/lib/analytics-client';
import { Analytics } from '@/types';

export interface UseAnalyticsReturn {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnalytics(dateRange?: string, startDate?: string, endDate?: string): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsClient = new AnalyticsClient();
      const data = await analyticsClient.getAnalytics(dateRange, startDate, endDate);
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [dateRange, startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

export function useRecentActivity() {
  const [recentActivity, setRecentActivity] = useState<{
    newUsers: number;
    newFeedback: number;
    processedFeedback: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsClient = new AnalyticsClient();
      const data = await analyticsClient.getRecentActivity();
      setRecentActivity(data);
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recent activity');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  return {
    recentActivity,
    loading,
    error,
    refetch: fetchRecentActivity,
  };
}

export function useFeedbackStats() {
  const [feedbackStats, setFeedbackStats] = useState<{
    total: number;
    averageRating: number;
    sentimentDistribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
    feedbackByCategory: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsClient = new AnalyticsClient();
      const data = await analyticsClient.getFeedbackStats();
      setFeedbackStats(data);
    } catch (err) {
      console.error('Error fetching feedback stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbackStats();
  }, [fetchFeedbackStats]);

  return {
    feedbackStats,
    loading,
    error,
    refetch: fetchFeedbackStats,
  };
}

export function useUserStats() {
  const [userStats, setUserStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisWeek: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsClient = new AnalyticsClient();
      const data = await analyticsClient.getUserStats();
      setUserStats(data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return {
    userStats,
    loading,
    error,
    refetch: fetchUserStats,
  };
}
