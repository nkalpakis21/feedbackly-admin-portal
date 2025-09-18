'use client';

import { useState } from 'react';
import WidgetConfigForm from '@/components/WidgetConfigForm';
import { WidgetConfig } from '@/types';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');

    const sections = [
        { id: 'general', name: 'General Settings', icon: '⚙️' },
        { id: 'widget', name: 'Widget Configuration', icon: '🔧' },
        { id: 'api', name: 'API Keys', icon: '🔑' },
        { id: 'billing', name: 'Billing', icon: '💳' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your Shiply platform settings and widget configuration
                </p>
            </div>

            {/* Section Navigation */}
            <div className="bg-white shadow rounded-lg">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeSection === section.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2">{section.icon}</span>
                                {section.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeSection === 'general' && <GeneralSettings />}
                    {activeSection === 'widget' && <WidgetSettings />}
                    {activeSection === 'api' && <ApiSettings />}
                    {activeSection === 'billing' && <BillingSettings />}
                </div>
            </div>
        </div>
    );
}

function GeneralSettings() {
    return (
        <div className="space-y-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                General Settings
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="platform-name" className="block text-sm font-medium text-gray-700">
                        Platform Name
                    </label>
                    <input
                        type="text"
                        id="platform-name"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Shiply"
                    />
                </div>
                
                <div>
                    <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
                        Admin Email
                    </label>
                    <input
                        type="email"
                        id="admin-email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="admin@example.com"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email Notifications
                    </label>
                    <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                New user registrations
                            </span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                New feedback submissions
                            </span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Weekly analytics reports
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Save Settings
                </button>
            </div>
        </div>
    );
}

function WidgetSettings() {
    const handleConfigChange = (config: WidgetConfig) => {
        // Handle configuration changes
        console.log('Config updated:', config);
    };

    return (
        <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Widget Configuration
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Customize how your feedback widget appears and behaves on your website.
            </p>
            
            <WidgetConfigForm 
                websiteId="admin-portal" 
                onConfigChange={handleConfigChange}
            />
        </div>
    );
}

function ApiSettings() {
    return (
        <div className="space-y-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                API Keys & Integration
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website API Key
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value="sk_live_1234567890abcdef"
                            readOnly
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                        />
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm">
                            Copy
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm">
                            Regenerate
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Use this API key in your website's Shiply widget integration
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Integration Code
                    </label>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono">
                        <div className="text-green-400">{/* Add this to your website&apos;s &lt;head&gt; section */}</div>
                        <div className="text-blue-400">&lt;script</div>
                        <div className="ml-4 text-yellow-300">src=&quot;https://cdn.jsdelivr.net/npm/shiply-sdk@latest/dist/shiply.min.js&quot;</div>
                        <div className="ml-4 text-yellow-300">data-api-key=&quot;sk_live_1234567890abcdef&quot;</div>
                        <div className="ml-4 text-yellow-300">data-website-id=&quot;admin-portal&quot;</div>
                        <div className="text-blue-400">&gt;&lt;/script&gt;</div>
                    </div>
                    <button className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm">
                        Copy Integration Code
                    </button>
                </div>

                <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Webhook URLs</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Feedback Webhook
                            </label>
                            <input
                                type="url"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="https://your-site.com/webhooks/feedback"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New User Webhook
                            </label>
                            <input
                                type="url"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="https://your-site.com/webhooks/user"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Save API Settings
                </button>
            </div>
        </div>
    );
}

function BillingSettings() {
    return (
        <div className="space-y-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Billing & Subscription
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">💳</span>
                        </div>
                    </div>
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-900">Pro Plan</h4>
                        <p className="text-sm text-blue-700">$29/month • Next billing: January 15, 2024</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Usage This Month</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">1,247</div>
                            <div className="text-sm text-gray-500">Feedback Submissions</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">89</div>
                            <div className="text-sm text-gray-500">Active Users</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">2.1GB</div>
                            <div className="text-sm text-gray-500">Data Storage</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Plan Limits</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Feedback submissions per month</span>
                            <span className="text-sm font-medium">1,247 / 10,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Active users</span>
                            <span className="text-sm font-medium">89 / 500</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Data storage</span>
                            <span className="text-sm font-medium">2.1GB / 10GB</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Upgrade Plan
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    View Invoices
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Cancel Subscription
                </button>
            </div>
        </div>
    );
}