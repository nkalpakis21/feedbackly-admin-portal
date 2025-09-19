import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Firebase Admin SDK configuration
let adminApp: App | undefined;
let adminDb: Firestore | null;

// Only initialize if we have the required environment variables
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const firebaseAdminConfig = {
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
    };

    // Initialize Firebase Admin
    if (getApps().length === 0) {
        adminApp = initializeApp(firebaseAdminConfig);
    } else {
        adminApp = getApps()[0];
    }

    adminDb = getFirestore(adminApp);
} else {
    // In development/build time without credentials, create a mock
    console.warn('Firebase Admin SDK not initialized: Missing environment variables');
    adminDb = null;
}

export { adminDb };
export default adminApp;