import { Feedback } from '@/types';
import { ApiClient } from './api-client';

export interface FeedbackApiResponse {
    success: boolean;
    data: Feedback[];
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
    timestamp: string;
}

export interface ProcessedCountResponse {
    success: boolean;
    data: {
        count: number;
    };
    timestamp: string;
}

export class FeedbackClient extends ApiClient {
    private baseUrl: string;

    constructor() {
        super();
        this.baseUrl = '/api/feedback';
    }

    /**
     * Get recent feedback
     */
    async getRecentFeedback(limit: number = 10): Promise<Feedback[]> {
        const result: FeedbackApiResponse = await this.get<FeedbackApiResponse>(this.baseUrl, {
            type: 'recent',
            limit: limit.toString(),
        });
        
        if (!result.success) {
            throw new Error('Feedback API returned error');
        }

        return result.data;
    }

    /**
     * Get all feedback
     */
    async getAllFeedback(): Promise<Feedback[]> {
        const result: FeedbackApiResponse = await this.get<FeedbackApiResponse>(this.baseUrl, {
            type: 'all',
        });
        
        if (!result.success) {
            throw new Error('Feedback API returned error');
        }

        return result.data;
    }

    /**
     * Get feedback for a specific user
     */
    async getFeedbackByUser(userId: string): Promise<Feedback[]> {
        const result: FeedbackApiResponse = await this.get<FeedbackApiResponse>(this.baseUrl, {
            type: 'user',
            userId: userId,
        });
        
        if (!result.success) {
            throw new Error('Feedback API returned error');
        }

        return result.data;
    }

    /**
     * Get feedback within a date range
     */
    async getFeedbackByDateRange(startDate: Date, endDate: Date): Promise<Feedback[]> {
        const result: FeedbackApiResponse = await this.get<FeedbackApiResponse>(this.baseUrl, {
            type: 'dateRange',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        
        if (!result.success) {
            throw new Error('Feedback API returned error');
        }

        return result.data;
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
        const result: FeedbackStatsResponse = await this.post<FeedbackStatsResponse>(this.baseUrl, { type: 'stats' });
        
        if (!result.success) {
            throw new Error('Feedback stats API returned error');
        }

        return result.data;
    }

    /**
     * Get processed feedback count
     */
    async getProcessedFeedbackCount(): Promise<number> {
        const result: ProcessedCountResponse = await this.post<ProcessedCountResponse>(this.baseUrl, { type: 'processedCount' });
        
        if (!result.success) {
            throw new Error('Processed count API returned error');
        }

        return result.data.count;
    }
}
