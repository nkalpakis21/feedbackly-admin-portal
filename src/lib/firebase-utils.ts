import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Create a sample website configuration in Firestore
 * This is useful for testing the widget integration
 */
export async function createSampleWebsite(websiteId: string) {
    const websiteConfig = {
        websiteId: websiteId,
        theme: {
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
        position: {
            bottom: '20px',
            right: '20px',
        },
        size: {
            width: '350px',
            height: '500px',
        },
        zIndex: 9999,
        trigger: {
            icon: '💬',
            size: '60px',
            iconSize: '24px',
        },
        text: {
            title: 'Share Your Feedback',
            ratingLabel: 'How would you rate your experience?',
            feedbackLabel: 'Tell us more (optional)',
            feedbackPlaceholder: 'Share your thoughts, suggestions, or report any issues...',
            categoryLabel: 'Category',
            submitButton: 'Submit',
            cancelButton: 'Cancel',
        },
        categories: [
            { id: 'general', label: 'General Feedback' },
            { id: 'bug', label: 'Bug Report' },
            { id: 'feature', label: 'Feature Request' },
            { id: 'ui', label: 'UI/UX Issue' },
        ],
        autoShow: false,
        autoShowDelay: 5000,
        showOnExit: false,
        user: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    try {
        await setDoc(doc(db, 'websites', websiteId), websiteConfig);
        console.log(`✅ Sample website configuration created for: ${websiteId}`);
        return { success: true, websiteId };
    } catch (error) {
        console.error('❌ Error creating sample website:', error);
        return { success: false, error };
    }
}

/**
 * Get all websites from Firestore
 */
export async function getAllWebsites() {
    try {
        const { collection, getDocs } = await import('firebase/firestore');
        const querySnapshot = await getDocs(collection(db, 'websites'));
        const websites = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, websites };
    } catch (error) {
        console.error('❌ Error getting websites:', error);
        return { success: false, error };
    }
}

/**
 * Test Firebase connection
 */
export async function testFirebaseConnection() {
    try {
        const { collection, getDocs, limit } = await import('firebase/firestore');
        const querySnapshot = await getDocs(collection(db, 'websites'));
        console.log('✅ Firebase connection successful');
        return { success: true, message: 'Firebase connection successful' };
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        return { success: false, error };
    }
}
