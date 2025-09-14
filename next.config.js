/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['firebase'],
  env: {
    // Provide default values for build time
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-key',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'dummy-app-id',
    // Feedbackly SDK Configuration
    NEXT_PUBLIC_FEEDBACKLY_API_KEY: process.env.NEXT_PUBLIC_FEEDBACKLY_API_KEY || 'demo-api-key',
    NEXT_PUBLIC_FEEDBACKLY_WEBSITE_ID: process.env.NEXT_PUBLIC_FEEDBACKLY_WEBSITE_ID || 'admin-portal',
  },
};

module.exports = nextConfig;
