import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

export interface AuthenticatedUser {
    uid: string;
    email: string;
    name?: string;
}

/**
 * Get Firebase Admin app instance
 */
function getAdminApp() {
    if (getApps().length === 0) {
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
            throw new Error('Firebase Admin SDK not configured');
        }
        
        return initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    }
    return getApps()[0];
}

/**
 * Verify Firebase ID token from request headers
 * Used for admin portal authentication
 */
export async function verifyFirebaseToken(request: NextRequest): Promise<AuthenticatedUser | null> {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('🔍 [AUTH] No valid authorization header found');
            return null;
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('🔍 [AUTH] Verifying Firebase token...');
        
        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const decodedToken = await auth.verifyIdToken(token);
        
        console.log('✅ [AUTH] Token verified for user:', decodedToken.uid);
        
        return {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            name: decodedToken.name || undefined,
        };
    } catch (error) {
        console.error('❌ [AUTH] Token verification failed:', error);
        return null;
    }
}

/**
 * Middleware to require authentication for admin portal routes
 */
export async function requireAuth(request: NextRequest): Promise<{ user: AuthenticatedUser } | { error: NextResponse }> {
    const user = await verifyFirebaseToken(request);
    
    if (!user) {
        const response = NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
        return { error: response };
    }
    
    return { user };
}