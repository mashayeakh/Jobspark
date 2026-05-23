'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await apiClient.healthCheck();

      if (response.success) {
        setResult(`✅ Connection successful! Backend response: ${JSON.stringify(response.data, null, 2)}`);
      } else {
        setResult(`❌ Connection failed: ${response.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="p-6 max-w-2xl mx-auto">
    //   <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>

    //   <button
    //     onClick={testConnection}
    //     disabled={loading}
    //     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
    //   >
    //     {loading ? 'Testing...' : 'Test Backend Connection'}
    //   </button>

    //   {result && (
    //     <div className="mt-4 p-4 bg-gray-100 rounded">
    //       <pre className="whitespace-pre-wrap text-sm">{result}</pre>
    //     </div>
    //   )}
    // </div>
    <></>
  );
}
