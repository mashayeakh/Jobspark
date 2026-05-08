import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword, accountType } = await request.json();

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Mock authentication - in real app, you'd save to database
    // Check if user already exists (mock)
    if (email === 'admin@jobspark.com') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email already exists' 
        },
        { status: 409 }
      );
    }

    // Mock successful signup
    return NextResponse.json(
      { 
        success: true,
        message: 'Account created successfully',
        user: {
          id: Date.now(),
          name: name,
          email: email,
          accountType: accountType,
          createdAt: new Date().toISOString()
        }
      },
      { status: 201 }
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
