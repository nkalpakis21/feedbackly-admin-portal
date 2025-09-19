import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';
import { getUserByApiKey } from '@/lib/firestore-server';
import { adminDb } from '@/lib/firebase-admin-server';

export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflight();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { apiKey, content, rating, category, metadata } = body;

        // Validate required fields
        if (!apiKey) {
            const response = NextResponse.json(
                { error: 'API key is required' },
                { status: 400 }
            );
            return addCorsHeaders(response);
        }

        if (!content) {
            const response = NextResponse.json(
                { error: 'Feedback content is required' },
                { status: 400 }
            );
            return addCorsHeaders(response);
        }

        // Get user by API key
        const user = await getUserByApiKey(apiKey);
        if (!user) {
            const response = NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
            return addCorsHeaders(response);
        }

        // Prepare feedback data
        const feedbackData = {
            content,
            rating: rating || null,
            category: category || 'general',
            metadata: metadata || {},
            userId: user.id,
            userEmail: user.email,
            processed: false,
            createdAt: new Date(),
        };

        // Store feedback in Firestore
        if (adminDb) {
            await adminDb.collection('feedback').add(feedbackData);
        } else {
            console.error('Admin database not available');
            const response = NextResponse.json(
                { error: 'Database not available' },
                { status: 500 }
            );
            return addCorsHeaders(response);
        }

        const response = NextResponse.json(
            { success: true, message: 'Feedback submitted successfully' },
            { status: 201 }
        );
        return addCorsHeaders(response);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response);
    }
}