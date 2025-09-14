import { UserRepository } from '@/repositories/user/UserRepository';
import { UserService } from './user/UserService';
import { AuthService } from './auth/AuthService';

/**
 * Service Container for dependency injection
 * Implements Singleton pattern to ensure single instance across the app
 */
export class ServiceContainer {
    private static instance: ServiceContainer;

    private userRepository: UserRepository;
    private userService: UserService;
    private authService: AuthService;

    private constructor() {
        // Initialize repositories
        this.userRepository = new UserRepository();

        // Initialize services with dependencies
        this.userService = new UserService(this.userRepository);
        this.authService = new AuthService(this.userService);
    }

    /**
     * Get the singleton instance of ServiceContainer
     */
    static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
            ServiceContainer.instance = new ServiceContainer();
        }
        return ServiceContainer.instance;
    }

    /**
     * Get UserService instance
     */
    getUserService(): UserService {
        return this.userService;
    }

    /**
     * Get AuthService instance
     */
    getAuthService(): AuthService {
        return this.authService;
    }

    /**
     * Get UserRepository instance (for direct access if needed)
     */
    getUserRepository(): UserRepository {
        return this.userRepository;
    }

    /**
     * Reset the container (useful for testing)
     */
    static reset(): void {
        ServiceContainer.instance = new ServiceContainer();
    }
}
