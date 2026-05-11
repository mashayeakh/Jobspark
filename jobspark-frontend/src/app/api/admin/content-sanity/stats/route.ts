import { NextRequest, NextResponse } from 'next/server';
import { ContentSanityService } from '@/lib/contentSanityService';

export async function GET(request: NextRequest) {
  try {
    console.log(' [FRONTEND-API] Starting stats proxy...');

    // First try to call the actual backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendEndpoint = `${backendUrl}/api/v2/admin/content-sanity/stats`;

    console.log(' [FRONTEND-API] Calling backend:', backendEndpoint);

    let backendResponse;
    try {
      const response = await fetch(backendEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
          'Authorization': request.headers.get('authorization') || '',
        },
      });

      console.log(' [FRONTEND-API] Backend response status:', response.status);
      console.log(' [FRONTEND-API] Backend response ok:', response.ok);

      if (response.ok) {
        backendResponse = await response.json();
        console.log(' [FRONTEND-API] Backend response data:', backendResponse);
        return NextResponse.json(backendResponse);
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (backendError) {
      console.warn(' [FRONTEND-API] Backend not available, using frontend service:', backendError instanceof Error ? backendError.message : 'Unknown error');

      // Use frontend service as fallback
      const frontendStats = await ContentSanityService.getStats();

      return NextResponse.json({
        success: true,
        message: "Stats retrieved from frontend service (backend unavailable)",
        result: frontendStats,
        usingFallback: true
      });
    }

  } catch (error) {
    console.error(' [FRONTEND-API] Critical error in stats API:', error);

    // Final fallback - return empty stats
    const emptyStats = {
      totalJobs: 0,
      safeJobs: 0,
      flaggedJobs: 0,
      sanityRate: '0',
      biasBreakdown: { gender: 0, age: 0, race: 0 },
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 }
    };

    return NextResponse.json({
      success: false,
      message: "Failed to fetch stats",
      error: error instanceof Error ? error.message : 'Unknown error',
      result: emptyStats
    }, { status: 200 });
  }
}
