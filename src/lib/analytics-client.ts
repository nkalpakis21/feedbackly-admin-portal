import { Analytics } from '@/types';
import { ApiClient } from './api-client';

export interface AnalyticsApiResponse {
    success: boolean;
    data: Analytics;
    timestamp: string;
}

export interface RecentActivityResponse {
    success: boolean;
    data: {
        newUsers: number;
        newFeedback: number;
        processedFeedback: number;
    };
    type: string;
    timestamp: string;
}

export interface FeedbackStatsResponse {
    success: boolean;
    data: {
        total: number;
        averageRating: number;
        sentimentDistribution: {
            positive: number;
            negative: number;
            neutral: number;
        };
        feedbackByCategory: Record<string, number>;
    };
    type: string;
    timestamp: string;
}

export interface UserStatsResponse {
    success: boolean;
    data: {
        totalUsers: number;
        activeUsers: number;
        newUsersThisWeek: number;
    };
    type: string;
    timestamp: string;
}

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

export interface UserAnalyticsResponse {
    success: boolean;
    data: UserAnalytics;
    timestamp: string;
}

export class AnalyticsClient extends ApiClient {
    private baseUrl: string;

    constructor() {
        super();
        this.baseUrl = '/api/analytics';
    }

    /**
     * Get comprehensive analytics data
     */
    async getAnalytics(dateRange?: string, startDate?: string, endDate?: string): Promise<Analytics> {
        const params: Record<string, string> = {};
        
        if (dateRange) params.dateRange = dateRange;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const result: AnalyticsApiResponse = await this.get<AnalyticsApiResponse>(this.baseUrl, params);
        
        if (!result.success) {
            throw new Error('Analytics API returned error');
        }

        return result.data;
    }

    /**
     * Get user-specific analytics data
     */
    async getUserAnalytics(): Promise<UserAnalytics> {
        const result: UserAnalyticsResponse = await this.get<UserAnalyticsResponse>(`${this.baseUrl}/user`);
        
        if (!result.success) {
            throw new Error('User analytics API returned error');
        }

        return result.data;
    }

    /**
     * Get recent activity analytics
     */
    async getRecentActivity(): Promise<RecentActivityResponse['data']> {
        const result: RecentActivityResponse = await this.post<RecentActivityResponse>(this.baseUrl, { type: 'recent-activity' });
        
        if (!result.success) {
            throw new Error('Recent activity API returned error');
        }

        return result.data;
    }

    /**
     * Get feedback statistics
     */
    async getFeedbackStats(): Promise<FeedbackStatsResponse['data']> {
        const result: FeedbackStatsResponse = await this.post<FeedbackStatsResponse>(this.baseUrl, { type: 'feedback-stats' });
        
        if (!result.success) {
            throw new Error('Feedback stats API returned error');
        }

        return result.data;
    }

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<UserStatsResponse['data']> {
        const result: UserStatsResponse = await this.post<UserStatsResponse>(this.baseUrl, { type: 'user-stats' });
        
        if (!result.success) {
            throw new Error('User stats API returned error');
        }

        return result.data;
    }

    /**
     * Get analytics for a specific date range
     */
    async getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics> {
        return this.getAnalytics(
            'custom',
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
        );
    }

    /**
     * Get analytics for the last week
     */
    async getAnalyticsLastWeek(): Promise<Analytics> {
        return this.getAnalytics('week');
    }

    /**
     * Get analytics for the last month
     */
    async getAnalyticsLastMonth(): Promise<Analytics> {
        return this.getAnalytics('month');
    }
}
