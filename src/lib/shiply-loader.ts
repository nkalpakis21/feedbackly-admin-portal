// Dynamic Shiply SDK loader
// Handles switching between npm package and local development

import { shiplySourceConfig } from './shiply-config';

export interface ShiplyInstance {
    init: (config?: Record<string, unknown>) => void;
    show: () => void;
    hide: () => void;
    toggle: () => void;
    setUser: (user: Record<string, unknown>) => void;
    track: (event: string, data?: Record<string, unknown>) => void;
    submitFeedback: (feedbackData: Record<string, unknown>) => Promise<Record<string, unknown>>;
    destroy: () => void;
}

class ShiplyLoader {
    private instance: ShiplyInstance | null = null;
    private isLoading = false;
    private loadPromise: Promise<ShiplyInstance> | null = null;

    async loadSDK(): Promise<ShiplyInstance> {
        if (this.instance) {
            return this.instance;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.loadSDKInternal();
        return this.loadPromise;
    }

    private async loadSDKInternal(): Promise<ShiplyInstance> {
        try {
            this.isLoading = true;

            if (shiplySourceConfig.useLocalSDK) {
                console.log('🔧 Loading Shiply SDK from local development...');
                return await this.loadLocalSDK();
            } else {
                console.log('📦 Loading Shiply SDK from NPM package...');
                return await this.loadNpmSDK();
            }
        } catch (error) {
            console.error('❌ Failed to load Shiply SDK:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    private async loadLocalSDK(): Promise<ShiplyInstance> {
        // For local development, we'll use the existing local files
        // This assumes the local SDK files are already in the project
        const { default: Shiply } = await import('./shiply/core/Shiply');
        this.instance = new Shiply() as ShiplyInstance;
        return this.instance!;
    }

    private async loadNpmSDK(): Promise<ShiplyInstance> {
        // Load from npm package
        const ShiplyModule = await import('shiply-sdk');
        const Shiply = (ShiplyModule as Record<string, unknown>).Shiply || (ShiplyModule as Record<string, unknown>).default;
        this.instance = new (Shiply as new () => ShiplyInstance)() as ShiplyInstance;
        return this.instance!;
    }

    getInstance(): ShiplyInstance | null {
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
export const shiplyLoader = new ShiplyLoader();
export default shiplyLoader;
