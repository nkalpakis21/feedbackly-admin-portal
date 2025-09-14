// Dynamic Feedbackly SDK loader
// Handles switching between npm package and local development

import { feedbacklySourceConfig } from './feedbackly-config';

export interface FeedbacklyInstance {
    init: (config?: any) => void;
    show: () => void;
    hide: () => void;
    toggle: () => void;
    setUser: (user: any) => void;
    track: (event: string, data?: any) => void;
    submitFeedback: (feedbackData: any) => Promise<any>;
    destroy: () => void;
}

class FeedbacklyLoader {
    private instance: FeedbacklyInstance | null = null;
    private isLoading = false;
    private loadPromise: Promise<FeedbacklyInstance> | null = null;

    async loadSDK(): Promise<FeedbacklyInstance> {
        if (this.instance) {
            return this.instance;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.loadSDKInternal();
        return this.loadPromise;
    }

    private async loadSDKInternal(): Promise<FeedbacklyInstance> {
        try {
            this.isLoading = true;

            if (feedbacklySourceConfig.useLocalSDK) {
                console.log('🔧 Loading Feedbackly SDK from local development...');
                return await this.loadLocalSDK();
            } else {
                console.log('📦 Loading Feedbackly SDK from NPM package...');
                return await this.loadNpmSDK();
            }
        } catch (error) {
            console.error('❌ Failed to load Feedbackly SDK:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    private async loadLocalSDK(): Promise<FeedbacklyInstance> {
        // For local development, we'll use the existing local files
        // This assumes the local SDK files are already in the project
        const { default: Feedbackly } = await import('../lib/feedbackly/core/Feedbackly');
        this.instance = new (Feedbackly as any)();
        return this.instance!;
    }

    private async loadNpmSDK(): Promise<FeedbacklyInstance> {
        // Load from npm package
        const Feedbackly = await import('feedbackly-sdk');
        this.instance = new (Feedbackly as any)();
        return this.instance!;
    }

    getInstance(): FeedbacklyInstance | null {
        return this.instance;
    }

    isLoaded(): boolean {
        return this.instance !== null;
    }

    isLoadingSDK(): boolean {
        return this.isLoading;
    }

    destroy(): void {
        if (this.instance) {
            this.instance.destroy();
            this.instance = null;
        }
        this.loadPromise = null;
    }
}

// Export singleton instance
export const feedbacklyLoader = new FeedbacklyLoader();
export default feedbacklyLoader;
