# Vercel API Routes Setup

This document describes the API routes that have been set up for the Shiply widget integration.

## API Endpoints

### 1. POST /api/feedback
Submits feedback data to the database.

**Request Body:**
```json
{
  "websiteId": "string",
  "apiKey": "string",
  "rating": "number (optional)",
  "feedback": "string (optional)",
  "category": "string (optional)",
  "userInfo": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedbackId": "string"
}
```

### 2. POST /api/events
Tracks custom events.

**Request Body:**
```json
{
  "websiteId": "string",
  "apiKey": "string",
  "eventName": "string",
  "eventData": "object (optional)",
  "userInfo": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event tracked successfully",
  "eventId": "string"
}
```

### 3. GET /api/widget/config/[websiteId]
Retrieves widget configuration for a specific website.

**Response:**
```json
{
  "websiteId": "string",
  "theme": {
    "primaryColor": "string",
    "backgroundColor": "string",
    "textColor": "string",
    "borderColor": "string",
    "borderRadius": "string",
    "fontFamily": "string",
    "fontSize": "string",
    "headerBackgroundColor": "string",
    "footerBackgroundColor": "string"
  },
  "position": {
    "bottom": "string",
    "right": "string"
  },
  "size": {
    "width": "string",
    "height": "string"
  },
  "zIndex": "number",
  "trigger": {
    "icon": "string",
    "size": "string",
    "iconSize": "string"
  },
  "text": {
    "title": "string",
    "ratingLabel": "string",
    "feedbackLabel": "string",
    "feedbackPlaceholder": "string",
    "categoryLabel": "string",
    "submitButton": "string",
    "cancelButton": "string"
  },
  "categories": "array",
  "autoShow": "boolean",
  "autoShowDelay": "number",
  "showOnExit": "boolean",
  "user": "object"
}
```

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# API Configuration
API_SECRET_KEY=your_secret_key_for_api_validation

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Firebase Collections

The API routes expect the following Firestore collections:

- `feedback` - Stores submitted feedback
- `events` - Stores tracked events
- `websites` - Stores website configurations

## Next Steps

1. Set up Firebase project and get configuration
2. Add environment variables to `.env.local`
3. Deploy to Vercel
4. Update widget SDK to point to new API URL
5. Test the integration

