import { UserRepository } from '@/repositories/user/UserRepository';
import {
    UserDocument,
    CreateUserRequest,
    UpdateUserRequest,
    UserProfile
} from '@/types';
import { generateApiKey, getDefaultWidgetConfig } from '@/lib/user-utils';
// Removed unused Timestamp import

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Create a new user document
     */
    async createUser(userData: CreateUserRequest): Promise<UserDocument> {
        try {
            // Validate input data
            this.validateCreateUserRequest(userData);

            // Check if user already exists (only if uid is provided)
            if (userData.uid) {
                const existingUser = await this.userRepository.getByUid(userData.uid);
                if (existingUser) {
                    throw new Error('User already exists');
                }
            }

            // Generate API key and default config for new user
            const apiKey = generateApiKey();
            const sdkConfig = getDefaultWidgetConfig();

            // Create user document
            const userDocument = await this.userRepository.create({
                email: userData.email,
                name: userData.displayName || userData.name,
                website: userData.website,
                isActive: true,
                apiKey,
                sdkConfig,
            });

            return userDocument;
        } catch (error) {
            console.error('Error in UserService.createUser:', error);
            throw error;
        }
    }

    /**
     * Get user by UID
     */
    async getUserByUid(uid: string): Promise<UserDocument | null> {
        try {
            if (!uid) {
                throw new Error('UID is required');
            }

            return await this.userRepository.getByUid(uid);
        } catch (error) {
            console.error('Error in UserService.getUserByUid:', error);
            throw error;
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<UserDocument | null> {
        try {
            if (!id) {
                throw new Error('ID is required');
            }

            return await this.userRepository.getById(id);
        } catch (error) {
            console.error('Error in UserService.getUserById:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateUser(uid: string, updateData: UpdateUserRequest): Promise<void> {
        try {
            if (!uid) {
                throw new Error('UID is required');
            }

            // Validate update data
            this.validateUpdateUserRequest(updateData);

            // Get user document
            const userDoc = await this.userRepository.getByUid(uid);
            if (!userDoc) {
                throw new Error('User not found');
            }

            // Update user document
            await this.userRepository.update(userDoc.id, updateData);
        } catch (error) {
            console.error('Error in UserService.updateUser:', error);
            throw error;
        }
    }

    /**
     * Update user's last login timestamp
     */
    async updateLastLogin(uid: string): Promise<void> {
        try {
            if (!uid) {
                throw new Error('UID is required');
            }

            await this.userRepository.updateLastLogin(uid);
        } catch (error) {
            console.error('Error in UserService.updateLastLogin:', error);
            throw error;
        }
    }

    /**
     * Get all users
     */
    async getAllUsers(): Promise<UserDocument[]> {
        try {
            return await this.userRepository.getAll();
        } catch (error) {
            console.error('Error in UserService.getAllUsers:', error);
            throw error;
        }
    }

    /**
     * Get users by role
     */
    async getUsersByRole(role: 'admin' | 'user'): Promise<UserDocument[]> {
        try {
            if (!role) {
                throw new Error('Role is required');
            }

            return await this.userRepository.getByRole(role);
        } catch (error) {
            console.error('Error in UserService.getUsersByRole:', error);
            throw error;
        }
    }

    /**
     * Get active users
     */
    async getActiveUsers(): Promise<UserDocument[]> {
        try {
            return await this.userRepository.getActiveUsers();
        } catch (error) {
            console.error('Error in UserService.getActiveUsers:', error);
            throw error;
        }
    }

    /**
     * Deactivate user
     */
    async deactivateUser(uid: string): Promise<void> {
        try {
            if (!uid) {
                throw new Error('UID is required');
            }

            await this.updateUser(uid, { isActive: false });
        } catch (error) {
            console.error('Error in UserService.deactivateUser:', error);
            throw error;
        }
    }

    /**
     * Activate user
     */
    async activateUser(uid: string): Promise<void> {
        try {
            if (!uid) {
                throw new Error('UID is required');
            }

            await this.updateUser(uid, { isActive: true });
        } catch (error) {
            console.error('Error in UserService.activateUser:', error);
            throw error;
        }
    }

    /**
     * Check if user exists
     */
    async userExists(uid: string): Promise<boolean> {
        try {
            if (!uid) {
                throw new Error('UID is required');
            }

            return await this.userRepository.existsByUid(uid);
        } catch (error) {
            console.error('Error in UserService.userExists:', error);
            throw error;
        }
    }

    /**
     * Create or update user document (for authentication flow)
     */
    async createOrUpdateUser(userData: CreateUserRequest): Promise<UserDocument> {
        try {
            if (!userData.uid) {
                // If no uid, just create a new user
                return await this.createUser(userData);
            }

            const existingUser = await this.userRepository.getByUid(userData.uid);

            if (existingUser) {
                // Update last login
                await this.updateLastLogin(userData.uid);
                return existingUser;
            } else {
                // Create new user
                return await this.createUser(userData);
            }
        } catch (error) {
            console.error('Error in UserService.createOrUpdateUser:', error);
            throw error;
        }
    }

    /**
     * Convert UserDocument to UserProfile
     */
    formatUserProfile(userDoc: UserDocument): UserProfile {
        return {
            id: userDoc.id,
            email: userDoc.email,
            name: userDoc.name,
            website: userDoc.website,
            createdAt: userDoc.createdAt.toDate(),
            lastLogin: userDoc.lastLogin?.toDate(),
            isActive: userDoc.isActive,
            apiKey: userDoc.apiKey,
            sdkConfig: userDoc.sdkConfig,
        };
    }

    /**
     * Validate create user request
     */
    private validateCreateUserRequest(userData: CreateUserRequest): void {
        if (!userData.uid) {
            throw new Error('UID is required');
        }
        if (!userData.email) {
            throw new Error('Email is required');
        }
        if (!userData.provider) {
            throw new Error('Provider is required');
        }
        if (!['email', 'google.com'].includes(userData.provider)) {
            throw new Error('Invalid provider');
        }
    }

    /**
     * Validate update user request
     */
    private validateUpdateUserRequest(updateData: UpdateUserRequest): void {
        if (updateData.role && !['admin', 'user'].includes(updateData.role)) {
            throw new Error('Invalid role');
        }
    }
}
