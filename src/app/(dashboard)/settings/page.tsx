'use client';

import { useState, useEffect } from 'react';
import WidgetConfigForm from '@/components/WidgetConfigForm';
import { WidgetConfig } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getUser, updateUser } from '@/lib/firestore';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');

    const sections = [
        { id: 'general', name: 'General Settings', icon: '⚙️' },
        // { id: 'widget', name: 'Widget Configuration', icon: '🔧' },
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
    const { currentUser } = useAuth();
    const [platformName, setPlatformName] = useState('');
    const [communicationEmail, setCommunicationEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Load current user data
    useEffect(() => {
        const loadUserData = async () => {
            if (!currentUser) return;
            
            try {
                const userDoc = await getUser(currentUser.uid);
                if (userDoc) {
                    setPlatformName(userDoc.platformName || '');
                    setCommunicationEmail(userDoc.communicationEmail || '');
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, [currentUser]);

    const handleSaveSettings = async () => {
        if (!currentUser) return;

        setLoading(true);
        setMessage(null);

        try {
            // Update user document with new settings
            await updateUser(currentUser.uid, {
                platformName: platformName.trim() || undefined,
                communicationEmail: communicationEmail.trim() || undefined,
            });

            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

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
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        className="max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">
                        The name of your platform or company
                    </p>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="communication-email">Communication Email</Label>
                    <Input
                        id="communication-email"
                        type="email"
                        placeholder="admin@example.com"
                        value={communicationEmail}
                        onChange={(e) => setCommunicationEmail(e.target.value)}
                        className="max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">
                        Email address for communications and notifications
                    </p>
                </div>

                {message && (
                    <div className={`p-3 rounded-md text-sm ${
                        message.type === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {message.text}
                    </div>
                )}
            </div>
            
            <div className="pt-4">
                <Button 
                    onClick={handleSaveSettings}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </Button>
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
                        {/* <Button variant="destructive" size="sm">Regenerate</Button> */}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Use this API key in your website&apos;s Shiply widget integration
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>Integration Code</Label>
                    <div className="bg-muted p-4 rounded-md text-sm font-mono">
                        <div className="text-green-400">{'// Install the package'}</div>
                        <div className="text-yellow-300">npm install shiply-sdk@1.5.2</div>
                        <div className="mt-4 text-green-400">{'// Initialize SDK at app level (Recommended)'}</div>
                        <div className="text-blue-400">import &#123; init &#125; from &apos;shiply-sdk&apos;;</div>
                        <div className="mt-2 text-blue-400">init(&#123;</div>
                        <div className="ml-4 text-yellow-300">apiKey: &quot;sk_live_1234567890abcdef&quot;,</div>
                        <div className="ml-4 text-blue-400">websiteId: &quot;your-website&quot;,</div>
                        <div className="ml-4 text-blue-400">autoShow: true</div>
                        <div className="text-blue-400">&#125;);</div>
                        <div className="mt-4 text-green-400">{'// Use global functions to control widget'}</div>
                        <div className="text-blue-400">import &#123; show, hide, toggle &#125; from &apos;shiply-sdk&apos;;</div>
                        <div className="mt-2 text-blue-400">{'// show(); // Show the widget'}</div>
                        <div className="text-blue-400">{'// hide(); // Hide the widget'}</div>
                        <div className="text-blue-400">{'// toggle(); // Toggle the widget'}</div>
                    </div>
                    <Button variant="outline" size="sm">Copy Integration Code</Button>
                </div>

                <div className="space-y-4">
                    <h4 className="text-md font-semibold">Alternative: Provider Pattern</h4>
                    <div className="bg-muted p-4 rounded-md text-sm font-mono">
                        <div className="text-green-400">{'// For more control over configuration'}</div>
                        <div className="text-blue-400">import &#123; ShiplyProvider, ShiplyFeedback &#125; from &apos;shiply-sdk&apos;;</div>
                        <div className="mt-2 text-blue-400">function App() &#123;</div>
                        <div className="ml-4 text-blue-400">return (</div>
                        <div className="ml-8 text-blue-400">&lt;ShiplyProvider</div>
                        <div className="ml-12 text-yellow-300">apiKey=&quot;sk_live_1234567890abcdef&quot;</div>
                        <div className="ml-12 text-blue-400">websiteId=&quot;your-website&quot;</div>
                        <div className="ml-12 text-blue-400">autoShow=&#123;true&#125;</div>
                        <div className="ml-8 text-blue-400">&gt;</div>
                        <div className="ml-12 text-blue-400">&lt;ShiplyFeedback /&gt;</div>
                        <div className="ml-8 text-blue-400">&lt;/ShiplyProvider&gt;</div>
                        <div className="ml-4 text-blue-400">);</div>
                        <div className="text-blue-400">&#125;</div>
                    </div>
                </div>
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