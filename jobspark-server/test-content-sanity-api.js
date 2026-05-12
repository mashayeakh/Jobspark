// Test script to verify Content Sanity API endpoints
const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v2${path}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📍 Endpoint: http://localhost:3000/api/v2${path}`);

    const req = http.request(options, (res) => {
      console.log(`✅ Status: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('📦 Response:', JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('📦 Raw Response:', data);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Error: ${e.message}`);
      console.log('💡 Make sure the backend server is running on port 3000');
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing Content Sanity API Endpoints...\n');
  
  await testEndpoint('/admin/content-sanity/stats', 'Stats API');
  await testEndpoint('/admin/content-sanity/jobs', 'Jobs API');
  
  console.log('\n✨ Test completed!');
}

runTests();
