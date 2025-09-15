import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { websiteId: string } }
) {
  try {
    const { websiteId } = params;
    
    if (!websiteId) {
      return NextResponse.json(
        { error: 'Website ID is required' },
        { status: 400 }
      );
    }

    // Get website configuration from Firestore
    const websiteDoc = await getDoc(doc(db, 'websites', websiteId));
    
    if (!websiteDoc.exists()) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
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

    return NextResponse.json(widgetConfig);

  } catch (error) {
    console.error('Error getting widget config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
