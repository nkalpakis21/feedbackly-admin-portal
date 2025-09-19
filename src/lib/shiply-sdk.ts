// Shiply SDK wrapper - NPM package integration

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

class ShiplySDK {
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
            console.log('📦 Loading Shiply SDK from NPM package...');
            
            // Load from npm package
            const ShiplyModule = await import('shiply-sdk');
            const Shiply = (ShiplyModule as Record<string, unknown>).Shiply || (ShiplyModule as Record<string, unknown>).default;
            this.instance = new (Shiply as new () => ShiplyInstance)() as ShiplyInstance;
            return this.instance!;
        } catch (error) {
            console.error('❌ Failed to load Shiply SDK:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
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
export const shiplySDK = new ShiplySDK();
export default shiplySDK;