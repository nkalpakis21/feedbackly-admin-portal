import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.websiteId || !body.apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: websiteId and apiKey' },
        { status: 400 }
      );
    }

    // TODO: Add API key validation here
    // For now, we'll accept any API key
    
    // Prepare feedback data for Firestore
    const feedbackData = {
      websiteId: body.websiteId,
      rating: body.rating || null,
      feedback: body.feedback || '',
      category: body.category || null,
      userInfo: body.userInfo || {},
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

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: docRef.id,
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
