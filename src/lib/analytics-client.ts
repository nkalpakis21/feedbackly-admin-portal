import { Analytics } from '@/types';

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

export class AnalyticsClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = '/api/analytics';
    }

    /**
     * Get comprehensive analytics data
     */
    async getAnalytics(dateRange?: string, startDate?: string, endDate?: string): Promise<Analytics> {
        const params = new URLSearchParams();
        
        if (dateRange) params.append('dateRange', dateRange);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const url = `${this.baseUrl}?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch analytics: ${response.statusText}`);
        }

        const result: AnalyticsApiResponse = await response.json();
        
        if (!result.success) {
            throw new Error('Analytics API returned error');
        }

        return result.data;
    }

    /**
     * Get recent activity analytics
     */
    async getRecentActivity(): Promise<RecentActivityResponse['data']> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'recent-activity' }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch recent activity: ${response.statusText}`);
        }

        const result: RecentActivityResponse = await response.json();
        
        if (!result.success) {
            throw new Error('Recent activity API returned error');
        }

        return result.data;
    }

    /**
     * Get feedback statistics
     */
    async getFeedbackStats(): Promise<FeedbackStatsResponse['data']> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'feedback-stats' }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch feedback stats: ${response.statusText}`);
        }

        const result: FeedbackStatsResponse = await response.json();
        
        if (!result.success) {
            throw new Error('Feedback stats API returned error');
        }

        return result.data;
    }

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<UserStatsResponse['data']> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'user-stats' }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user stats: ${response.statusText}`);
        }

        const result: UserStatsResponse = await response.json();
        
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
