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
    if (!body.websiteId || !body.apiKey || !body.eventName) {
      const response = NextResponse.json(
        { error: 'Missing required fields: websiteId, apiKey, and eventName' },
        { status: 400 }
      );
      return addCorsHeaders(response, origin);
    }

    // TODO: Add API key validation here
    // For now, we'll accept any API key
    
    // Prepare event data for Firestore
    const eventData = {
      websiteId: body.websiteId,
      eventName: body.eventName,
      eventData: body.eventData || {},
      userInfo: body.userInfo || {},
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
