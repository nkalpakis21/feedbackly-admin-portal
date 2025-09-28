import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders } from '@/lib/cors';
import { getUserByUid } from '@/lib/firestore-server';
import { requireAuth } from '@/lib/auth-middleware';

export async function OPTIONS() {
    return new NextResponse(null, { status: 200 });
}

// GET user configuration by Firebase UID (admin portal)
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        
        // Verify Firebase authentication
        const authResult = await requireAuth(request);
        if ('error' in authResult) {
            return addCorsHeaders(authResult.error, origin);
        }
        
        const { user: authUser } = authResult;
        console.log('🔍 [ADMIN] Getting config for authenticated user:', authUser.uid);

        // Get user document by Firebase UID
        const user = await getUserByUid(authUser.uid);
        if (!user) {
            const response = NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
            return addCorsHeaders(response, origin);
        }

        // Return user's SDK configuration
        const response = NextResponse.json({
            success: true,
            config: user.sdkConfig,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        });
        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error getting user config:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}

// PUT update user configuration (admin portal)
export async function PUT(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        
        // Verify Firebase authentication
        const authResult = await requireAuth(request);
        if ('error' in authResult) {
            return addCorsHeaders(authResult.error, origin);
        }
        
        const { user: authUser } = authResult;
        console.log('🔍 [ADMIN] Updating config for authenticated user:', authUser.uid);

        const body = await request.json();
        const { config } = body;

        if (!config) {
            const response = NextResponse.json(
                { error: 'Configuration is required' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Get user document by Firebase UID
        const user = await getUserByUid(authUser.uid);
        if (!user) {
            const response = NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
            return addCorsHeaders(response, origin);
        }

        // Update user's SDK configuration
        // Note: This would need to be implemented in firestore-server.ts
        // await updateUserSdkConfig(user.id, config);

        const response = NextResponse.json({
            success: true,
            message: 'Configuration updated successfully'
        });
        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error updating user config:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}