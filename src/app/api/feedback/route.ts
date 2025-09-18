import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

// Handle CORS preflight requests
export async function OPTIONS() {
    return handleCorsPreflight();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const origin = request.headers.get('origin');

        // Validate required fields
        if (!body.websiteId || !body.apiKey) {
            const response = NextResponse.json(
                { error: 'Missing required fields: websiteId and apiKey' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // TODO: Add API key validation here
        // For now, we'll accept any API key

        // Prepare feedback data for Firestore
        const feedbackData = {
            websiteId: body.websiteId,
            userId: body.userId || 'anonymous', // Add userId field (required by interface)
            rating: body.rating || null,
            content: body.feedback || '', // Changed from 'feedback' to 'content' to match interface
            category: body.category || null,
            userInfo: body.userInfo || {},
            processed: false, // Add processed field
            metadata: {
                userAgent: request.headers.get('user-agent') || '',
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
                referer: request.headers.get('referer') || '',
                timestamp: serverTimestamp(),
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'feedback'), feedbackData);

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
