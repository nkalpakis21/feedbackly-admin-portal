import { useState, useEffect, useCallback } from 'react';
import { Feedback } from '@/types';
import { FeedbackClient } from '@/lib/feedback-client';

export interface UseFeedbackReturn {
  feedback: Feedback[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseRecentFeedbackOptions {
  limit?: number;
}

export function useRecentFeedback(options: UseRecentFeedbackOptions = {}): UseFeedbackReturn {
  const { limit = 10 } = options;
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const feedbackClient = new FeedbackClient();
      const data = await feedbackClient.getRecentFeedback(limit);
      setFeedback(data);
    } catch (err) {
      console.error('Error fetching recent feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    loading,
    error,
    refetch: fetchFeedback,
  };
}

export interface UseAllFeedbackReturn {
  feedback: Feedback[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllFeedback(): UseAllFeedbackReturn {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const feedbackClient = new FeedbackClient();
      const data = await feedbackClient.getAllFeedback();
      setFeedback(data);
    } catch (err) {
      console.error('Error fetching all feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    loading,
    error,
    refetch: fetchFeedback,
  };
}

export interface UseUserFeedbackOptions {
  userId: string;
}

export function useUserFeedback(options: UseUserFeedbackOptions): UseFeedbackReturn {
  const { userId } = options;
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const feedbackClient = new FeedbackClient();
      const data = await feedbackClient.getFeedbackByUser(userId);
      setFeedback(data);
    } catch (err) {
      console.error('Error fetching user feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user feedback');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    loading,
    error,
    refetch: fetchFeedback,
  };
}

export interface UseFeedbackStatsReturn {
  stats: {
    total: number;
    averageRating: number;
    sentimentDistribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
    feedbackByCategory: Record<string, number>;
  } | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFeedbackStats(): UseFeedbackStatsReturn {
  const [stats, setStats] = useState<{
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

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const feedbackClient = new FeedbackClient();
      const data = await feedbackClient.getFeedbackStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching feedback stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
