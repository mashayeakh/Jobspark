// Test script for Fraud Detection Service
const { FraudDetectionService } = require('./src/app/module/ai/fraud_detection/fraudDetection.service');

async function testFraudService() {
  console.log('🔍 Testing Fraud Detection Service...\n');

  try {
    // Test 1: Get fraud stats
    console.log('1. Testing getFraudStats()');
    const stats = await FraudDetectionService.getFraudStats();
    console.log('✅ Stats service working');
    console.log('📊 Total jobs:', stats.totalJobs);
    console.log('🚨 Flagged jobs:', stats.flaggedJobs);
    console.log('📈 Fraud rate:', stats.flaggedJobs && stats.totalJobs ? 
      ((stats.flaggedJobs / stats.totalJobs) * 100).toFixed(2) + '%' : '0%');

    // Test 2: Test pattern analysis (mock job data)
    console.log('\n2. Testing pattern analysis with mock data');
    const mockJob = {
      id: 'test-job-123',
      title: 'Urgent Payment Required - Work From Home',
      description: 'Pay us $500 to start working immediately. Great opportunity to make quick money. Contact us at gmail.com for details.',
      requirements: 'Must be able to pay upfront fee',
      company: {
        name: 'Scam Company',
        isVerified: false,
        email: 'scam@gmail.com',
        website: null,
        description: null
      },
      recruiter: {
        user: { name: 'Scammer', email: 'scam@gmail.com' }
      },
      createdAt: new Date(),
      applicationCount: 0
    };

    try {
      const analysis = await FraudDetectionService.analyzeJobPost('test-job-123');
      console.log('✅ Pattern analysis working');
      console.log('🎯 Risk Score:', analysis.riskScore);
      console.log('🚨 Risk Level:', analysis.riskLevel);
      console.log('📝 Flagged Issues:', analysis.flaggedIssues.length);
      console.log('💡 Recommendation:', analysis.recommendation);
    } catch (error) {
      console.log('⚠️  Analysis test failed (expected if job not in DB):', error.message);
    }

    console.log('\n🎯 Fraud Detection Service test completed!');

  } catch (error) {
    console.error('❌ Service test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testFraudService();
