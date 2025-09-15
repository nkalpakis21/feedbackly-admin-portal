import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.websiteId || !body.apiKey || !body.eventName) {
      return NextResponse.json(
        { error: 'Missing required fields: websiteId, apiKey, and eventName' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      eventId: docRef.id,
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
