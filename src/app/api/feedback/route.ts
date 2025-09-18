import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';
import { getUserByApiKey } from '@/lib/firestore-server';
import { adminDb } from '@/lib/firebase-admin-server';

// Handle CORS preflight requests
export async function OPTIONS() {
    return handleCorsPreflight();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const origin = request.headers.get('origin');

        // Validate required fields (only apiKey is required now)
        if (!body.apiKey) {
            const response = NextResponse.json(
                { error: 'Missing required field: apiKey' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Validate API key and get user
        const user = await getUserByApiKey(body.apiKey);
        if (!user) {
            const response = NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
            return addCorsHeaders(response, origin);
        }

        // Prepare feedback data for Firestore
        const now = new Date();
        const feedbackData = {
            userId: user.id, // Use the actual user ID from the API key
            userEmail: user.email, // Include user email for easier identification
            rating: body.rating || null,
            content: body.feedback || '', // Changed from 'feedback' to 'content' to match interface
            category: body.category || null,
            userInfo: body.userInfo || {},
            processed: false, // Add processed field
            metadata: {
                userAgent: request.headers.get('user-agent') || '',
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
                referer: request.headers.get('referer') || '',
                timestamp: now,
            },
            createdAt: now,
            updatedAt: now,
        };

        // Add to Firestore using Admin SDK
        if (!adminDb) {
            const response = NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
            return addCorsHeaders(response, origin);
        }
        
        const docRef = await adminDb.collection('feedback').add(feedbackData);

        const response = NextResponse.json({
            success: true,
            message: 'Feedback submitted successfully',
            feedbackId: docRef.id,
        });
        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error submitting feedback:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}
