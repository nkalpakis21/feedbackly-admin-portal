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
import { User, Feedback } from '@/types';

export class AnalyticsRepository {
    private usersCollection: CollectionReference<User>;
    private feedbackCollection: CollectionReference<Feedback>;

    constructor() {
        this.usersCollection = collection(db, 'users') as CollectionReference<User>;
        this.feedbackCollection = collection(db, 'feedback') as CollectionReference<Feedback>;
    }

    /**
     * Get all users from Firestore
     */
    async getAllUsers(): Promise<User[]> {
        const snapshot = await getDocs(this.usersCollection);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                uid: data.uid,
                email: data.email,
                name: data.name,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : undefined,
                isActive: data.isActive,
                apiKey: data.apiKey,
                sdkConfig: data.sdkConfig,
            } as User;
        });
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
     * Get users by date range
     */
    async getUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
        const q = query(
            this.usersCollection,
            where('createdAt', '>=', Timestamp.fromDate(startDate)),
            where('createdAt', '<=', Timestamp.fromDate(endDate))
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                uid: data.uid,
                email: data.email,
                name: data.name,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : undefined,
                isActive: data.isActive,
                apiKey: data.apiKey,
                sdkConfig: data.sdkConfig,
            } as User;
        });
    }
}