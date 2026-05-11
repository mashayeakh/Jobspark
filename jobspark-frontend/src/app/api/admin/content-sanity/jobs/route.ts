import { NextRequest, NextResponse } from 'next/server';
import { ContentSanityService } from '@/lib/contentSanityService';

export async function GET(request: NextRequest) {
  try {
    console.log(' [FRONTEND-API] Starting jobs proxy...');

    // First try to call the actual backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendEndpoint = `${backendUrl}/api/v2/admin/content-sanity/jobs`;

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
      const frontendJobs = await ContentSanityService.getAnalyzedJobs();

      return NextResponse.json({
        success: true,
        message: "Jobs retrieved from frontend service (backend unavailable)",
        result: frontendJobs,
        usingFallback: true
      });
    }

  } catch (error) {
    console.error(' [FRONTEND-API] Critical error in jobs API:', error);

    // Final fallback - return empty array
    return NextResponse.json({
      success: false,
      message: "Failed to fetch jobs",
      error: error instanceof Error ? error.message : 'Unknown error',
      result: []
    }, { status: 200 });
  }
}
