import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    CollectionReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, WidgetConfig, Analytics, Feedback } from '@/types';

// Collections
const usersCollection = collection(db, 'users') as CollectionReference<User>;
const feedbackCollection = collection(db, 'feedback') as CollectionReference<Feedback>;
const websitesCollection = collection(db, 'websites');

// User functions
export async function getUser(uid: string): Promise<User | null> {
    const q = query(usersCollection, where('uid', '==', uid), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
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
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
    const userDoc = await getUser(uid);
    if (!userDoc) throw new Error('User not found');

    // Only update allowed fields
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sdkConfig !== undefined) updateData.sdkConfig = data.sdkConfig;
    if (data.lastLogin) {
        updateData.lastLogin = Timestamp.fromDate(data.lastLogin);
    }

    await updateDoc(doc(usersCollection, userDoc.id), updateData);
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = Timestamp.now();
    const docRef = await addDoc(usersCollection, {
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        isActive: userData.isActive,
        apiKey: userData.apiKey,
        sdkConfig: userData.sdkConfig,
        createdAt: now,
    } as unknown as User);

    return {
        id: docRef.id,
        ...userData,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
    } as User;
}

// Website functions
export async function getWebsite(websiteId: string): Promise<WidgetConfig | null> {
    const websiteDoc = await getDoc(doc(websitesCollection, websiteId));
    if (!websiteDoc.exists()) return null;

    return websiteDoc.data() as WidgetConfig;
}

export async function updateWebsite(websiteId: string, config: Partial<WidgetConfig>): Promise<void> {
    await updateDoc(doc(websitesCollection, websiteId), {
        ...config,
        updatedAt: Timestamp.now(),
    });
}

export async function createWebsite(websiteId: string, config: WidgetConfig): Promise<void> {
    await addDoc(websitesCollection, {
        id: websiteId,
        ...config,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

// Feedback functions
export async function getFeedback(websiteId: string): Promise<Feedback[]> {
    const q = query(
        feedbackCollection,
        where('websiteId', '==', websiteId),
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

export async function getRecentFeedback(limitCount: number = 10): Promise<Feedback[]> {
    const q = query(feedbackCollection, orderBy('createdAt', 'desc'), limit(limitCount));
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

export async function getFeedbackStats(websiteId: string): Promise<{
    total: number;
    averageRating: number;
    categories: Record<string, number>;
}> {
    const feedback = await getFeedback(websiteId);
    
    const total = feedback.length;
    const ratings = feedback.filter(f => f.rating !== null && f.rating !== undefined).map(f => f.rating!);
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    
    const categories: Record<string, number> = {};
    feedback.forEach(f => {
        if (f.category) {
            categories[f.category] = (categories[f.category] || 0) + 1;
        }
    });

    return { total, averageRating, categories };
}

// Website management
export async function getWebsites(): Promise<{ id: string; config: WidgetConfig }[]> {
    const snapshot = await getDocs(websitesCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        config: doc.data() as WidgetConfig,
    }));
}

export async function getDefaultWebsiteIdForUser(uid: string): Promise<string | null> {
    const q = query(websitesCollection, where('user', '==', uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    // Find active website or return first one
    const active = snapshot.docs.find(doc => doc.data().isActive);
    return (active ?? snapshot.docs[0]).id;
}

// NEW: User-centric functions
export async function getUserByApiKey(apiKey: string): Promise<User | null> {
    const q = query(usersCollection, where('apiKey', '==', apiKey));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
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
}

// NEW: Get user by Firebase UID (for admin portal)
export async function getUserByUid(uid: string): Promise<User | null> {
    const q = query(usersCollection, where('uid', '==', uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
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
}

// Analytics
export async function getAnalytics(): Promise<Analytics> {
    const [usersSnapshot, feedbackSnapshot] = await Promise.all([
        getDocs(usersCollection),
        getDocs(feedbackCollection),
    ]);

    const totalUsers = usersSnapshot.size;
    const totalFeedback = feedbackSnapshot.size;
    
    // Calculate average rating from all feedback
    const allFeedback = feedbackSnapshot.docs.map(doc => doc.data());
    const ratings = allFeedback
        .filter(f => f.rating !== null && f.rating !== undefined)
        .map(f => f.rating!);
    
    const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;

    // Calculate sentiment distribution
    const sentimentDistribution = {
        positive: allFeedback.filter(f => f.sentiment === 'positive').length,
        negative: allFeedback.filter(f => f.sentiment === 'negative').length,
        neutral: allFeedback.filter(f => f.sentiment === 'neutral' || !f.sentiment).length,
    };

    // Calculate feedback by category
    const feedbackByCategory: Record<string, number> = {};
    allFeedback.forEach(f => {
        if (f.category) {
            feedbackByCategory[f.category] = (feedbackByCategory[f.category] || 0) + 1;
        }
    });

    // Calculate recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentUsers = usersSnapshot.docs.filter(doc => {
        const createdAt = doc.data().createdAt;
        if (createdAt instanceof Timestamp) {
            return createdAt.toDate() > weekAgo;
        }
        return false;
    }).length;

    const recentFeedback = feedbackSnapshot.docs.filter(doc => {
        const createdAt = doc.data().createdAt;
        if (createdAt instanceof Timestamp) {
            return createdAt.toDate() > weekAgo;
        }
        return false;
    }).length;

    const processedFeedback = allFeedback.filter(f => f.processed).length;

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