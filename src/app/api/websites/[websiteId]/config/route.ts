import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

// Handle CORS preflight requests
export async function OPTIONS() {
    return handleCorsPreflight();
}

// GET website configuration
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ websiteId: string }> }
) {
    try {
        const { websiteId } = await params;
        const origin = request.headers.get('origin');

        if (!websiteId) {
            const response = NextResponse.json(
                { error: 'Website ID is required' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        const websiteDoc = await getDoc(doc(db, 'websites', websiteId));

        if (!websiteDoc.exists()) {
            const response = NextResponse.json(
                { error: 'Website not found' },
                { status: 404 }
            );
            return addCorsHeaders(response, origin);
        }

        const websiteData = websiteDoc.data();
        const response = NextResponse.json(websiteData);
        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error getting website config:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}

// PUT update website configuration
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ websiteId: string }> }
) {
    try {
        const { websiteId } = await params;
        const origin = request.headers.get('origin');
        const body = await request.json();

        if (!websiteId) {
            const response = NextResponse.json(
                { error: 'Website ID is required' },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Validate and sanitize the configuration
        const validatedConfig = validateWidgetConfig(body.widgetConfig);
        
        if (!validatedConfig.valid) {
            const response = NextResponse.json(
                { error: 'Invalid configuration', details: validatedConfig.errors },
                { status: 400 }
            );
            return addCorsHeaders(response, origin);
        }

        // Update the website configuration
        await updateDoc(doc(db, 'websites', websiteId), {
            widgetConfig: validatedConfig.config,
            updatedAt: new Date(),
        });

        const response = NextResponse.json({
            success: true,
            message: 'Configuration updated successfully'
        });
        return addCorsHeaders(response, origin);

    } catch (error) {
        console.error('Error updating website config:', error);
        const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        return addCorsHeaders(response, request.headers.get('origin'));
    }
}

// Validation function
function validateWidgetConfig(config: any) {
    const errors: string[] = [];
    
    // Validate theme colors (hex format)
    if (config.theme?.primaryColor && !/^#[0-9A-F]{6}$/i.test(config.theme.primaryColor)) {
        errors.push('Primary color must be a valid hex color');
    }
    
    if (config.theme?.backgroundColor && !/^#[0-9A-F]{6}$/i.test(config.theme.backgroundColor)) {
        errors.push('Background color must be a valid hex color');
    }
    
    if (config.theme?.textColor && !/^#[0-9A-F]{6}$/i.test(config.theme.textColor)) {
        errors.push('Text color must be a valid hex color');
    }
    
    if (config.theme?.borderColor && !/^#[0-9A-F]{6}$/i.test(config.theme.borderColor)) {
        errors.push('Border color must be a valid hex color');
    }
    
    // Validate position values
    if (config.position?.bottom && !config.position.bottom.endsWith('px')) {
        errors.push('Position bottom must be in pixels (e.g., "20px")');
    }
    
    if (config.position?.right && !config.position.right.endsWith('px')) {
        errors.push('Position right must be in pixels (e.g., "20px")');
    }
    
    // Validate size values
    if (config.size?.width && !config.size.width.endsWith('px')) {
        errors.push('Width must be in pixels (e.g., "350px")');
    }
    
    if (config.size?.height && !config.size.height.endsWith('px')) {
        errors.push('Height must be in pixels (e.g., "500px")');
    }
    
    // Validate text content (prevent XSS)
    const textFields = ['title', 'ratingLabel', 'feedbackLabel', 'feedbackPlaceholder', 'categoryLabel', 'submitButton', 'cancelButton'];
    textFields.forEach(field => {
        if (config.text?.[field] && /<script|javascript:|on\w+=/i.test(config.text[field])) {
            errors.push(`${field} contains potentially unsafe content`);
        }
    });
    
    // Validate categories
    if (config.behavior?.categories) {
        config.behavior.categories.forEach((category: any, index: number) => {
            if (!category.value || !category.label) {
                errors.push(`Category ${index + 1} must have both value and label`);
            }
            if (category.value && !/^[a-z0-9-_]+$/i.test(category.value)) {
                errors.push(`Category ${index + 1} value must contain only letters, numbers, hyphens, and underscores`);
            }
        });
    }
    
    // Validate auto-show delay
    if (config.behavior?.autoShowDelay && (config.behavior.autoShowDelay < 0 || config.behavior.autoShowDelay > 60000)) {
        errors.push('Auto-show delay must be between 0 and 60000 milliseconds');
    }
    
    // Validate font size
    if (config.theme?.fontSize && !config.theme.fontSize.endsWith('px')) {
        errors.push('Font size must be in pixels (e.g., "14px")');
    }
    
    // Validate border radius
    if (config.theme?.borderRadius && !config.theme.borderRadius.endsWith('px')) {
        errors.push('Border radius must be in pixels (e.g., "8px")');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        config
    };
}
