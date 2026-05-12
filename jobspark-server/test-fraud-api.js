// Test script for Fraud Detection API
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/admin/fraud-shield';

// Test endpoints
async function testFraudAPI() {
  console.log('🔍 Testing Fraud Detection API...\n');

  try {
    // Test 1: Get fraud stats
    console.log('1. Testing GET /stats');
    const statsResponse = await fetch(`${API_BASE}/stats`, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN', // Replace with actual token
        'Content-Type': 'application/json'
      }
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Stats API working:', stats.success);
      console.log('📊 Total jobs:', stats.result?.totalJobs);
      console.log('🚨 Flagged jobs:', stats.result?.flaggedJobs);
    } else {
      console.log('❌ Stats API failed:', statsResponse.status);
    }

    // Test 2: Get metrics
    console.log('\n2. Testing GET /metrics');
    const metricsResponse = await fetch(`${API_BASE}/metrics`, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    if (metricsResponse.ok) {
      const metrics = await metricsResponse.json();
      console.log('✅ Metrics API working:', metrics.success);
      console.log('📈 Fraud rate:', metrics.result?.fraudRate + '%');
    } else {
      console.log('❌ Metrics API failed:', metricsResponse.status);
    }

    // Test 3: Get alerts
    console.log('\n3. Testing GET /alerts');
    const alertsResponse = await fetch(`${API_BASE}/alerts`, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    if (alertsResponse.ok) {
      const alerts = await alertsResponse.json();
      console.log('✅ Alerts API working:', alerts.success);
      console.log('🚨 Recent alerts:', alerts.result?.length || 0);
    } else {
      console.log('❌ Alerts API failed:', alertsResponse.status);
    }

    console.log('\n🎯 Fraud Detection API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFraudAPI();
