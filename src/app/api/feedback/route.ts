import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders } from '@/lib/cors';
import { requireAuth } from '@/lib/auth-middleware';
import { FeedbackService } from '@/services/feedback/FeedbackService';
import { FeedbackRepository } from '@/repositories/feedback/FeedbackRepository';
import { UserRepository } from '@/repositories/user/UserRepository';

export async function OPTIONS() {
    return new NextResponse(null, { status: 200 });
}

/**
 * GET feedback data
 * Returns feedback based on query parameters
 */
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        
        // Verify authentication
        const authResult = await requireAuth(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'recent';
        const limit = parseInt(searchParams.get('limit') || '10');
        const userId = searchParams.get('userId');

        const feedbackRepository = new FeedbackRepository();
        const feedbackService = new FeedbackService(feedbackRepository);

        let feedback;

        switch (type) {
            case 'recent':
                feedback = await feedbackService.getRecentFeedback(limit);
                break;
            case 'all':
                feedback = await feedbackService.getAllFeedback();
                break;
            case 'user':
                if (!userId) {
                    return addCorsHeaders(
                        NextResponse.json({ error: 'userId parameter required for user feedback' }, { status: 400 }),
                        origin
                    );
                }
                
                // Cross-reference Firebase UID to Firestore user ID
                console.log('Looking up user by Firebase UID:', userId);
                const userRepository = new UserRepository();
                const user = await userRepository.getUserByUid(userId);
                
                if (!user) {
                    return addCorsHeaders(
                        NextResponse.json({ error: 'User not found' }, { status: 404 }),
                        origin
                    );
                }
                
                console.log('Found user in Firestore:', user.id, 'Fetching feedback for user');
                feedback = await feedbackService.getFeedbackByUser(user.id);
                break;
            case 'dateRange':
                const startDate = searchParams.get('startDate');
                const endDate = searchParams.get('endDate');
                if (!startDate || !endDate) {
                    return addCorsHeaders(
                        NextResponse.json({ error: 'startDate and endDate parameters required for date range feedback' }, { status: 400 }),
                        origin
                    );
                }
                feedback = await feedbackService.getFeedbackByDateRange(new Date(startDate), new Date(endDate));
                break;
            default:
                return addCorsHeaders(
                    NextResponse.json({ error: 'Invalid type parameter. Use: recent, all, user, or dateRange' }, { status: 400 }),
                    origin
                );
        }

        const response = NextResponse.json({
            success: true,
            data: feedback,
            timestamp: new Date().toISOString(),
        });

        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error fetching feedback:', error);
        const response = NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch feedback',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}

/**
 * POST feedback data
 * For more complex queries or feedback statistics
 */
export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        
        // Verify authentication
        const authResult = await requireAuth(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const body = await request.json();
        const { type } = body;

        const feedbackRepository = new FeedbackRepository();
        const feedbackService = new FeedbackService(feedbackRepository);

        let result;

        switch (type) {
            case 'stats':
                result = await feedbackService.getFeedbackStats();
                break;
            case 'processedCount':
                const count = await feedbackService.getProcessedFeedbackCount();
                result = { count };
                break;
            default:
                return addCorsHeaders(
                    NextResponse.json({ error: 'Invalid type parameter. Use: stats or processedCount' }, { status: 400 }),
                    origin
                );
        }

        const response = NextResponse.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        });

        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error processing feedback request:', error);
        const response = NextResponse.json(
            { 
                success: false,
                error: 'Failed to process feedback request',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}
