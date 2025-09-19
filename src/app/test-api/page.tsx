'use client';

import { useState } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFeedbackApi = async () => {
    setLoading(true);
    setResult('Testing feedback API...');
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: 'admin-portal',
          apiKey: 'your-api-key-here',
          rating: 5,
          feedback: 'This is a test feedback from the API test page',
          category: 'general',
          userInfo: {
            email: 'test@example.com',
            name: 'Test User'
          }
        }),
      });

      const data = await response.json();
      setResult(`✅ Feedback API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`❌ Feedback API Error: ${error}`);
    }
    setLoading(false);
  };

  const testEventsApi = async () => {
    setLoading(true);
    setResult('Testing events API...');
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: 'admin-portal',
          apiKey: 'your-api-key-here',
          eventName: 'test_event',
          eventData: {
            page: 'test-api',
            action: 'button_click'
          },
          userInfo: {
            email: 'test@example.com',
            name: 'Test User'
          }
        }),
      });

      const data = await response.json();
      setResult(`✅ Events API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`❌ Events API Error: ${error}`);
    }
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">API Routes Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={testFeedbackApi}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Test Feedback API
            </button>
          </div>

          <div>
            <button
              onClick={testEventsApi}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Test Events API
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
            <li>Make sure your development server is running</li>
            <li>Test each API endpoint to verify they&apos;re working</li>
            <li>Check the browser console for any errors</li>
            <li>Verify data is being saved to Firestore</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
