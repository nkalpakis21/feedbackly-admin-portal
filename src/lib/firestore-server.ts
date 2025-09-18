import { adminDb } from './firebase-admin-server';
import { User, WidgetConfig } from '@/types';

/**
 * Server-side Firestore functions for API routes
 * Uses Firebase Admin SDK
 */

/**
 * Get user by API key (server-side)
 */
export async function getUserByApiKey(apiKey: string): Promise<User | null> {
    try {
        if (!adminDb) {
            console.warn('Firebase Admin not initialized - returning null for getUserByApiKey');
            return null;
        }
        
        const usersRef = adminDb.collection('users');
        const snapshot = await usersRef.where('apiKey', '==', apiKey).limit(1).get();
        
        if (snapshot.empty) {
            return null;
        }
        
        const doc = snapshot.docs[0];
        const data = doc.data();
        
        return {
            id: doc.id,
            email: data.email,
            name: data.name,
            website: data.website,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLogin: data.lastLogin?.toDate(),
            isActive: data.isActive,
            apiKey: data.apiKey,
            sdkConfig: data.sdkConfig,
        } as User;
    } catch (error) {
        console.error('Error getting user by API key:', error);
        return null;
    }
}

/**
 * Get user by ID (server-side)
 */
export async function getUserById(userId: string): Promise<User | null> {
    try {
        if (!adminDb) {
            console.warn('Firebase Admin not initialized - returning null for getUserById');
            return null;
        }
        
        const userDoc = await adminDb.collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            return null;
        }
        
        const data = userDoc.data();
        if (!data) return null;
        
        return {
            id: userDoc.id,
            email: data.email,
            name: data.name,
            website: data.website,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLogin: data.lastLogin?.toDate(),
            isActive: data.isActive,
            apiKey: data.apiKey,
            sdkConfig: data.sdkConfig,
        } as User;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

/**
 * Create user (server-side)
 */
export async function createUser(userData: {
    email: string;
    name?: string;
    website?: string;
    apiKey: string;
    sdkConfig: WidgetConfig;
    isActive?: boolean;
}): Promise<User | null> {
    try {
        if (!adminDb) {
            console.warn('Firebase Admin not initialized - returning null for createUser');
            return null;
        }
        
        const now = new Date();
        const userDoc = {
            ...userData,
            isActive: userData.isActive ?? true,
            createdAt: now,
            updatedAt: now,
        };
        
        const docRef = await adminDb.collection('users').add(userDoc);
        
        return {
            id: docRef.id,
            ...userDoc,
        } as User;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

/**
 * Update user SDK config (server-side)
 */
export async function updateUserSdkConfig(userId: string, sdkConfig: WidgetConfig): Promise<boolean> {
    try {
        if (!adminDb) {
            console.warn('Firebase Admin not initialized - returning false for updateUserSdkConfig');
            return false;
        }
        
        await adminDb.collection('users').doc(userId).update({
            sdkConfig,
            updatedAt: new Date(),
        });
        return true;
    } catch (error) {
        console.error('Error updating user SDK config:', error);
        return false;
    }
}