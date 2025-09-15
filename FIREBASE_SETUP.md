# Firebase Setup Guide

This guide will help you set up Firebase for your Feedbackly admin portal and API routes.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `feedbackly` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location close to your users
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (`</>`)
4. Enter app nickname: `feedbackly-admin-portal`
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 4: Create Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration (from Step 3)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: API Secret for additional security
API_SECRET_KEY=your_secret_key_here
```

## Step 5: Set Up Firestore Collections

Your API routes expect these Firestore collections:

### `feedback` Collection
Documents will be automatically created when users submit feedback.

**Document Structure:**
```json
{
  "websiteId": "string",
  "rating": "number (optional)",
  "feedback": "string",
  "category": "string (optional)",
  "userInfo": "object",
  "metadata": {
    "userAgent": "string",
    "ip": "string",
    "referer": "string",
    "timestamp": "timestamp"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `events` Collection
Documents will be automatically created when events are tracked.

**Document Structure:**
```json
{
  "websiteId": "string",
  "eventName": "string",
  "eventData": "object",
  "userInfo": "object",
  "metadata": {
    "userAgent": "string",
    "ip": "string",
    "referer": "string",
    "timestamp": "timestamp"
  },
  "createdAt": "timestamp"
}
```

### `websites` Collection
You'll need to manually create documents for each website that uses your widget.

**Document Structure:**
```json
{
  "websiteId": "string",
  "theme": {
    "primaryColor": "#007bff",
    "backgroundColor": "#ffffff",
    "textColor": "#333333",
    "borderColor": "#e1e5e9",
    "borderRadius": "8px",
    "fontFamily": "system-ui, -apple-system, sans-serif",
    "fontSize": "14px",
    "headerBackgroundColor": "#f8f9fa",
    "footerBackgroundColor": "#f8f9fa"
  },
  "position": {
    "bottom": "20px",
    "right": "20px"
  },
  "size": {
    "width": "350px",
    "height": "500px"
  },
  "zIndex": 9999,
  "trigger": {
    "icon": "💬",
    "size": "60px",
    "iconSize": "24px"
  },
  "text": {
    "title": "Share Your Feedback",
    "ratingLabel": "How would you rate your experience?",
    "feedbackLabel": "Tell us more (optional)",
    "feedbackPlaceholder": "Share your thoughts, suggestions, or report any issues...",
    "categoryLabel": "Category",
    "submitButton": "Submit",
    "cancelButton": "Cancel"
  },
  "categories": [],
  "autoShow": false,
  "autoShowDelay": 5000,
  "showOnExit": false,
  "user": {}
}
```

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Check the browser console for any Firebase errors
3. Test the API endpoints using the browser or a tool like Postman

## Step 7: Security Rules (Optional)

For production, you should set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to feedback collection
    match /feedback/{document} {
      allow read, write: if true; // Adjust based on your needs
    }
    
    // Allow read/write access to events collection
    match /events/{document} {
      allow read, write: if true; // Adjust based on your needs
    }
    
    // Allow read access to websites collection
    match /websites/{document} {
      allow read: if true;
      allow write: if false; // Only allow admin writes
    }
  }
}
```

## Troubleshooting

- **Firebase not initialized**: Check that all environment variables are set correctly
- **Permission denied**: Check Firestore security rules
- **CORS errors**: Make sure you're using the correct Firebase configuration
- **API key errors**: Verify the API key is correct and has the right permissions

## Next Steps

After setting up Firebase:
1. Create a sample website document in the `websites` collection
2. Test the widget integration
3. Set up proper security rules for production
4. Deploy to Vercel with environment variables
