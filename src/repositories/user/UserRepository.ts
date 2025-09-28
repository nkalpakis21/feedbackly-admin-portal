import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc, addDoc, limit, Timestamp } from 'firebase/firestore';
import { User, UserDocument } from '@/types';

export class UserRepository {
    private usersCollection = collection(db, 'users');

    /**
     * Get all users
     */
    async getAllUsers(): Promise<UserDocument[]> {
        const snapshot = await getDocs(this.usersCollection);
        return snapshot.docs.map(doc => {
            const data = doc.data() as User;
            return {
                id: doc.id,
                uid: data.uid,
                email: data.email,
                name: data.name,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
                updatedAt: Timestamp.now(),
                lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin : undefined,
                isActive: data.isActive,
                apiKey: data.apiKey,
                sdkConfig: data.sdkConfig,
            } as UserDocument;
        });
    }

    /**
     * Get user by Firebase UID
     */
    async getUserByUid(uid: string): Promise<UserDocument | null> {
        const q = query(this.usersCollection, where('uid', '==', uid), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const userDoc = snapshot.docs[0];
        const data = userDoc.data() as User;
        return {
            id: userDoc.id,
            uid: data.uid,
            email: data.email,
            name: data.name,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
            updatedAt: Timestamp.now(),
            lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin : undefined,
            isActive: data.isActive,
            apiKey: data.apiKey,
            sdkConfig: data.sdkConfig,
        } as UserDocument;
    }

    /**
     * Create a new user document
     */
    async create(userData: Omit<UserDocument, 'id'>): Promise<UserDocument> {
        const docRef = await addDoc(this.usersCollection, userData);
        return { id: docRef.id, ...userData };
    }

    /**
     * Update an existing user document by ID
     */
    async update(id: string, data: Partial<Omit<UserDocument, 'id' | 'uid' | 'email' | 'createdAt'>>): Promise<void> {
        const docRef = doc(this.usersCollection, id);
        await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
    }

    /**
     * Update user's last login time by UID
     */
    async updateLastLogin(uid: string): Promise<void> {
        const q = query(this.usersCollection, where('uid', '==', uid), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const docRef = doc(db, 'users', userDoc.id);
            await updateDoc(docRef, {
                lastLogin: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        }
    }

    /**
     * Get users created within a specific date range
     */
    async getUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);

        const q = query(
            this.usersCollection,
            where('createdAt', '>=', startTimestamp),
            where('createdAt', '<=', endTimestamp)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data() as User;
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
            };
        });
    }

    /**
     * Get active users count
     */
    async getActiveUsersCount(): Promise<number> {
        const q = query(this.usersCollection, where('isActive', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.size;
    }

    /**
     * Get active users
     */
    async getActiveUsers(): Promise<UserDocument[]> {
        const q = query(this.usersCollection, where('isActive', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data() as User;
            return {
                id: doc.id,
                uid: data.uid,
                email: data.email,
                name: data.name,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
                updatedAt: Timestamp.now(),
                lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin : undefined,
                isActive: data.isActive,
                apiKey: data.apiKey,
                sdkConfig: data.sdkConfig,
            } as UserDocument;
        });
    }

    /**
     * Check if a user exists by UID
     */
    async existsByUid(uid: string): Promise<boolean> {
        const q = query(this.usersCollection, where('uid', '==', uid), limit(1));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    }
}
