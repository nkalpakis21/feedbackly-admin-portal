'use client';

import { useState } from 'react';
import { WidgetConfig, WidgetTheme, WidgetText, WidgetBehavior, WidgetPosition, WidgetSize, WidgetBranding } from '@/types';

interface WidgetConfigFormProps {
    websiteId: string;
    initialConfig?: WidgetConfig;
    onConfigChange: (config: WidgetConfig) => void;
}

export default function WidgetConfigForm({ websiteId, initialConfig, onConfigChange }: WidgetConfigFormProps) {
    const [activeTab, setActiveTab] = useState('appearance');
    const [config, setConfig] = useState<WidgetConfig>(initialConfig || getDefaultConfig());

    const tabs = [
        { id: 'appearance', name: 'Appearance', icon: '🎨' },
        { id: 'content', name: 'Content', icon: '📝' },
        { id: 'behavior', name: 'Behavior', icon: '⚙️' },
        { id: 'branding', name: 'Branding', icon: '🏢' },
    ];

    const updateConfig = (
        section: keyof WidgetConfig,
        updates: Partial<WidgetConfig[keyof WidgetConfig]>
    ) => {
        const newConfig = {
            ...config,
            [section]: { ...config[section], ...updates }
        };
        setConfig(newConfig);
        onConfigChange(newConfig);
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Forms */}
                <div className="space-y-6">
                    {activeTab === 'appearance' && (
                        <AppearanceSettings 
                            theme={config.theme}
                            position={config.position}
                            size={config.size}
                            onThemeChange={(theme) => updateConfig('theme', theme)}
                            onPositionChange={(position) => updateConfig('position', position)}
                            onSizeChange={(size) => updateConfig('size', size)}
                        />
                    )}

                    {activeTab === 'content' && (
                        <ContentSettings 
                            text={config.text}
                            onTextChange={(text) => updateConfig('text', text)}
                        />
                    )}

                    {activeTab === 'behavior' && (
                        <BehaviorSettings 
                            behavior={config.behavior}
                            onBehaviorChange={(behavior) => updateConfig('behavior', behavior)}
                        />
                    )}

                    {activeTab === 'branding' && (
                        <BrandingSettings 
                            branding={config.branding}
                            onBrandingChange={(branding) => updateConfig('branding', branding)}
                        />
                    )}
                </div>

                {/* Live Preview */}
                <div className="lg:sticky lg:top-6">
                    <WidgetPreview config={config} />
                </div>
            </div>

            {/* Save/Reset Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button 
                    onClick={() => setConfig(getDefaultConfig())}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                    Reset to Default
                </button>
                
                <div className="space-x-3">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium">
                        Preview on Site
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}

// Appearance Settings Component
function AppearanceSettings({ 
    theme, 
    position, 
    size, 
    onThemeChange, 
    onPositionChange, 
    onSizeChange 
}: {
    theme: WidgetTheme;
    position: WidgetPosition;
    size: WidgetSize;
    onThemeChange: (theme: Partial<WidgetTheme>) => void;
    onPositionChange: (position: Partial<WidgetPosition>) => void;
    onSizeChange: (size: Partial<WidgetSize>) => void;
}) {
    return (
        <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Theme Colors</h4>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            value={theme.primaryColor}
                            onChange={(e) => onThemeChange({ primaryColor: e.target.value })}
                            className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                            type="text"
                            value={theme.primaryColor}
                            onChange={(e) => onThemeChange({ primaryColor: e.target.value })}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            value={theme.backgroundColor}
                            onChange={(e) => onThemeChange({ backgroundColor: e.target.value })}
                            className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                            type="text"
                            value={theme.backgroundColor}
                            onChange={(e) => onThemeChange({ backgroundColor: e.target.value })}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            value={theme.textColor}
                            onChange={(e) => onThemeChange({ textColor: e.target.value })}
                            className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                            type="text"
                            value={theme.textColor}
                            onChange={(e) => onThemeChange({ textColor: e.target.value })}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Border Color
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            value={theme.borderColor}
                            onChange={(e) => onThemeChange({ borderColor: e.target.value })}
                            className="w-8 h-8 rounded border border-gray-300"
                        />
                        <input
                            type="text"
                            value={theme.borderColor}
                            onChange={(e) => onThemeChange({ borderColor: e.target.value })}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Radius
                </label>
                <input
                    type="text"
                    value={theme.borderRadius}
                    onChange={(e) => onThemeChange({ borderRadius: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="8px"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Family
                </label>
                <select
                    value={theme.fontFamily}
                    onChange={(e) => onThemeChange({ fontFamily: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                    <option value="system-ui, -apple-system, sans-serif">System Default</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="Courier New, monospace">Courier New</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                </label>
                <input
                    type="text"
                    value={theme.fontSize}
                    onChange={(e) => onThemeChange({ fontSize: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="14px"
                />
            </div>

            <h4 className="text-lg font-medium text-gray-900 mt-8">Position & Size</h4>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bottom Position
                    </label>
                    <input
                        type="text"
                        value={position.bottom}
                        onChange={(e) => onPositionChange({ bottom: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="20px"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Right Position
                    </label>
                    <input
                        type="text"
                        value={position.right}
                        onChange={(e) => onPositionChange({ right: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="20px"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width
                    </label>
                    <input
                        type="text"
                        value={size.width}
                        onChange={(e) => onSizeChange({ width: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="350px"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height
                    </label>
                    <input
                        type="text"
                        value={size.height}
                        onChange={(e) => onSizeChange({ height: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="500px"
                    />
                </div>
            </div>
        </div>
    );
}

// Content Settings Component
function ContentSettings({ text, onTextChange }: { text: WidgetText; onTextChange: (text: Partial<WidgetText>) => void }) {
    return (
        <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Text Content</h4>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Widget Title
                </label>
                <input
                    type="text"
                    value={text.title}
                    onChange={(e) => onTextChange({ title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Share Your Feedback"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating Label
                </label>
                <input
                    type="text"
                    value={text.ratingLabel}
                    onChange={(e) => onTextChange({ ratingLabel: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="How would you rate your experience?"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback Label
                </label>
                <input
                    type="text"
                    value={text.feedbackLabel}
                    onChange={(e) => onTextChange({ feedbackLabel: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Tell us more (optional)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback Placeholder
                </label>
                <textarea
                    value={text.feedbackPlaceholder}
                    onChange={(e) => onTextChange({ feedbackPlaceholder: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Share your thoughts, suggestions, or report any issues..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Label
                </label>
                <input
                    type="text"
                    value={text.categoryLabel}
                    onChange={(e) => onTextChange({ categoryLabel: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Category"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Submit Button
                    </label>
                    <input
                        type="text"
                        value={text.submitButton}
                        onChange={(e) => onTextChange({ submitButton: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Submit"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cancel Button
                    </label>
                    <input
                        type="text"
                        value={text.cancelButton}
                        onChange={(e) => onTextChange({ cancelButton: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Cancel"
                    />
                </div>
            </div>
        </div>
    );
}

// Behavior Settings Component
function BehaviorSettings({ behavior, onBehaviorChange }: { behavior: WidgetBehavior; onBehaviorChange: (behavior: Partial<WidgetBehavior>) => void }) {
    const [newCategory, setNewCategory] = useState({ value: '', label: '' });

    const addCategory = () => {
        if (newCategory.value && newCategory.label) {
            onBehaviorChange({
                categories: [...behavior.categories, newCategory]
            });
            setNewCategory({ value: '', label: '' });
        }
    };

    const removeCategory = (index: number) => {
        onBehaviorChange({
            categories: behavior.categories.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Widget Behavior</h4>
            
            <div className="space-y-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={behavior.autoShow}
                        onChange={(e) => onBehaviorChange({ autoShow: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        Auto-show widget after page load
                    </span>
                </label>

                {behavior.autoShow && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Auto-show Delay (milliseconds)
                        </label>
                        <input
                            type="number"
                            value={behavior.autoShowDelay}
                            onChange={(e) => onBehaviorChange({ autoShowDelay: parseInt(e.target.value) })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            min="0"
                        />
                    </div>
                )}

                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={behavior.showOnExit}
                        onChange={(e) => onBehaviorChange({ showOnExit: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        Show widget when user tries to leave page
                    </span>
                </label>
            </div>

            <div>
                <h5 className="text-md font-medium text-gray-900 mb-3">Feedback Categories</h5>
                
                <div className="space-y-2 mb-4">
                    {behavior.categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">
                                <strong>{category.label}</strong> ({category.value})
                            </span>
                            <button
                                onClick={() => removeCategory(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        value={newCategory.value}
                        onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Category value (e.g., bug)"
                    />
                    <input
                        type="text"
                        value={newCategory.label}
                        onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Category label (e.g., Bug Report)"
                    />
                </div>
                
                <button
                    onClick={addCategory}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                    Add Category
                </button>
            </div>
        </div>
    );
}

// Branding Settings Component
function BrandingSettings({ branding, onBrandingChange }: { branding: WidgetBranding; onBrandingChange: (branding: Partial<WidgetBranding>) => void }) {
    return (
        <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Branding</h4>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                </label>
                <input
                    type="text"
                    value={branding.companyName || ''}
                    onChange={(e) => onBrandingChange({ companyName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Your Company Name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                </label>
                <input
                    type="url"
                    value={branding.logo || ''}
                    onChange={(e) => onBrandingChange({ logo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="https://example.com/logo.png"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Optional: URL to your company logo (will be displayed in the widget)
                </p>
            </div>
        </div>
    );
}

// Widget Preview Component
function WidgetPreview({ config }: { config: WidgetConfig }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h4>
            
            <div className="relative bg-gray-100 rounded-lg p-4 min-h-[400px]">
                <div 
                    className="absolute bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4"
                    style={{
                        width: config.size.width,
                        height: config.size.height,
                        backgroundColor: config.theme.backgroundColor,
                        borderColor: config.theme.borderColor,
                        borderRadius: config.theme.borderRadius,
                        fontFamily: config.theme.fontFamily,
                        fontSize: config.theme.fontSize,
                        color: config.theme.textColor,
                    }}
                >
                    <div 
                        className="text-center mb-4 pb-2 border-b"
                        style={{ 
                            backgroundColor: config.theme.headerBackgroundColor,
                            color: config.theme.textColor 
                        }}
                    >
                        <h3 className="font-medium">{config.text.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {config.text.ratingLabel}
                            </label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className="text-2xl"
                                        style={{ color: config.theme.primaryColor }}
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {config.text.feedbackLabel}
                            </label>
                            <textarea
                                className="w-full border rounded px-2 py-1 text-sm"
                                style={{ 
                                    borderColor: config.theme.borderColor,
                                    borderRadius: config.theme.borderRadius 
                                }}
                                rows={3}
                                placeholder={config.text.feedbackPlaceholder}
                            />
                        </div>
                        
                        {config.behavior.categories.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {config.text.categoryLabel}
                                </label>
                                <select 
                                    className="w-full border rounded px-2 py-1 text-sm"
                                    style={{ 
                                        borderColor: config.theme.borderColor,
                                        borderRadius: config.theme.borderRadius 
                                    }}
                                >
                                    {config.behavior.categories.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        <div className="flex space-x-2 pt-2">
                            <button
                                className="flex-1 py-2 px-3 rounded text-sm font-medium text-white"
                                style={{ backgroundColor: config.theme.primaryColor }}
                            >
                                {config.text.submitButton}
                            </button>
                            <button
                                className="flex-1 py-2 px-3 rounded text-sm font-medium border"
                                style={{ 
                                    borderColor: config.theme.borderColor,
                                    color: config.theme.textColor 
                                }}
                            >
                                {config.text.cancelButton}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function for default configuration
function getDefaultConfig(): WidgetConfig {
    return {
        theme: {
            primaryColor: '#007bff',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            borderColor: '#e1e5e9',
            borderRadius: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            headerBackgroundColor: '#f8f9fa',
            footerBackgroundColor: '#f8f9fa',
        },
        position: {
            bottom: '20px',
            right: '20px',
        },
        size: {
            width: '350px',
            height: '500px',
        },
        text: {
            title: 'Share Your Feedback',
            ratingLabel: 'How would you rate your experience?',
            feedbackLabel: 'Tell us more (optional)',
            feedbackPlaceholder: 'Share your thoughts, suggestions, or report any issues...',
            categoryLabel: 'Category',
            submitButton: 'Submit',
            cancelButton: 'Cancel',
        },
        behavior: {
            autoShow: false,
            autoShowDelay: 5000,
            showOnExit: false,
            categories: [],
        },
        branding: {
            companyName: '',
        },
    };
}
