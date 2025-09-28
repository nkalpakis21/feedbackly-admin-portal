import { Feedback } from '@/types';
import { FeedbackRepository } from '@/repositories/feedback/FeedbackRepository';

export class FeedbackService {
    private feedbackRepository: FeedbackRepository;

    constructor(feedbackRepository: FeedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    /**
     * Get all feedback entries
     */
    async getAllFeedback(): Promise<Feedback[]> {
        return this.feedbackRepository.getAllFeedback();
    }

    /**
     * Get recent feedback entries
     */
    async getRecentFeedback(limitCount: number = 10): Promise<Feedback[]> {
        return this.feedbackRepository.getRecentFeedback(limitCount);
    }

    /**
     * Get feedback entries within a specific date range
     */
    async getFeedbackByDateRange(startDate: Date, endDate: Date): Promise<Feedback[]> {
        return this.feedbackRepository.getFeedbackByDateRange(startDate, endDate);
    }

    /**
     * Get feedback entries for a specific user
     */
    async getFeedbackByUser(userId: string): Promise<Feedback[]> {
        return this.feedbackRepository.getFeedbackByUser(userId);
    }

    /**
     * Get the count of processed feedback entries
     */
    async getProcessedFeedbackCount(): Promise<number> {
        return this.feedbackRepository.getProcessedFeedbackCount();
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
        const feedback = await this.feedbackRepository.getAllFeedback();
        
        const total = feedback.length;
        const ratings = feedback.filter(f => f.rating !== null && f.rating !== undefined).map(f => f.rating!);
        const averageRating = ratings.length > 0 
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
            : 0;

        const sentimentDistribution = {
            positive: feedback.filter(f => f.sentiment === 'positive').length,
            negative: feedback.filter(f => f.sentiment === 'negative').length,
            neutral: feedback.filter(f => f.sentiment === 'neutral' || !f.sentiment).length,
        };

        const feedbackByCategory: Record<string, number> = {};
        feedback.forEach(f => {
            if (f.category) {
                feedbackByCategory[f.category] = (feedbackByCategory[f.category] || 0) + 1;
            }
        });

        return {
            total,
            averageRating,
            sentimentDistribution,
            feedbackByCategory,
        };
    }
}
