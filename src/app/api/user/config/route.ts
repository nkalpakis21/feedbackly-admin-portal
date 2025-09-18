import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';
import { getUserByApiKey } from '@/lib/firestore';

// Handle CORS preflight requests
export async function OPTIONS() {
    return handleCorsPreflight();
}

// GET user configuration by API key
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const apiKey = request.headers.get('authorization')?.replace('Bearer ', '') || 
                      request.nextUrl.searchParams.get('apiKey');

        if (!apiKey) {
            const response = NextResponse.json(
                { error: 'Missing API key. Provide via Authorization header or apiKey query parameter' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Validate API key and get user
        const user = await getUserByApiKey(apiKey);
        if (!user) {
            const response = NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
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

// PUT update user configuration
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const origin = request.headers.get('origin');
        const apiKey = request.headers.get('authorization')?.replace('Bearer ', '') || body.apiKey;

        if (!apiKey) {
            const response = NextResponse.json(
                { error: 'Missing API key. Provide via Authorization header or in request body' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Validate API key and get user
        const user = await getUserByApiKey(apiKey);
        if (!user) {
            const response = NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
            return addCorsHeaders(response, origin);
        }

        // TODO: Validate and update user's SDK configuration
        // This will be implemented when we update the user repository

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
