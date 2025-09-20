'use client';

import { useState } from 'react';
import WidgetConfigForm from '@/components/WidgetConfigForm';
import { WidgetConfig } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your Shiply platform settings and widget configuration
                </p>
            </div>

            {/* Section Navigation */}
            <Card style={{ borderLeftColor: '#6366f1', borderLeftWidth: '4px' }}>
                <CardHeader>
                    <div className="flex space-x-8">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeSection === section.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                                }`}
                            >
                                <span className="mr-2">{section.icon}</span>
                                {section.name}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    {activeSection === 'general' && <GeneralSettings />}
                    {activeSection === 'widget' && <WidgetSettings />}
                    {activeSection === 'api' && <ApiSettings />}
                    {activeSection === 'billing' && <BillingSettings />}
                </CardContent>
            </Card>
        </div>
    );
}

function GeneralSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                        id="platform-name"
                        placeholder="Shiply"
                        className="max-w-md"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@example.com"
                        className="max-w-md"
                    />
                </div>
                
                <div className="space-y-4">
                    <Label>Email Notifications</Label>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="new-users" />
                            <Label htmlFor="new-users" className="text-sm font-normal">
                                New user registrations
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="new-feedback" />
                            <Label htmlFor="new-feedback" className="text-sm font-normal">
                                New feedback submissions
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="weekly-reports" />
                            <Label htmlFor="weekly-reports" className="text-sm font-normal">
                                Weekly analytics reports
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-4">
                <Button>Save Settings</Button>
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
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Widget Configuration</h3>
                <p className="text-sm text-muted-foreground">
                    Customize how your feedback widget appears and behaves on your website.
                </p>
            </div>
            
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
            <div>
                <h3 className="text-lg font-semibold mb-4">API Keys & Integration</h3>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Website API Key</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            value="sk_live_1234567890abcdef"
                            readOnly
                            className="flex-1"
                        />
                        <Button variant="outline" size="sm">Copy</Button>
                        <Button variant="destructive" size="sm">Regenerate</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Use this API key in your website&apos;s Shiply widget integration
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>Integration Code</Label>
                    <div className="bg-muted p-4 rounded-md text-sm font-mono">
                        <div className="text-green-400">{/* Add this to your website&apos;s &lt;head&gt; section */}</div>
                        <div className="text-blue-400">&lt;script</div>
                        <div className="ml-4 text-yellow-300">src=&quot;https://cdn.jsdelivr.net/npm/shiply-sdk@latest/dist/shiply.min.js&quot;</div>
                        <div className="ml-4 text-yellow-300">data-api-key=&quot;sk_live_1234567890abcdef&quot;</div>
                        <div className="ml-4 text-yellow-300">data-website-id=&quot;admin-portal&quot;</div>
                        <div className="text-blue-400">&gt;&lt;/script&gt;</div>
                    </div>
                    <Button variant="outline" size="sm">Copy Integration Code</Button>
                </div>

                <div className="space-y-4">
                    <h4 className="text-md font-semibold">Webhook URLs</h4>
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="feedback-webhook">New Feedback Webhook</Label>
                            <Input
                                id="feedback-webhook"
                                type="url"
                                placeholder="https://your-site.com/webhooks/feedback"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user-webhook">New User Webhook</Label>
                            <Input
                                id="user-webhook"
                                type="url"
                                placeholder="https://your-site.com/webhooks/user"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-4">
                <Button>Save API Settings</Button>
            </div>
        </div>
    );
}

function BillingSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Billing & Subscription</h3>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary text-sm font-medium">💳</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-semibold text-primary">Pro Plan</h4>
                            <p className="text-sm text-muted-foreground">$29/month • Next billing: January 15, 2024</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div>
                    <h4 className="text-md font-semibold mb-3">Usage This Month</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">1,247</div>
                                <div className="text-sm text-muted-foreground">Feedback Submissions</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">89</div>
                                <div className="text-sm text-muted-foreground">Active Users</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">2.1GB</div>
                                <div className="text-sm text-muted-foreground">Data Storage</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h4 className="text-md font-semibold mb-3">Plan Limits</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Feedback submissions per month</span>
                            <span className="text-sm font-medium">1,247 / 10,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Active users</span>
                            <span className="text-sm font-medium">89 / 500</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Data storage</span>
                            <span className="text-sm font-medium">2.1GB / 10GB</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex space-x-3">
                <Button>Upgrade Plan</Button>
                <Button variant="outline">View Invoices</Button>
                <Button variant="destructive">Cancel Subscription</Button>
            </div>
        </div>
    );
}