import { 
    collection, 
    getDocs, 
    addDoc,
    updateDoc,
    doc,
    query, 
    where, 
    limit,
    Timestamp,
    CollectionReference 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserDocument } from '@/types';

export class UserRepository {
    private usersCollection: CollectionReference<User>;

    constructor() {
        this.usersCollection = collection(db, 'users') as CollectionReference<User>;
    }

    /**
     * Get all users from Firestore - returns UserDocument[] for service layer
     */
    async getAllUsers(): Promise<UserDocument[]> {
        const snapshot = await getDocs(this.usersCollection);
        return snapshot.docs.map(doc => {
            const data = doc.data();
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
     * Get user by UID - returns UserDocument for service layer
     */
    async getUserByUid(uid: string): Promise<UserDocument | null> {
        const q = query(this.usersCollection, where('uid', '==', uid), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();
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
    }

    /**
     * Get user by API key
     */
    async getUserByApiKey(apiKey: string): Promise<User | null> {
        const q = query(this.usersCollection, where('apiKey', '==', apiKey), limit(1));
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

    /**
     * Get active users
     */
    async getActiveUsers(): Promise<UserDocument[]> {
        const allUsers = await this.getAllUsers();
        return allUsers.filter(user => user.isActive);
    }

    /**
     * Check if user exists by UID
     */
    async existsByUid(uid: string): Promise<boolean> {
        const user = await this.getUserByUid(uid);
        return user !== null;
    }

    /**
     * Create a new user
     */
    async create(userData: Omit<UserDocument, 'id'>): Promise<UserDocument> {
        const now = Timestamp.now();
        const docRef = await addDoc(this.usersCollection, {
            ...userData,
            createdAt: now,
            updatedAt: now,
        } as unknown as User);

        return {
            id: docRef.id,
            ...userData,
            createdAt: now,
            updatedAt: now,
        } as UserDocument;
    }

    /**
     * Update a user
     */
    async update(userId: string, updateData: Partial<User>): Promise<void> {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: Timestamp.now(),
        });
    }

    /**
     * Update last login timestamp
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
     * Get active users count
     */
    async getActiveUsersCount(): Promise<number> {
        const users = await this.getAllUsers();
        return users.filter(user => user.isActive).length;
    }
}