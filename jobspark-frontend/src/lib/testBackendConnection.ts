// Test script to check backend connection and available endpoints
export const testBackendConnection = async () => {
  console.log('🔍 Testing backend connection...');
  
  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    '/api/v2/jobs',
    '/api/v2/admin/content-sanity/stats',
    '/api/v2/admin/content-sanity/jobs',
    '/jobs',
    '/health'
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${baseUrl}${endpoint}`);
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.text();
      
      results.push({
        endpoint,
        status: response.status,
        ok: response.ok,
        data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
      });
      
      console.log(`✅ ${endpoint}: ${response.status} ${response.ok ? 'OK' : 'FAILED'}`);
      
      if (response.ok && endpoint.includes('jobs')) {
        try {
          const jsonData = JSON.parse(data);
          console.log(`📊 Jobs found: ${jsonData.result?.length || jsonData.length || 0}`);
        } catch (e) {
          console.log(`📊 Response is not JSON format`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint}: Connection failed - ${error.message}`);
      results.push({
        endpoint,
        status: 'ERROR',
        ok: false,
        data: error.message
      });
    }
  }
  
  return results;
};

// Test the connection immediately
testBackendConnection().then(results => {
  console.log('\n📋 Backend Connection Test Results:');
  results.forEach(result => {
    console.log(`${result.ok ? '✅' : '❌'} ${result.endpoint}: ${result.status}`);
  });
});
