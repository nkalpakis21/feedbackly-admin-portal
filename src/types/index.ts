import { Timestamp } from 'firebase/firestore';

export interface User {
    id: string;
    email: string;
    name?: string;
    website?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
    
    // NEW: User-centric API and configuration
    apiKey: string;           // Auto-generated on registration
    sdkConfig: WidgetConfig;  // User's widget configuration
}

// Firestore document types
export interface UserDocument {
    id: string;
    email: string;
    name?: string;
    website?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastLogin?: Timestamp;
    isActive: boolean;
    
    // NEW: User-centric API and configuration
    apiKey: string;           // Auto-generated on registration
    sdkConfig: WidgetConfig;  // User's widget configuration
}

// User management types
export interface CreateUserRequest {
    uid?: string;
    email: string;
    name?: string;
    displayName?: string;
    photoURL?: string;
    website?: string;
    provider?: 'email' | 'google.com';
}

export interface UpdateUserRequest {
    name?: string;
    website?: string;
    isActive?: boolean;
    role?: 'admin' | 'user';
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    website?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
    
    // NEW: User-centric API and configuration
    apiKey: string;           // Auto-generated on registration
    sdkConfig: WidgetConfig;  // User's widget configuration
}

export interface Feedback {
    id: string;
    userId: string;
    content: string;
    rating?: number;
    category?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    createdAt: Date;
    processed: boolean;
    aiAnalysis?: {
        summary: string;
        keywords: string[];
        sentiment: string;
        priority: 'low' | 'medium' | 'high';
    };
}

// Enhanced Widget Configuration Types
export interface WidgetTheme {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: string;
    fontFamily: string;
    fontSize: string;
    headerBackgroundColor: string;
    footerBackgroundColor: string;
}

export interface WidgetPosition {
    bottom: string;
    right: string;
}

export interface WidgetSize {
    width: string;
    height: string;
}

export interface WidgetText {
    title: string;
    ratingLabel: string;
    feedbackLabel: string;
    feedbackPlaceholder: string;
    categoryLabel: string;
    submitButton: string;
    cancelButton: string;
}

export interface WidgetCategory {
    value: string;
    label: string;
}

export interface WidgetBehavior {
    autoShow: boolean;
    autoShowDelay: number;
    showOnExit: boolean;
    categories: WidgetCategory[];
}

export interface WidgetBranding {
    logo?: string;
    companyName?: string;
}

export interface WidgetConfig {
    theme: WidgetTheme;
    position: WidgetPosition;
    size: WidgetSize;
    text: WidgetText;
    behavior: WidgetBehavior;
    branding: WidgetBranding;
}

export interface SystemConfig {
    apiUrl: string;
    sdkVersion: string;
    rateLimit: number;
    dataRetention: number;
}

export interface Website {
    id: string;
    userId: string;
    domain: string;
    name: string;
    apiKey: string; // Auto-generated, managed by system
    createdAt: Date;
    isActive: boolean;

    // Admin-configurable settings
    widgetConfig: WidgetConfig;

    // System-managed (read-only)
    systemConfig: SystemConfig;

    // Legacy settings (for backward compatibility)
    settings?: {
        theme: string;
        position: string;
        autoCollect: boolean;
    };
}

// Website management types
export interface CreateWebsiteRequest {
    domain: string;
    name: string;
    widgetConfig?: Partial<WidgetConfig>;
}

export interface UpdateWebsiteRequest {
    name?: string;
    domain?: string;
    isActive?: boolean;
    widgetConfig?: Partial<WidgetConfig>;
}

export interface WidgetConfigUpdateRequest {
    theme?: Partial<WidgetTheme>;
    position?: Partial<WidgetPosition>;
    size?: Partial<WidgetSize>;
    text?: Partial<WidgetText>;
    behavior?: Partial<WidgetBehavior>;
    branding?: Partial<WidgetBranding>;
}

export interface Analytics {
    totalUsers: number;
    totalFeedback: number;
    averageRating: number;
    sentimentDistribution: {
        positive: number;
        negative: number;
        neutral: number;
    };
    feedbackByCategory: Record<string, number>;
    recentActivity: {
        newUsers: number;
        newFeedback: number;
        processedFeedback: number;
    };
}
