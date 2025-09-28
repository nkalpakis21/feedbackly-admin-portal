import { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin-server';

export interface AuthenticatedUser {
    uid: string;
    email: string;
    name?: string;
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
        
        if (!adminApp) {
            console.error('❌ [AUTH] Firebase Admin not initialized');
            return null;
        }

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
export async function requireAuth(request: NextRequest): Promise<{ user: AuthenticatedUser } | { error: Response }> {
    const user = await verifyFirebaseToken(request);
    
    if (!user) {
        const response = new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return { error: response };
    }
    
    return { user };
}
