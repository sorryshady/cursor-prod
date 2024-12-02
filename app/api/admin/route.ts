"use server";

import { prisma } from '@/lib/db'
import { VerificationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userType = searchParams.get("userType");

    // Check admin authorization
    const user = await auth();
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Helper function for fetching users by verification status
    const fetchUsersByStatus = async (status: VerificationStatus) => {
      return prisma.user.findMany({
        where: { verificationStatus: status },
        select: {
          id: true,
          name: true,
          email: true,
          membershipId: true,
          userRole: true,
          userStatus: true,
          verificationStatus: true,
          committeeType: true,
          positionState: true,
          positionDistrict: true,
        }
      });
    };

    // Return users based on requested type
    switch (userType) {
      case "verified":
        return NextResponse.json({
          verifiedUsers: await fetchUsersByStatus("VERIFIED"),
        });
      case "pending":
        return NextResponse.json({
          pendingUsers: await fetchUsersByStatus("PENDING"),
        });
      case "rejected":
        return NextResponse.json({
          rejectedUsers: await fetchUsersByStatus("REJECTED"),
        });
      default:
        return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authorization
    const user = await auth();
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const membershipId = searchParams.get("membershipId");

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await prisma.user.delete({
      where: { membershipId: Number(membershipId) },
      select: {
        id: true,
        name: true,
        email: true,
        membershipId: true,
        userRole: true,
        userStatus: true,
        verificationStatus: true,
      }
    });

    return NextResponse.json({
      message: `User deleted successfully`,
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error in DELETE handler:", error);

    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authorization
    const user = await auth();
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { membershipId, email, ...updateData } = body;

    // Find user by membershipId or email
    const existingUser = await prisma.user.findUnique({
      where: membershipId ? { membershipId: Number(membershipId) } : { email },
      select: { id: true }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        membershipId: true,
        userRole: true,
        userStatus: true,
        verificationStatus: true,
        committeeType: true,
        positionState: true,
        positionDistrict: true,
      }
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
