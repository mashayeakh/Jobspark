import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    // Validate job ID
    if (!jobId || /^[a-zA-Z0-9-]{1,50}$/.test(jobId) === false) {
      return NextResponse.json({
        success: false,
        message: "Invalid job ID format",
        error: "Job ID must be alphanumeric and max 50 characters"
      }, { status: 400 });
    }

    // Call the actual backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${backendUrl}/api/v2/admin/content-sanity/analyze/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the backend response directly
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error analyzing job:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to analyze job from backend",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
