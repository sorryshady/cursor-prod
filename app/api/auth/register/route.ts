import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'


export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Create new user with PENDING status
    const user = await prisma.user.create({
      data: {
        ...data,
        verificationStatus: 'PENDING'
      }
    })

    return NextResponse.json({
      message: 'Registration successful. Waiting for admin approval.',
      userId: user.id
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
