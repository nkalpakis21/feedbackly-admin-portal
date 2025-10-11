import { AnalyticsRepository } from '@/repositories/analytics/AnalyticsRepository';
import { Analytics } from '@/types';

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

export class AnalyticsService {
    private analyticsRepository: AnalyticsRepository;

    constructor() {
        this.analyticsRepository = new AnalyticsRepository();
    }

    /**
     * Get comprehensive analytics data
     */
    async getAnalytics(): Promise<Analytics> {
        return this.analyticsRepository.getAnalytics();
    }

    /**
     * Get analytics for a specific date range
     */
    async getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics> {
        return this.analyticsRepository.getAnalyticsByDateRange(startDate, endDate);
    }

    /**
     * Get user-specific analytics data
     */
    async getUserAnalytics(userId: string): Promise<UserAnalytics> {
        return this.analyticsRepository.getUserAnalytics(userId);
    }

    /**
     * Get recent activity analytics (last 7 days)
     */
    async getRecentActivity(): Promise<{
        newUsers: number;
        newFeedback: number;
        processedFeedback: number;
    }> {
        return this.analyticsRepository.getRecentActivity();
    }

    /**
     * Get feedback statistics
     */
    async getFeedbackStats(): Promise<{
        total: number;
        averageRating: number;
        sentimentDistribution: {
            positive: number;
            negative: number;
            neutral: number;
        };
        feedbackByCategory: Record<string, number>;
    }> {
        return this.analyticsRepository.getFeedbackStats();
    }

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        newUsersThisWeek: number;
    }> {
        return this.analyticsRepository.getUserStats();
    }
}
