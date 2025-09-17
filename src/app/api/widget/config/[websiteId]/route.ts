import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

// Handle CORS preflight requests
export async function OPTIONS() {
    return handleCorsPreflight();
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ websiteId: string }> }
) {
    try {
        const { websiteId } = await params;
        const origin = request.headers.get('origin');

        if (!websiteId) {
            const response = NextResponse.json(
                { error: 'Website ID is required' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Get website configuration from Firestore
        const websiteDoc = await getDoc(doc(db, 'websites', websiteId));

        if (!websiteDoc.exists()) {
            const response = NextResponse.json(
                { error: 'Website not found' },
                { status: 404 }
            );
            return addCorsHeaders(response, origin);
        }

        const websiteData = websiteDoc.data();

        // Return widget configuration
        const widgetConfig = {
            websiteId: websiteId,
            theme: websiteData.theme || {
                primaryColor: '#007bff',
                backgroundColor: '#ffffff',
                textColor: '#333333',
                borderColor: '#e1e5e9',
                borderRadius: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '14px',
                headerBackgroundColor: '#f8f9fa',
                footerBackgroundColor: '#f8f9fa',
            },
            position: websiteData.position || {
                bottom: '20px',
                right: '20px',
            },
            size: websiteData.size || {
                width: '350px',
                height: '500px',
            },
            zIndex: websiteData.zIndex || 9999,
            trigger: websiteData.trigger || {
                icon: '💬',
                size: '60px',
                iconSize: '24px',
            },
            text: websiteData.text || {
                title: 'Share Your Feedback',
                ratingLabel: 'How would you rate your experience?',
                feedbackLabel: 'Tell us more (optional)',
                feedbackPlaceholder: 'Share your thoughts, suggestions, or report any issues...',
                categoryLabel: 'Category',
                submitButton: 'Submit',
                cancelButton: 'Cancel',
            },
            categories: websiteData.categories || [],
            autoShow: websiteData.autoShow || false,
            autoShowDelay: websiteData.autoShowDelay || 5000,
            showOnExit: websiteData.showOnExit || false,
            user: websiteData.user || {},
        };

        const response = NextResponse.json(widgetConfig);
        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error getting widget config:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}
