import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { Feedback } from '@/types';

export class FeedbackRepository {
    private feedbackCollection = collection(db, 'feedback');

    /**
     * Get all feedback entries
     */
    async getAllFeedback(): Promise<Feedback[]> {
        const q = query(this.feedbackCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                content: data.content,
                rating: data.rating,
                category: data.category,
                sentiment: data.sentiment,
                createdAt: this.convertToDate(data.createdAt),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get recent feedback entries
     */
    async getRecentFeedback(limitCount: number = 10): Promise<Feedback[]> {
        const q = query(this.feedbackCollection, orderBy('createdAt', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                content: data.content,
                rating: data.rating,
                category: data.category,
                sentiment: data.sentiment,
                createdAt: this.convertToDate(data.createdAt),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get feedback entries within a specific date range
     */
    async getFeedbackByDateRange(startDate: Date, endDate: Date): Promise<Feedback[]> {
        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);

        const q = query(
            this.feedbackCollection,
            where('createdAt', '>=', startTimestamp),
            where('createdAt', '<=', endTimestamp),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                content: data.content,
                rating: data.rating,
                category: data.category,
                sentiment: data.sentiment,
                createdAt: this.convertToDate(data.createdAt),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get feedback entries for a specific user
     */
    async getFeedbackByUser(userId: string): Promise<Feedback[]> {
        const q = query(
            this.feedbackCollection,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                content: data.content,
                rating: data.rating,
                category: data.category,
                sentiment: data.sentiment,
                createdAt: this.convertToDate(data.createdAt),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get the count of processed feedback entries
     */
    async getProcessedFeedbackCount(): Promise<number> {
        const q = query(this.feedbackCollection, where('processed', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.size;
    }

    /**
     * Convert Firestore timestamp or date to JavaScript Date
     */
    private convertToDate(timestamp: Timestamp | Date | string | number | null | undefined): Date {
        try {
            if (timestamp instanceof Timestamp) {
                return timestamp.toDate();
            }
            if (timestamp instanceof Date) {
                return timestamp;
            }
            if (typeof timestamp === 'string') {
                const date = new Date(timestamp);
                return isNaN(date.getTime()) ? new Date() : date;
            }
            if (typeof timestamp === 'number') {
                const date = new Date(timestamp);
                return isNaN(date.getTime()) ? new Date() : date;
            }
            // If timestamp is null, undefined, or invalid, return current date
            return new Date();
        } catch (error) {
            console.error('Error converting timestamp to date:', error, 'Original timestamp:', timestamp);
            return new Date();
        }
    }
}
