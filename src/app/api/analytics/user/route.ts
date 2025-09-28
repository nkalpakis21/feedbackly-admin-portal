import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders } from '@/lib/cors';
import { requireAuth } from '@/lib/auth-middleware';
import { AnalyticsService } from '@/services/analytics/AnalyticsService';
import { UserRepository } from '@/repositories/user/UserRepository';

export async function OPTIONS() {
    return new NextResponse(null, { status: 200 });
}

/**
 * GET user-specific analytics data
 * Returns analytics for the authenticated user only
 */
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        
        // Verify authentication
        const authResult = await requireAuth(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        // Cross-reference Firebase UID to Firestore user ID
        console.log('Looking up user by Firebase UID for analytics:', authResult.user.uid);
        const userRepository = new UserRepository();
        const user = await userRepository.getUserByUid(authResult.user.uid);
        
        if (!user) {
            return addCorsHeaders(
                NextResponse.json({ error: 'User not found' }, { status: 404 }),
                origin
            );
        }
        
        console.log('Found user in Firestore for analytics:', user.id, 'Fetching analytics for user');
        const analyticsService = new AnalyticsService();
        const userAnalytics = await analyticsService.getUserAnalytics(user.id);

        const response = NextResponse.json({
            success: true,
            data: userAnalytics,
            timestamp: new Date().toISOString(),
        });

        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error fetching user analytics:', error);
        const response = NextResponse.json(
            { 
                success: false,
            error: 'Failed to fetch user analytics',
            details: error instanceof Error ? error.message : 'Unknown error'
        },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}
