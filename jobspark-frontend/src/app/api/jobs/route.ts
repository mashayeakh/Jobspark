import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔗 [DIRECT-API] Connecting to backend jobs endpoint...');
    
    // Try different possible endpoints
    const endpoints = [
      'http://localhost:3000/api/v2/jobs',
      'http://localhost:3000/jobs',
      'http://localhost:3000/api/jobs'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔗 [DIRECT-API] Trying: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ [DIRECT-API] Success from ${endpoint}`);
          console.log(`📊 [DIRECT-API] Found ${data.result?.length || data.length || 0} jobs`);
          
          return NextResponse.json({
            success: true,
            message: `Jobs retrieved from ${endpoint}`,
            result: data.result || data,
            endpoint: endpoint
          });
        } else {
          console.log(`❌ [DIRECT-API] ${endpoint} returned ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ [DIRECT-API] Failed to connect to ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    
    // If no endpoint works, return empty result
    return NextResponse.json({
      success: false,
      message: "No backend endpoint available",
      result: [],
      availableEndpoints: endpoints
    });
    
  } catch (error) {
    console.error('🔗 [DIRECT-API] Critical error:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch jobs",
      error: error instanceof Error ? error.message : 'Unknown error',
      result: []
    }, { status: 500 });
  }
}
