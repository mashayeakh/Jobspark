import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        const response = await fetch(`${backendUrl}/api/v2/admin/fraud-shield/analyze-all`, {
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
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in fraud shield batch analysis:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to complete batch analysis from backend',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
