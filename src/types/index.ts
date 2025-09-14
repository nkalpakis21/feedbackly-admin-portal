export interface User {
    id: string;
    email: string;
    name?: string;
    website?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
}

// Firestore document types
export interface UserDocument {
    id: string;
    email: string;
    name?: string;
    website?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
}

// User management types
export interface CreateUserRequest {
    email: string;
    name?: string;
    website?: string;
}

export interface UpdateUserRequest {
    name?: string;
    website?: string;
    isActive?: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    website?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
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

export interface Website {
    id: string;
    userId: string;
    domain: string;
    name: string;
    createdAt: Date;
    isActive: boolean;
    settings: {
        theme: string;
        position: string;
        autoCollect: boolean;
    };
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
