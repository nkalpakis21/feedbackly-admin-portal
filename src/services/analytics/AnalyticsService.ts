import { AnalyticsRepository } from '@/repositories/analytics/AnalyticsRepository';
import { Analytics, Feedback, User } from '@/types';

export class AnalyticsService {
    private analyticsRepository: AnalyticsRepository;

    constructor() {
        this.analyticsRepository = new AnalyticsRepository();
    }

    /**
     * Get comprehensive analytics data
     */
    async getAnalytics(): Promise<Analytics> {
        const [users, feedback] = await Promise.all([
            this.analyticsRepository.getAllUsers(),
            this.analyticsRepository.getAllFeedback()
        ]);

        return this.calculateAnalytics(users, feedback);
    }

    /**
     * Get analytics for a specific date range
     */
    async getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics> {
        const [users, feedback] = await Promise.all([
            this.analyticsRepository.getUsersByDateRange(startDate, endDate),
            this.analyticsRepository.getFeedbackByDateRange(startDate, endDate)
        ]);

        return this.calculateAnalytics(users, feedback);
    }

    /**
     * Get recent activity analytics (last 7 days)
     */
    async getRecentActivity(): Promise<{
        newUsers: number;
        newFeedback: number;
        processedFeedback: number;
    }> {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const now = new Date();

        const [recentUsers, recentFeedback, allFeedback] = await Promise.all([
            this.analyticsRepository.getUsersByDateRange(weekAgo, now),
            this.analyticsRepository.getFeedbackByDateRange(weekAgo, now),
            this.analyticsRepository.getAllFeedback()
        ]);

        return {
            newUsers: recentUsers.length,
            newFeedback: recentFeedback.length,
            processedFeedback: allFeedback.filter(f => f.processed).length,
        };
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
        const feedback = await this.analyticsRepository.getAllFeedback();
        
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

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        newUsersThisWeek: number;
    }> {
        const [allUsers, recentUsers] = await Promise.all([
            this.analyticsRepository.getAllUsers(),
            this.getRecentActivity()
        ]);

        return {
            totalUsers: allUsers.length,
            activeUsers: allUsers.filter(u => u.isActive).length,
            newUsersThisWeek: recentUsers.newUsers,
        };
    }

    /**
     * Calculate analytics from raw data
     */
    private calculateAnalytics(users: User[], feedback: Feedback[]): Analytics {
        const totalUsers = users.length;
        const totalFeedback = feedback.length;
        
        // Calculate average rating from all feedback
        const ratings = feedback
            .filter(f => f.rating !== null && f.rating !== undefined)
            .map(f => f.rating!);
        
        const averageRating = ratings.length > 0 
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
            : 0;

        // Calculate sentiment distribution
        const sentimentDistribution = {
            positive: feedback.filter(f => f.sentiment === 'positive').length,
            negative: feedback.filter(f => f.sentiment === 'negative').length,
            neutral: feedback.filter(f => f.sentiment === 'neutral' || !f.sentiment).length,
        };

        // Calculate feedback by category
        const feedbackByCategory: Record<string, number> = {};
        feedback.forEach(f => {
            if (f.category) {
                feedbackByCategory[f.category] = (feedbackByCategory[f.category] || 0) + 1;
            }
        });

        // Calculate recent activity (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const recentUsers = users.filter(user => {
            return user.createdAt && user.createdAt > weekAgo;
        }).length;

        const recentFeedback = feedback.filter(f => {
            return f.createdAt && f.createdAt > weekAgo;
        }).length;

        const processedFeedback = feedback.filter(f => f.processed).length;

        return {
            totalUsers,
            totalFeedback,
            averageRating,
            sentimentDistribution,
            feedbackByCategory,
            recentActivity: {
                newUsers: recentUsers,
                newFeedback: recentFeedback,
                processedFeedback,
            },
        };
    }
}
