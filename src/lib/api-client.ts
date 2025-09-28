import { auth } from '@/lib/firebase';

/**
 * Base API client with authentication utilities
 */
export class ApiClient {
    /**
     * Get Firebase ID token for authentication
     */
    protected async getIdToken(): Promise<string | null> {
        const user = auth.currentUser;
        if (!user) {
            console.error('No authenticated user found');
            return null;
        }
        
        try {
            return await user.getIdToken();
        } catch (error) {
            console.error('Error getting ID token:', error);
            return null;
        }
    }

    /**
     * Make authenticated request
     */
    protected async makeAuthenticatedRequest<T>(url: string, options?: RequestInit): Promise<T> {
        const idToken = await this.getIdToken();
        
        if (!idToken) {
            throw new Error('Authentication required. Please log in.');
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please log in again.');
            }
            throw new Error(`Request failed: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Make authenticated GET request
     */
    protected async get<T>(url: string, params?: Record<string, string>): Promise<T> {
        const urlWithParams = params ? `${url}?${new URLSearchParams(params).toString()}` : url;
        return this.makeAuthenticatedRequest<T>(urlWithParams);
    }

    /**
     * Make authenticated POST request
     */
    protected async post<T>(url: string, body?: unknown): Promise<T> {
        return this.makeAuthenticatedRequest<T>(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}
