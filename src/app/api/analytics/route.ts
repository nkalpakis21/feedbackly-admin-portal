import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders } from '@/lib/cors';
import { AnalyticsService } from '@/services/analytics/AnalyticsService';

export async function OPTIONS() {
    return new NextResponse(null, { status: 200 });
}

/**
 * GET analytics data
 * Returns comprehensive analytics for the admin portal
 */
export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const url = new URL(request.url);
        const dateRange = url.searchParams.get('dateRange');
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        const analyticsService = new AnalyticsService();
        let analytics;

        // Handle date range queries
        if (dateRange === 'custom' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            analytics = await analyticsService.getAnalyticsByDateRange(start, end);
        } else if (dateRange === 'week') {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 7);
            analytics = await analyticsService.getAnalyticsByDateRange(start, end);
        } else if (dateRange === 'month') {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            analytics = await analyticsService.getAnalyticsByDateRange(start, end);
        } else {
            // Default: get all analytics
            analytics = await analyticsService.getAnalytics();
        }

        const response = NextResponse.json({
            success: true,
            data: analytics,
            timestamp: new Date().toISOString(),
        });

        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error fetching analytics:', error);
        const response = NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch analytics data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}

/**
 * GET specific analytics endpoints
 */
export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const body = await request.json();
        const { type } = body;

        const analyticsService = new AnalyticsService();
        let data;

        switch (type) {
            case 'recent-activity':
                data = await analyticsService.getRecentActivity();
                break;
            case 'feedback-stats':
                data = await analyticsService.getFeedbackStats();
                break;
            case 'user-stats':
                data = await analyticsService.getUserStats();
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid analytics type' },
                    { status: 400 }
                );
        }

        const response = NextResponse.json({
            success: true,
            data,
            type,
            timestamp: new Date().toISOString(),
        });

        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error fetching specific analytics:', error);
        const response = NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch analytics data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}
