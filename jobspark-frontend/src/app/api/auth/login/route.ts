import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock authentication - in real app, you'd verify against database
    if (email === 'admin@jobspark.com' && password === 'password123') {
      return NextResponse.json(
        { 
          success: true,
          message: 'Login successful',
          user: {
            id: 1,
            name: 'Admin User',
            email: email
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid email or password' 
      },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
