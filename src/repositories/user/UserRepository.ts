import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    CollectionReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseRepository } from '../base/BaseRepository';
import { UserDocument } from '@/types';

export class UserRepository extends BaseRepository<UserDocument> {
    constructor() {
        const usersCollection = collection(db, 'users');
        super(usersCollection as unknown as CollectionReference<UserDocument>);
    }

    /**
     * Create a new user document
     */
    async create(data: Omit<UserDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserDocument> {
        try {
            const now = Timestamp.now();
            const userData = {
                ...data,
                createdAt: now,
                updatedAt: now,
            };

            const docRef = await addDoc(this.collection, userData);

            return {
                id: docRef.id,
                ...userData,
            } as UserDocument;
        } catch (error) {
            console.error('Error creating user document:', error);
            throw new Error('Failed to create user document');
        }
    }

    /**
     * Get a user document by ID
     */
    async getById(id: string): Promise<UserDocument | null> {
        try {
            const docRef = doc(this.collection, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id,
                } as UserDocument;
            }
            return null;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw new Error('Failed to get user document');
        }
    }

    /**
     * Get a user document by Firebase UID
     */
    async getByUid(uid: string): Promise<UserDocument | null> {
        try {
            const q = query(this.collection, where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                } as UserDocument;
            }
            return null;
        } catch (error) {
            console.error('Error getting user by UID:', error);
            throw new Error('Failed to get user by UID');
        }
    }

    /**
     * Update a user document
     */
    async update(id: string, data: Partial<Omit<UserDocument, 'id' | 'createdAt'>>): Promise<void> {
        try {
            const docRef = doc(this.collection, id);
            const updateData = {
                ...data,
                updatedAt: Timestamp.now(),
            };

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error('Error updating user document:', error);
            throw new Error('Failed to update user document');
        }
    }

    /**
     * Update user's last login timestamp
     */
    async updateLastLogin(uid: string): Promise<void> {
        try {
            const userDoc = await this.getByUid(uid);
            if (userDoc) {
                await this.update(userDoc.id, {
                    lastLoginAt: Timestamp.now(),
                });
            }
        } catch (error) {
            console.error('Error updating last login:', error);
            throw new Error('Failed to update last login');
        }
    }

    /**
     * Delete a user document
     */
    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(this.collection, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting user document:', error);
            throw new Error('Failed to delete user document');
        }
    }

    /**
     * Get all user documents
     */
    async getAll(): Promise<UserDocument[]> {
        try {
            const q = query(this.collection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                } as UserDocument;
            });
        } catch (error) {
            console.error('Error getting all users:', error);
            throw new Error('Failed to get all users');
        }
    }

    /**
     * Check if a user document exists by ID
     */
    async exists(id: string): Promise<boolean> {
        try {
            const docRef = doc(this.collection, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists();
        } catch (error) {
            console.error('Error checking if user exists:', error);
            throw new Error('Failed to check if user exists');
        }
    }

    /**
     * Check if a user document exists by UID
     */
    async existsByUid(uid: string): Promise<boolean> {
        try {
            const userDoc = await this.getByUid(uid);
            return userDoc !== null;
        } catch (error) {
            console.error('Error checking if user exists by UID:', error);
            throw new Error('Failed to check if user exists by UID');
        }
    }

    /**
     * Get users by role
     */
    async getByRole(role: 'admin' | 'user'): Promise<UserDocument[]> {
        try {
            const q = query(this.collection, where('role', '==', role), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                } as UserDocument;
            });
        } catch (error) {
            console.error('Error getting users by role:', error);
            throw new Error('Failed to get users by role');
        }
    }

    /**
     * Get active users
     */
    async getActiveUsers(): Promise<UserDocument[]> {
        try {
            const q = query(this.collection, where('isActive', '==', true), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                } as UserDocument;
            });
        } catch (error) {
            console.error('Error getting active users:', error);
            throw new Error('Failed to get active users');
        }
    }
}
