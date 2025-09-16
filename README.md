# Shiply Admin Portal

A Next.js admin portal for managing the Shiply platform, built with TypeScript, Tailwind CSS, Firebase Authentication, and Firestore database.

## Features

- 🔐 **Firebase Authentication** - Secure admin login system
- 📊 **Dashboard** - Overview of platform statistics and recent activity
- 👥 **User Management** - View and manage user accounts
- 💬 **Feedback Management** - Review and process user feedback
- 🌐 **Website Management** - Manage connected websites and their settings
- 📈 **Analytics** - Detailed insights and analytics
- ⚙️ **Settings** - Configure platform and AI processing settings
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Icons**: Emoji-based icons for simplicity

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository and navigate to the admin portal directory:
   ```bash
   cd admin-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and Firestore Database

### 2. Configure Authentication

1. In the Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Create an admin user account

### 3. Configure Firestore

1. In the Firebase Console, go to Firestore Database
2. Create a database in production mode
3. Set up the following collections structure:

#### Collections Structure

```
users/
  - userId: string
  - email: string
  - name?: string
  - website?: string
  - createdAt: timestamp
  - lastLogin?: timestamp
  - isActive: boolean

feedback/
  - id: string
  - userId: string
  - content: string
  - rating?: number
  - category?: string
  - sentiment?: 'positive' | 'negative' | 'neutral'
  - createdAt: timestamp
  - processed: boolean
  - aiAnalysis?: {
      summary: string
      keywords: string[]
      sentiment: string
      priority: 'low' | 'medium' | 'high'
    }

websites/
  - id: string
  - userId: string
  - domain: string
  - name: string
  - createdAt: timestamp
  - isActive: boolean
  - settings: {
      theme: string
      position: string
      autoCollect: boolean
    }
```

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Main dashboard page
│   │   ├── users/           # User management
│   │   ├── feedback/        # Feedback management
│   │   ├── websites/        # Website management
│   │   ├── analytics/       # Analytics page
│   │   ├── settings/        # Settings page
│   │   └── layout.tsx       # Dashboard layout with auth
│   ├── login/               # Login page
│   ├── layout.tsx           # Root layout with auth provider
│   └── page.tsx             # Home page (redirects to login/dashboard)
├── components/
│   ├── AuthContext.tsx      # Firebase auth context
│   ├── ProtectedRoute.tsx   # Route protection component
│   ├── Header.tsx           # Dashboard header
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── LoginForm.tsx        # Login form component
│   ├── DashboardStats.tsx   # Dashboard statistics
│   └── RecentFeedback.tsx   # Recent feedback component
├── lib/
│   ├── firebase.ts          # Firebase configuration
│   └── firestore.ts         # Firestore database utilities
└── types/
    └── index.ts             # TypeScript type definitions
```

## Features Overview

### Dashboard
- Platform statistics overview
- Recent feedback display
- Quick action buttons
- Real-time data updates

### User Management
- View all registered users
- User status management
- User activity tracking
- Website associations

### Feedback Management
- View all feedback submissions
- AI analysis results
- Sentiment analysis
- Priority classification
- Processing status tracking

### Analytics
- Comprehensive platform metrics
- Sentiment distribution charts
- Category breakdowns
- Recent activity tracking
- Visual data representations

### Settings
- General platform settings
- AI processing configuration
- Email notification preferences
- Admin account management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new components in `src/components/`
2. Add new pages in `src/app/(dashboard)/`
3. Update types in `src/types/index.ts`
4. Add Firestore utilities in `src/lib/firestore.ts`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Security Considerations

- All routes are protected by Firebase Authentication
- Environment variables are properly configured
- Firestore security rules should be set up for production
- Admin access should be restricted to authorized users only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Shiply platform. All rights reserved.