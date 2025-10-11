import { UserRepository } from '@/repositories/user/UserRepository';
import { FeedbackRepository } from '@/repositories/feedback/FeedbackRepository';
import { Analytics, Feedback, UserDocument } from '@/types';

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

export class AnalyticsRepository {
    private userRepository: UserRepository;
    private feedbackRepository: FeedbackRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.feedbackRepository = new FeedbackRepository();
    }

    /**
     * Get analytics data by composing data from other repositories
     */
    async getAnalytics(): Promise<Analytics> {
        const [users, feedback] = await Promise.all([
            this.userRepository.getAllUsers(),
            this.feedbackRepository.getAllFeedback()
        ]);

        return this.calculateAnalytics(users, feedback);
    }

    /**
     * Get analytics for a specific date range
     */
    async getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics> {
        const [users, feedback] = await Promise.all([
            this.userRepository.getUsersByDateRange(startDate, endDate),
            this.feedbackRepository.getFeedbackByDateRange(startDate, endDate)
        ]);

        // Convert User[] to UserDocument[] for consistency
        const { Timestamp } = await import('firebase/firestore');
        const userDocuments: UserDocument[] = users.map(user => ({
            id: user.id,
            uid: user.uid,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt instanceof Date ? Timestamp.fromDate(user.createdAt) : Timestamp.now(),
            updatedAt: Timestamp.now(),
            lastLogin: user.lastLogin ? Timestamp.fromDate(user.lastLogin) : undefined,
            isActive: user.isActive,
            apiKey: user.apiKey,
            sdkConfig: user.sdkConfig,
        }));

        return this.calculateAnalytics(userDocuments, feedback);
    }

    /**
     * Get user-specific analytics data
     */
    async getUserAnalytics(userId: string): Promise<UserAnalytics> {
        // Get user's recent feedback (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const userFeedback = await this.feedbackRepository.getFeedbackByUser(userId);
        
        // Filter to recent feedback only
        const recentFeedback = userFeedback.filter(f => {
            return f.createdAt && f.createdAt > thirtyDaysAgo;
        });

        const totalFeedback = recentFeedback.length;
        
        // Calculate average rating from recent feedback
        const ratings = recentFeedback
            .filter(f => f.rating !== null && f.rating !== undefined)
            .map(f => f.rating!);
        
        const averageRating = ratings.length > 0 
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
            : 0;

        // Calculate sentiment distribution
        const sentimentDistribution = {
            positive: recentFeedback.filter(f => f.sentiment === 'positive').length,
            negative: recentFeedback.filter(f => f.sentiment === 'negative').length,
            neutral: recentFeedback.filter(f => f.sentiment === 'neutral' || !f.sentiment).length,
        };

        // Calculate feedback by category
        const feedbackByCategory: Record<string, number> = {};
        recentFeedback.forEach(f => {
            if (f.category) {
                feedbackByCategory[f.category] = (feedbackByCategory[f.category] || 0) + 1;
            }
        });

        // Calculate recent activity (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const newFeedback = recentFeedback.filter(f => {
            return f.createdAt && f.createdAt > weekAgo;
        }).length;

        const processedFeedback = recentFeedback.filter(f => f.processed).length;

        return {
            userId,
            totalFeedback,
            averageRating,
            recentActivity: {
                newFeedback,
                processedFeedback,
            },
            feedbackByCategory,
            sentimentDistribution,
        };
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

        const [recentUsers, recentFeedback, processedCount] = await Promise.all([
            this.userRepository.getUsersByDateRange(weekAgo, now),
            this.feedbackRepository.getFeedbackByDateRange(weekAgo, now),
            this.feedbackRepository.getProcessedFeedbackCount()
        ]);

        return {
            newUsers: recentUsers.length,
            newFeedback: recentFeedback.length,
            processedFeedback: processedCount,
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

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        newUsersThisWeek: number;
    }> {
        const [allUsers, recentActivity] = await Promise.all([
            this.userRepository.getAllUsers(),
            this.getRecentActivity()
        ]);

        return {
            totalUsers: allUsers.length,
            activeUsers: await this.userRepository.getActiveUsersCount(),
            newUsersThisWeek: recentActivity.newUsers,
        };
    }

    /**
     * Calculate analytics from raw data
     */
    private calculateAnalytics(users: UserDocument[], feedback: Feedback[]): Analytics {
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
            const createdAt = user.createdAt instanceof Date ? user.createdAt : user.createdAt.toDate();
            return createdAt > weekAgo;
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
