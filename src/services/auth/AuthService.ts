import {
    User,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    Unsubscribe
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { UserService } from '../user/UserService';
import { CreateUserRequest } from '@/types';

export class AuthService {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    /**
     * Sign in with email and password
     */
    async signInWithEmail(email: string, password: string): Promise<User> {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create or update user document
            await this.handleUserAuthentication(user, 'email');

            return user;
        } catch (error) {
            console.error('Error in AuthService.signInWithEmail:', error);
            throw error;
        }
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Create or update user document
            await this.handleUserAuthentication(user, 'google.com');

            return user;
        } catch (error) {
            console.error('Error in AuthService.signInWithGoogle:', error);
            throw error;
        }
    }

    /**
     * Sign up with email and password
     */
    async signUpWithEmail(email: string, password: string): Promise<User> {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document
            await this.handleUserAuthentication(user, 'email');

            return user;
        } catch (error) {
            console.error('Error in AuthService.signUpWithEmail:', error);
            throw error;
        }
    }

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error in AuthService.signOut:', error);
            throw error;
        }
    }

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        return auth.currentUser;
    }

    /**
     * Listen to authentication state changes
     */
    onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
        return onAuthStateChanged(auth, callback);
    }

    /**
     * Handle user authentication (create or update user document)
     */
    private async handleUserAuthentication(user: User, provider: 'email' | 'google.com'): Promise<void> {
        try {
            const userData: CreateUserRequest = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || undefined,
                photoURL: user.photoURL || undefined,
                provider,
            };

            // Create or update user document
            await this.userService.createOrUpdateUser(userData);
        } catch (error) {
            console.error('Error handling user authentication:', error);
            // Don't throw here to avoid breaking the auth flow
            // The user is still authenticated even if document creation fails
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return auth.currentUser !== null;
    }

    /**
     * Get user's ID token
     */
    async getIdToken(): Promise<string | null> {
        try {
            const user = auth.currentUser;
            if (user) {
                return await user.getIdToken();
            }
            return null;
        } catch (error) {
            console.error('Error getting ID token:', error);
            throw error;
        }
    }

    /**
     * Refresh user's ID token
     */
    async refreshIdToken(): Promise<string | null> {
        try {
            const user = auth.currentUser;
            if (user) {
                return await user.getIdToken(true);
            }
            return null;
        } catch (error) {
            console.error('Error refreshing ID token:', error);
            throw error;
        }
    }

    /**
     * Get user's email
     */
    getUserEmail(): string | null {
        const user = auth.currentUser;
        return user?.email || null;
    }

    /**
     * Get user's display name
     */
    getUserDisplayName(): string | null {
        const user = auth.currentUser;
        return user?.displayName || null;
    }

    /**
     * Get user's photo URL
     */
    getUserPhotoURL(): string | null {
        const user = auth.currentUser;
        return user?.photoURL || null;
    }

    /**
     * Get user's UID
     */
    getUserUID(): string | null {
        const user = auth.currentUser;
        return user?.uid || null;
    }
}

