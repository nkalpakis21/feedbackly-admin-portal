import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit,
    Timestamp,
    CollectionReference 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Feedback } from '@/types';

export class FeedbackRepository {
    private feedbackCollection: CollectionReference<Feedback>;

    constructor() {
        this.feedbackCollection = collection(db, 'feedback') as CollectionReference<Feedback>;
    }

    /**
     * Get all feedback from Firestore
     */
    async getAllFeedback(): Promise<Feedback[]> {
        const snapshot = await getDocs(this.feedbackCollection);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                content: data.content,
                rating: data.rating,
                category: data.category,
                sentiment: data.sentiment,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get recent feedback (last N items)
     */
    async getRecentFeedback(limitCount: number = 10): Promise<Feedback[]> {
        const q = query(
            this.feedbackCollection, 
            orderBy('createdAt', 'desc'), 
            limit(limitCount)
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
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get feedback by date range
     */
    async getFeedbackByDateRange(startDate: Date, endDate: Date): Promise<Feedback[]> {
        const q = query(
            this.feedbackCollection,
            where('createdAt', '>=', Timestamp.fromDate(startDate)),
            where('createdAt', '<=', Timestamp.fromDate(endDate)),
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
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get feedback by user ID
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
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }

    /**
     * Get processed feedback count
     */
    async getProcessedFeedbackCount(): Promise<number> {
        const feedback = await this.getAllFeedback();
        return feedback.filter(f => f.processed).length;
    }

    /**
     * Get feedback by sentiment
     */
    async getFeedbackBySentiment(sentiment: 'positive' | 'negative' | 'neutral'): Promise<Feedback[]> {
        const q = query(
            this.feedbackCollection,
            where('sentiment', '==', sentiment),
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
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                processed: data.processed,
                aiAnalysis: data.aiAnalysis,
            } as Feedback;
        });
    }
}
