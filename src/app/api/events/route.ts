import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';
import { getUserByApiKey } from '@/lib/firestore-server';

// Handle CORS preflight requests
export async function OPTIONS() {
    return handleCorsPreflight();
}

/**
 * POST event tracking
 * Uses API key authentication for SDK compatibility
 * Admin portal uses different authentication method
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const origin = request.headers.get('origin');

        // Validate required fields
        if (!body.websiteId || !body.apiKey || !body.eventName) {
            const response = NextResponse.json(
                { error: 'Missing required fields: websiteId, apiKey, and eventName' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Validate API key and get user (SDK authentication)
        console.log('🔍 Debug: Validating API key for event tracking');
        const user = await getUserByApiKey(body.apiKey);
        if (!user) {
            const response = NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
            return addCorsHeaders(response, origin);
        }

        console.log('✅ Debug: API key validated for user:', user.email);

        // Prepare event data for Firestore
        const eventData = {
            websiteId: body.websiteId,
            eventName: body.eventName,
            eventData: body.eventData || {},
            userInfo: body.userInfo || {},
            userId: user.id,
            userEmail: user.email,
            metadata: {
                userAgent: request.headers.get('user-agent') || '',
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
                referer: request.headers.get('referer') || '',
                timestamp: serverTimestamp(),
            },
            createdAt: serverTimestamp(),
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'events'), eventData);

        const response = NextResponse.json({
            success: true,
            message: 'Event tracked successfully',
            eventId: docRef.id,
        });
        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error tracking event:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}