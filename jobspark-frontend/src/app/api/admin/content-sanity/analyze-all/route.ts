import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Call the actual backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${backendUrl}/api/v2/admin/content-sanity/analyze-all`, {
      method: 'POST',
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
    console.error('Error in batch analysis:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to complete batch analysis from backend",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
