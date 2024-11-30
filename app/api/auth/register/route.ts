import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { registrationSchema } from '@/lib/validations/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registrationSchema.parse(body)

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

    // Create the user in database with PENDING verification status
    const user = await prisma.user.create({
      data: {
        name: data.name,
        dob: new Date(data.dob),
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        userStatus: data.userStatus,
        department: data.department,
        designation: data.designation,
        officeAddress: data.officeAddress,
        workDistrict: data.workDistrict,
        personalAddress: data.personalAddress,
        homeDistrict: data.homeDistrict,
        email: data.email,
        phoneNumber: data.phoneNumber,
        mobileNumber: data.mobileNumber,
        photoUrl: data.photoUrl,
        photoId: data.photoId,
        verificationStatus: 'PENDING', // Default status
      },
    })

    return NextResponse.json({
      message: 'Registration successful. Please wait for admin verification.',
      user
    })

  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
