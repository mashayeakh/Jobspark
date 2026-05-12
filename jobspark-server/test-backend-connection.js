// Test script to check if backend server is running
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/admin/content-sanity/stats',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Backend Status: ${res.statusCode}`);
  console.log(`Backend Response: ${res.statusMessage}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Backend Response Data:', parsed);
    } catch (e) {
      console.log('Raw Backend Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Backend Connection Error:', e.message);
  console.log('Backend server is not running or not accessible');
});

req.end();
