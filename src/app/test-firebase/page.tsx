'use client';

import { useState } from 'react';
import { createSampleWebsite, testFirebaseConnection, getAllWebsites } from '@/lib/firebase-utils';

export default function TestFirebasePage() {
  const [websiteId, setWebsiteId] = useState('test-website-1');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setResult('Testing Firebase connection...');
    
    const response = await testFirebaseConnection();
    setResult(response.success ? '✅ Firebase connection successful!' : `❌ Error: ${response.error}`);
    setLoading(false);
  };

  const handleCreateSampleWebsite = async () => {
    if (!websiteId.trim()) {
      setResult('❌ Please enter a website ID');
      return;
    }

    setLoading(true);
    setResult('Creating sample website...');
    
    const response = await createSampleWebsite(websiteId);
    setResult(response.success ? `✅ Sample website created: ${websiteId}` : `❌ Error: ${response.error}`);
    setLoading(false);
  };

  const handleGetAllWebsites = async () => {
    setLoading(true);
    setResult('Fetching all websites...');
    
    const response = await getAllWebsites();
    if (response.success && response.websites) {
      setResult(`✅ Found ${response.websites.length} websites: ${response.websites.map(w => w.id).join(', ')}`);
    } else {
      setResult(`❌ Error: ${response.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Firebase Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={handleTestConnection}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Test Firebase Connection
            </button>
          </div>

          <div>
            <label htmlFor="websiteId" className="block text-sm font-medium text-gray-700 mb-2">
              Website ID
            </label>
            <input
              id="websiteId"
              type="text"
              value={websiteId}
              onChange={(e) => setWebsiteId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter website ID"
            />
          </div>

          <div>
            <button
              onClick={handleCreateSampleWebsite}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Create Sample Website
            </button>
          </div>

          <div>
            <button
              onClick={handleGetAllWebsites}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Get All Websites
            </button>
          </div>

          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Make sure your Firebase environment variables are set in <code>.env.local</code></li>
            <li>Test the Firebase connection first</li>
            <li>Create a sample website configuration</li>
            <li>Verify the website was created in Firestore</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
