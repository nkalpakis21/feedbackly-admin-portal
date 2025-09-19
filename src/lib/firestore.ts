import {
    collection,
    doc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Feedback, Website, Analytics } from '@/types';

// Users collection
export const usersCollection = collection(db, 'users');

export async function getUsers(): Promise<User[]> {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate(),
    })) as User[];
}

export async function getUser(uid: string): Promise<User | null> {
    const q = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLogin: data.lastLogin?.toDate(),
        } as User;
    }
    return null;
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, data);
}

// Feedback collection
export const feedbackCollection = collection(db, 'feedback');

export async function getFeedback(): Promise<Feedback[]> {
    const q = query(feedbackCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Feedback[];
}

export async function getFeedbackByUser(userId: string): Promise<Feedback[]> {
    const q = query(
        feedbackCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Feedback[];
}

export async function getRecentFeedback(limitCount: number = 10): Promise<Feedback[]> {
    const q = query(
        feedbackCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Feedback[];
}

export async function updateFeedback(feedbackId: string, data: Partial<Feedback>): Promise<void> {
    const docRef = doc(db, 'feedback', feedbackId);
    await updateDoc(docRef, data);
}

// Websites collection
export const websitesCollection = collection(db, 'websites');

export async function getWebsites(): Promise<Website[]> {
    const snapshot = await getDocs(websitesCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Website[];
}

export async function getWebsitesByUser(userId: string): Promise<Website[]> {
    const q = query(websitesCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Website[];
}

// Resolve a user's default website. Strategy:
// 1) websites where userId == uid and isActive true, order by createdAt desc, take first
// 2) fallback to any website by the user
export async function getDefaultWebsiteIdForUser(uid: string): Promise<string | null> {
    const q = query(
        websitesCollection,
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const active = snapshot.docs.find(d => {
        const data = d.data();
        return data.isActive === true;
    });
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
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate(),
    } as User;
}

// Analytics
export async function getAnalytics(): Promise<Analytics> {
    const [usersSnapshot, feedbackSnapshot] = await Promise.all([
        getDocs(usersCollection),
        getDocs(feedbackCollection),
    ]);

    const users = usersSnapshot.docs.map(doc => doc.data());
    const feedback = feedbackSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Feedback[];

    const totalUsers = users.length;
    const totalFeedback = feedback.length;

    const ratings = feedback
        .filter(f => f.rating !== undefined)
        .map(f => f.rating!);
    const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    const sentimentDistribution: { positive: number; negative: number; neutral: number } = feedback.reduce((acc, f) => {
        const sentiment = f.sentiment || 'neutral';
        if (sentiment === 'positive' || sentiment === 'negative' || sentiment === 'neutral') {
            acc[sentiment] = (acc[sentiment] || 0) + 1;
        }
        return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    const feedbackByCategory = feedback.reduce((acc, f) => {
        const category = f.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = users.filter(user => {
        const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
        return createdAt > sevenDaysAgo;
    }).length;

    const recentFeedback = feedback.filter(f =>
        f.createdAt > sevenDaysAgo
    ).length;

    const processedFeedback = feedback.filter(f => f.processed).length;

    return {
        totalUsers,
        totalFeedback,
        averageRating: Math.round(averageRating * 10) / 10,
        sentimentDistribution,
        feedbackByCategory,
        recentActivity: {
            newUsers: recentUsers,
            newFeedback: recentFeedback,
            processedFeedback,
        },
    };
}
