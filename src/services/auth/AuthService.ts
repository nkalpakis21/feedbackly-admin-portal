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

type AuthProvider = 'email' | 'google.com';

export class AuthService {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    // ==================== AUTHENTICATION METHODS ====================

    /**
     * Sign in with email and password
     */
    async signInWithEmail(email: string, password: string): Promise<User> {
        this.validateCredentials(email, password);
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await this.handleUserAuthentication(user, 'email');
        return user;
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle(): Promise<User> {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        await this.handleUserAuthentication(user, 'google.com');
        return user;
    }

    /**
     * Sign up with email and password
     */
    async signUpWithEmail(email: string, password: string): Promise<User> {
        this.validateCredentials(email, password);
        
        console.log('🔍 [SIGNUP] Creating Firebase Auth user for:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('✅ [SIGNUP] Firebase Auth user created:', user.uid);

        try {
            console.log('🔍 [SIGNUP] Creating Firestore user document...');
            await this.handleUserAuthentication(user, 'email');
            console.log('✅ [SIGNUP] Complete signup process finished successfully');
            return user;
        } catch (error) {
            console.error('❌ [SIGNUP] Error in signup process:', error);
            
            // Clean up Firebase Auth user if document creation failed
            if (error instanceof Error && error.message.includes('Failed to create user document')) {
                await this.cleanupAuthUser(user);
            }
            
            throw error;
        }
    }

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        await signOut(auth);
    }

    // ==================== PUBLIC GETTERS ====================

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        return auth.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return auth.currentUser !== null;
    }

    /**
     * Get user's email
     */
    getUserEmail(): string | null {
        return auth.currentUser?.email || null;
    }

    /**
     * Get user's display name
     */
    getUserDisplayName(): string | null {
        return auth.currentUser?.displayName || null;
    }

    /**
     * Get user's photo URL
     */
    getUserPhotoURL(): string | null {
        return auth.currentUser?.photoURL || null;
    }

    /**
     * Get user's UID
     */
    getUserUID(): string | null {
        return auth.currentUser?.uid || null;
    }

    /**
     * Get user's ID token
     */
    async getIdToken(): Promise<string | null> {
        const user = auth.currentUser;
        return user ? await user.getIdToken() : null;
    }

    /**
     * Refresh user's ID token
     */
    async refreshIdToken(): Promise<string | null> {
        const user = auth.currentUser;
        return user ? await user.getIdToken(true) : null;
    }

    /**
     * Listen to authentication state changes
     */
    onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
        return onAuthStateChanged(auth, callback);
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Validate email and password credentials
     */
    private validateCredentials(email: string, password: string): void {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
    }

    /**
     * Handle user authentication (create or update user document)
     */
    private async handleUserAuthentication(user: User, provider: AuthProvider): Promise<void> {
        try {
            console.log('🔍 [AUTH] Starting user document creation for:', {
                uid: user.uid,
                email: user.email,
                provider
            });

            const userData = this.buildUserData(user, provider);
            console.log('🔍 [AUTH] User data prepared:', userData);

            const result = await this.userService.createOrUpdateUser(userData);
            console.log('✅ [AUTH] User document created successfully:', result);
        } catch (error) {
            console.error('❌ [AUTH] Error handling user authentication:', error);
            this.logErrorDetails(error);
            throw new Error(`Failed to create user document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Build user data from Firebase User object
     */
    private buildUserData(user: User, provider: AuthProvider): CreateUserRequest {
        const userData: CreateUserRequest = {
            uid: user.uid,
            email: user.email || '',
            provider,
        };

        // Only add optional fields if they have values
        if (user.displayName) {
            userData.displayName = user.displayName;
        }
        if (user.photoURL) {
            userData.photoURL = user.photoURL;
        }

        return userData;
    }

    /**
     * Clean up Firebase Auth user (for signup failures)
     */
    private async cleanupAuthUser(user: User): Promise<void> {
        try {
            console.log('🧹 [SIGNUP] Cleaning up Firebase Auth user due to document creation failure');
            await user.delete();
        } catch (deleteError) {
            console.error('❌ [SIGNUP] Failed to clean up auth user:', deleteError);
        }
    }

    /**
     * Log error details for debugging
     */
    private logErrorDetails(error: unknown): void {
        console.error('❌ [AUTH] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown'
        });
    }
}